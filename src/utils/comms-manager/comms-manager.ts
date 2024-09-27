import { Builder, ByteBuffer } from "flatbuffers";
import { type Observable, Subject, fromEvent } from "rxjs";
import {
  BetRequest,
  BettingTimerStarted,
  BettingTimerUpdate,
  CrashOutRequest,
  CrashOutResponse,
  GameRequestEvent,
  GameResponseEvent,
  GameUpdate,
  JoinGameRequest,
  JoinGameResponse,
  RemotePlayerBetsPlaced,
  RemotePlayerCrashOut,
  RemotePlayerJoined,
  RemotePlayerLeft,
  RequestMessages,
  ResponseMessage,
} from "../../gen/gameplay-fbdata";
import { unwrap } from "../assert-utils";
import { DisposeBag } from "../dispose-bag";
import {
  type AuthResponseType,
  BettingTimerStartedData,
  type BettingTimerUpdateData,
  type ConnectionClosedData,
  type CrashOutResultData,
  type GameFinishedData,
  type GameJoinedData,
  GameJoinError,
  type GameStartedData,
  GameState,
  type GameUpdateData,
  type RemotePlayerBetsPlacedData,
  type RemotePlayerCrashOutData,
  type RemotePlayerJoinedData,
  type RemotePlayerLeftData,
} from "./types";

const baseHttpApiPath = "http://127.0.0.1:8090/api";
const baseWsGamePath = "ws://127.0.0.1:8090/ws";

export class CommsManager {
  private readonly _gameJoinedSubject$ = new Subject<GameJoinedData>();
  private readonly _gameJoinErrorSubject$ = new Subject<void>();
  private readonly _gameStartedSubject$ = new Subject<GameStartedData>();
  private readonly _gameUpdateSubject$ = new Subject<GameUpdateData>();
  private readonly _gameFinishedSubject$ = new Subject<GameFinishedData>();
  private readonly _crashOutResult$ = new Subject<CrashOutResultData>();
  private readonly _bettingTimerStartedSubject$ = new Subject<BettingTimerStartedData>();
  private readonly _bettingTimerUpdateSubject$ = new Subject<BettingTimerUpdateData>();
  private readonly _bettingTimerFinishedSubject$ = new Subject<void>();
  private readonly _remotePlayerJoined$ = new Subject<RemotePlayerJoinedData>();
  private readonly _remotePlayerLeft$ = new Subject<RemotePlayerLeftData>();
  private readonly _remotePlayerBetsPlaced$ = new Subject<RemotePlayerBetsPlacedData>();
  private readonly _remotePlayerCrashOut$ = new Subject<RemotePlayerCrashOutData>();
  private readonly _closedSubject$ = new Subject<ConnectionClosedData>();
  private readonly _disposeBag = new DisposeBag();

  private _socket: WebSocket | undefined;

  constructor() {
    // console.log("socket connection!");
    // this.connect();
  }

  async connect(): Promise<GameJoinedData | GameJoinError> {
    return new Promise(async (resolve) => {
      const authResponse = await this.getAuthToken();
      if (!authResponse.success) {
        this._gameJoinErrorSubject$.next();
        this._gameJoinErrorSubject$.complete();
        return resolve({ type: 'error' });
      }

      this._socket = new WebSocket(`${baseWsGamePath}/crash-game`);
      this._socket.binaryType = "arraybuffer";

      const createGameJoinRequestData = () => {
        const builder = new Builder(0);
        builder.clear();

        //         const authResponse = {
        //     "jwtToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjU5OTE5MjAsInV1aWQiOiI2NjA0M2U5ZS05NTY1LTQwNmYtYWQ4Ni1jNzNmNzcyY2EwNDEifQ.zxc7aemmr6MwTSGL8MJWw8OOgyPFrQbfiQkLJBXjHRw",
        //     "uuid": "66043e9e-9565-406f-ad86-c73f772ca041",
        //     "displayName": ""
        // }
        const uuidStr = builder.createString(authResponse.uuid);
        const tokenStr = builder.createString(authResponse.jwtToken);

        JoinGameRequest.startJoinGameRequest(builder);
        JoinGameRequest.addPlayerUuid(builder, uuidStr);
        JoinGameRequest.addJwtToken(builder, tokenStr);
        const msgOffset = JoinGameRequest.endJoinGameRequest(builder);
        // builder.finish(msgOffset);

        const offset = GameRequestEvent.createGameRequestEvent(builder, RequestMessages.JoinGameRequest, msgOffset);
        builder.finish(offset);

        const bytes = builder.asUint8Array();
        return bytes;
      };

      this._disposeBag.completable$(fromEvent(this._socket, "open")).subscribe(() => {
        console.log("socket connection opened!");
        const joinData = createGameJoinRequestData();
        this.socket.send(joinData);
      });

      this._disposeBag.completable$(fromEvent<MessageEvent>(this._socket, "message")).subscribe((event) => {
        const bytes = new Uint8Array(event.data);
        const buffer = new ByteBuffer(bytes);
        const gameResponseEvent = GameResponseEvent.getRootAsGameResponseEvent(buffer);
        const eventType = gameResponseEvent.msgType();

        switch (eventType) {
          case ResponseMessage.JoinGameResponse: {
            const joinData = JoinGameResponse.getRootAsJoinGameResponse(buffer);
            const msg: JoinGameResponse = gameResponseEvent.msg(joinData);

            const responseData: GameJoinedData = {
              type: 'success',
              gameState: msg.gameState(),
              bettingTimeLeft: msg.bettingTimeLeft(),
              multiplier: msg.multiplier(),
              roundTimeElapsed: msg.roundTimeElapsed(),
              displayName: msg.displayName() || "guest",
              balance: Number(msg.balance()),
            };

            this._gameJoinedSubject$.next(responseData);
            this._gameJoinedSubject$.complete();

            resolve(responseData);

            break;
          }

          case ResponseMessage.GameStarted: {
            // const data = GameStarted.getRootAsGameStarted(buffer);
            // const msg: GameStarted = gameResponseEvent.msg(data);
            // console.log("game started: ", msg);
            this._gameStartedSubject$.next({ gameState: GameState.GAME_IN_PROGRESS });
            break;
          }

          case ResponseMessage.GameFinished: {
            // const data = GameFinished.getRootAsGameFinished(buffer);
            // const msg: GameFinished = gameResponseEvent.msg(data);
            // console.log("game finished: ", msg);
            this._gameFinishedSubject$.next({ gameState: GameState.IDLE });
            break;
          }

          case ResponseMessage.GameUpdate: {
            const data = GameUpdate.getRootAsGameUpdate(buffer);
            const msg: GameUpdate = gameResponseEvent.msg(data);
            this._gameUpdateSubject$.next({ multiplier: msg.multiplier() / 100 });
            break;
          }

          case ResponseMessage.CrashOutResponse: {
            const data = CrashOutResponse.getRootAsCrashOutResponse(buffer);
            const msg: CrashOutResponse = gameResponseEvent.msg(data);
            this._crashOutResult$.next({ winAmount: Number(msg.winAmount()), multiplier: msg.multiplier() / 100 });
            break;
          }

          case ResponseMessage.BettingTimerStarted: {
            const data = BettingTimerStarted.getRootAsBettingTimerStarted(buffer);
            const msg: BettingTimerStarted = gameResponseEvent.msg(data);
            console.log({ bettingTimeLeft: msg.bettingTimeLeft(), roundId: msg.roundId() });
            this._bettingTimerStartedSubject$.next({ bettingTimeLeft: msg.bettingTimeLeft(), roundId: msg.roundId().toString() });
            break;
          }

          case ResponseMessage.BettingTimerUpdate: {
            const data = BettingTimerUpdate.getRootAsBettingTimerUpdate(buffer);
            const msg: BettingTimerUpdate = gameResponseEvent.msg(data);
            const bettingTimeLeft = msg.bettingTimeLeft();
            this._bettingTimerUpdateSubject$.next({ bettingTimeLeft: bettingTimeLeft });
            if (bettingTimeLeft <= 0) {
              this._bettingTimerFinishedSubject$.next();
            }
            break;
          }

          case ResponseMessage.RemotePlayerJoined: {
            const data = RemotePlayerJoined.getRootAsRemotePlayerJoined(buffer);
            const msg: RemotePlayerJoined = gameResponseEvent.msg(data);
            this._remotePlayerJoined$.next({ displayName: msg.displayName() || "" });
            break;
          }

          case ResponseMessage.RemotePlayerLeft: {
            const data = RemotePlayerLeft.getRootAsRemotePlayerLeft(buffer);
            const msg: RemotePlayerLeft = gameResponseEvent.msg(data);
            this._remotePlayerLeft$.next({ displayName: msg.displayName() || "" });
            break;
          }

          case ResponseMessage.RemotePlayerBetsPlaced: {
            const data = RemotePlayerBetsPlaced.getRootAsRemotePlayerBetsPlaced(buffer);
            const msg: RemotePlayerBetsPlaced = gameResponseEvent.msg(data);
            this._remotePlayerBetsPlaced$.next({
              displayName: msg.displayName() || "",
              betAmount: Number(msg.betAmount()),
            });
            break;
          }

          case ResponseMessage.RemotePlayerCrashOut: {
            const data = RemotePlayerCrashOut.getRootAsRemotePlayerCrashOut(buffer);
            const msg: RemotePlayerCrashOut = gameResponseEvent.msg(data);
            this._remotePlayerCrashOut$.next({
              displayName: msg.displayName() || "",
              winAmount: Number(msg.winAmount()),
            });
            break;
          }

          default:
            break;
        }
      });

      this._disposeBag.completable$(fromEvent<CloseEvent>(this._socket, "close")).subscribe((event) => {
        const data = { errorCode: event.code, reason: event.reason };
        console.log("socket closed!", data);
        this._closedSubject$.next(data);
      });

      // resolve();
    });
  }

  dispose(): void {
    if (this._socket) {
      this._socket.close();
    }
    this._disposeBag.dispose();
  }

  placeBetRequest(betAmount: number): void {
    const builder = new Builder(0);
    builder.clear();

    BetRequest.startBetRequest(builder);
    BetRequest.addBetAmount(builder, BigInt(betAmount));
    const msgOffset = BetRequest.endBetRequest(builder);
    // builder.finish(msgOffset);

    const offset = GameRequestEvent.createGameRequestEvent(builder, RequestMessages.BetRequest, msgOffset);
    builder.finish(offset);

    const bytes = builder.asUint8Array();
    this.socket.send(bytes);
  }

  crashOutRequest(): void {
    const builder = new Builder(0);
    builder.clear();

    CrashOutRequest.startCrashOutRequest(builder);
    const msgOffset = CrashOutRequest.endCrashOutRequest(builder);
    // builder.finish(msgOffset);

    const offset = GameRequestEvent.createGameRequestEvent(builder, RequestMessages.CrashOutRequest, msgOffset);
    builder.finish(offset);

    const bytes = builder.asUint8Array();
    this.socket.send(bytes);
  }

  private async getAuthToken(): Promise<AuthResponseType> {
    return new Promise((resolve) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "", password: "", playMode: "FUN" }),
      };
      fetch(`${baseHttpApiPath}/login`, requestOptions)
        .then(async (response) => {
          const json = await response.json();
          console.log(json);
          if (typeof json.errorCode === "number") {
            resolve({ success: false });
          } else {
            resolve({ success: true, jwtToken: json.jwtToken, uuid: json.uuid, displayName: json.displayName });
          }
        })
        .catch((err) => {
          console.error("ERROR:", err);
          resolve({ success: false });
        });
    });
  }

  private get socket(): WebSocket {
    return unwrap(this._socket, "this._socket is undefined!");
  }

  get gameJoined$(): Observable<GameJoinedData> {
    return this._gameJoinedSubject$.asObservable();
  }

  get gameStarted$(): Observable<GameStartedData> {
    return this._gameStartedSubject$.asObservable();
  }

  get gameFinished$(): Observable<GameFinishedData> {
    return this._gameFinishedSubject$.asObservable();
  }

  get gameUpdate$(): Observable<GameUpdateData> {
    return this._gameUpdateSubject$.asObservable();
  }

  get crashOutResult$(): Observable<CrashOutResultData> {
    return this._crashOutResult$.asObservable();
  }

  get bettingTimerStarted$(): Observable<BettingTimerStartedData> {
    return this._bettingTimerStartedSubject$.asObservable();
  }

  get bettingTimerLeft$(): Observable<BettingTimerUpdateData> {
    return this._bettingTimerUpdateSubject$.asObservable();
  }

  get bettingTimerFinished$(): Observable<void> {
    return this._bettingTimerFinishedSubject$.asObservable();
  }

  get remotePlayerJoined$(): Observable<RemotePlayerJoinedData> {
    return this._remotePlayerJoined$.asObservable();
  }

  get remotePlayerLeft$(): Observable<RemotePlayerLeftData> {
    return this._remotePlayerLeft$.asObservable();
  }

  get remotePlayerBetsPlaced$(): Observable<RemotePlayerBetsPlacedData> {
    return this._remotePlayerBetsPlaced$.asObservable();
  }

  get remotePlayerCrashOut$(): Observable<RemotePlayerCrashOutData> {
    return this._remotePlayerCrashOut$.asObservable();
  }

  get closed$(): Observable<ConnectionClosedData> {
    return this._closedSubject$.asObservable();
  }
}
