export function delay(timeout: number = 5000) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), timeout);
  });
}