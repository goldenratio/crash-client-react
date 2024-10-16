import { type Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import type { Disposable, DisposeCallback } from "./disposable";

export class DisposeBag implements Disposable {
  private readonly _dispose$ = new Subject<void>();
  private readonly _list = new Set<DisposeCallback>();
  private _isDisposed = false;

  add(item: Disposable | DisposeCallback) {
    if (this._isDisposed) {
      throw new Error("disposeBag already disposed, create a new disposeBag");
    }
    this._list.add(() => {
      if (typeof item === "function") {
        item();
      } else {
        item.dispose();
      }
    });
  }

  completable$<T>(item$: Observable<T>): Observable<T> {
    if (this._isDisposed) {
      throw new Error("disposeBag already disposed, create a new disposeBag");
    }
    return item$.pipe(takeUntil(this._dispose$));
  }

  dispose() {
    this._isDisposed = true;
    this._dispose$.next();
    this._dispose$.complete();

    this._list.forEach((cb) => cb());
    this._list.clear();
  }
}
