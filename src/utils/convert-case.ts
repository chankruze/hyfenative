type AnyObject = Record<string, unknown>;

/**
 * Converts a snake_case string to camelCase.
 */
const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

/**
 * Converts a camelCase or PascalCase string to snake_case.
 */
const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

/**
 * Recursively converts object keys to camelCase.
 */
export const convertKeysToCamelCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as unknown as T;
  } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.fromEntries(
      Object.entries(obj as AnyObject).map(([k, v]) => [
        toCamelCase(k),
        convertKeysToCamelCase(v),
      ]),
    ) as T;
  }
  return obj;
};

/**
 * Recursively converts object keys to snake_case.
 */
export const convertKeysToSnakeCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase) as unknown as T;
  } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.fromEntries(
      Object.entries(obj as AnyObject).map(([k, v]) => [
        toSnakeCase(k),
        convertKeysToSnakeCase(v),
      ]),
    ) as T;
  }
  return obj;
};
