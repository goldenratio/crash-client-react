import { toInt, toNumber } from "./type-utils";

export function assertExists(obj: unknown, assertion: string): void {
  if (typeof obj === "undefined" || obj === null) {
    throw new Error(assertion);
  }
}

export function assertNever(value: never): never {
  throw new Error(`unhandled case ${value}`);
}

export function assertTrue(value: boolean, assertion: string): void {
  if (value === false) {
    throw new Error(assertion);
  }
}

/**
 * Throws error if value is null or undefined and returns non-null and non-undefined values
 * @param value
 * @param assertion
 */
export function unwrap<T>(value: T | null | undefined, assertion: string): T {
  assertExists(value, assertion);
  if (value) {
    return value;
  }
  throw new Error("unwrap error");
}

export function unwrapAsString<T>(value: T | null | undefined, assertion: string): string {
  let valStr: string | undefined;
  if (typeof value === "string") {
    valStr = value;
  } else if (typeof value === "number") {
    valStr = value.toString();
  }
  return unwrap(valStr, assertion);
}

export function unwrapAsInt<T = unknown>(value: T | null | undefined, assertion: string): number {
  const intValue = toInt(value);
  return unwrap(intValue, assertion);
}

export function unwrapAsNumber<T = unknown>(value: T | null | undefined, assertion: string): number {
  const intValue = toNumber(value);
  return unwrap(intValue, assertion);
}
