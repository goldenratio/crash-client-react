export function isStringEmpty(value: string): boolean {
  return value.trim() === "";
}

export function toInt(value: unknown): number | undefined {
  if (typeof value === "string") {
    if (isStringEmpty(value)) {
      return undefined;
    }
    const val = Number.parseInt(value, 10);
    if (!Number.isNaN(val)) {
      return val;
    }
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return Math.floor(value);
  }
  return undefined;
}

export function toNumber(value: unknown): number | undefined {
  if (typeof value === "string") {
    if (isStringEmpty(value)) {
      return undefined;
    }
    const val = Number(value);
    if (!Number.isNaN(val)) {
      return val;
    }
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  return undefined;
}

export function toFloat(value: unknown): number | undefined {
  if (typeof value === "string") {
    if (isStringEmpty(value)) {
      return undefined;
    }
    const val = Number.parseFloat(value);
    if (!Number.isNaN(val)) {
      return val;
    }
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  return undefined;
}

export function toBoolean(value: unknown, fallbackValue: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const valueLowerCase = value.toLowerCase();
    if (valueLowerCase === "true" || valueLowerCase === "1") {
      return true;
    }

    if (valueLowerCase === "false" || valueLowerCase === "0") {
      return false;
    }
  }

  return fallbackValue;
}

export function isDefined<T>(arg: T | null | undefined): arg is T {
  return arg !== null && arg !== undefined;
}

export function parseStringFromData(val: string): Date | undefined {
  const date = new Date(val);
  if (!Number.isNaN(date.getTime())) {
    return date;
  }
  return undefined;
}
