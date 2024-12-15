/**
 * Checks if a value is a boolean or a string representation of a boolean.
 *
 * This function is particularly useful for checking environment variables
 * which are often stored as strings.
 *
 * @param value - The value to check. Can be of any type.
 * @returns true if the value is boolean true or the string 'true' (case-insensitive),
 *          false for all other inputs.
 *
 * @example
 * console.log(isBoolean(true));           // Output: true
 * console.log(isBoolean('true'));         // Output: true
 * console.log(isBoolean('TRUE'));         // Output: true
 * console.log(isBoolean('True'));         // Output: true
 * console.log(isBoolean(false));          // Output: false
 * console.log(isBoolean('false'));        // Output: false
 * console.log(isBoolean(''));             // Output: false
 * console.log(isBoolean('hello'));        // Output: false
 * console.log(isBoolean(1));              // Output: false
 * console.log(isBoolean(null));           // Output: false
 * console.log(isBoolean(undefined));      // Output: false
 */
export const isBoolean = (value: unknown): boolean => {
  try {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
  } catch (err) {
    console.error('Error in isBoolean check:', err);
    return false;
  }
  return false;
};

/**
 * Safely converts an object to a JSON string while automatically redacting sensitive information.
 *
 * Helper function to safely stringify environment values.
 *
 * @param obj - The value to convert to a JSON string. Can be any JSON-serializable value.
 * @param redactedWord - Optional additional word to trigger redaction. Must be a non-empty string.
 * @returns A formatted JSON string with sensitive data redacted.
 * @throws {Error} If redactedWord is provided but is not a valid non-empty string.
 *
 * @example
 * // Basic usage
 * const data = {
 *   username: "nasr",
 *   PASSWORD: "secret123",
 *   API_KEY: "abc123"
 * };
 *
 * console.log(safeStringify(data));
 * // Output:
 * // {
 * //   "username": "nasr",
 * //   "PASSWORD": "[REDACTED]",
 * //   "API_KEY": "abc123"
 * // }
 *
 * // With custom redaction word
 * console.log(safeStringify(data, "KEY"));
 * // Output:
 * // {
 * //   "username": "nasr",
 * //   "PASSWORD": "[REDACTED]",
 * //   "API_KEY": "[REDACTED]"
 * // }
 *
 * @remarks
 * - Uses JSON.stringify with a replacer function to process the object
 * - Always redacts properties containing 'SECRET' or 'PASSWORD' (case-sensitive)
 * - Optionally redacts properties containing the specified redactedWord
 * - The output is formatted with 2-space indentation for readability
 * - Safe to use with circular references (will throw TypeError like standard JSON.stringify)
 */
export function safeStringify(obj: unknown, redactedWord?: string): string {
  // Validate redactedWord if provided
  if (
    redactedWord !== undefined &&
    (typeof redactedWord !== 'string' || redactedWord.trim() === '')
  ) {
    throw new Error('redactedWord must be a non-empty string');
  }

  return JSON.stringify(
    obj,
    (key, value) => {
      if (
        key.includes('SECRET') ||
        key.includes('PASSWORD') ||
        (redactedWord && key.includes(redactedWord))
      ) {
        return '[REDACTED]';
      }
      return value;
    },
    2,
  );
}

/**
 * Converts any input value into an array safely, handling various edge cases.
 *
 * @param args - The value to convert to an array. Can be of any type (null, undefined, array, object, or primitive).
 * @returns An array containing the input value(s)
 *
 * @description
 * This function handles the following cases:
 * - null/undefined → returns empty array
 * - existing array → returns the original array
 * - object → returns single-element array containing the object
 * - primitive values → returns single-element array containing the value
 *
 * @example
 * // Handling null/undefined
 * safeArray(null)       // returns []
 * safeArray(undefined)  // returns []
 *
 * @example
 * // Handling arrays
 * safeArray([1, 2, 3])  // returns [1, 2, 3]
 * safeArray([])         // returns []
 *
 * @example
 * // Handling objects
 * safeArray({ id: 1 })  // returns [{ id: 1 }]
 *
 * @example
 * // Handling primitives
 * safeArray('test')     // returns ['test']
 * safeArray(42)         // returns [42]
 * safeArray(true)       // returns [true]
 *
 * @example
 * // Comma-separated strings
 * safeArray('1, 2, 3'); // ['1', '2', '3']
 * safeArray('apple,banana, orange'); // ['apple', 'banana', 'orange']
 * safeArray('mohamed@email.com, nasr@email.com'); // ['mohamed@email.com', 'nasr@email.com']
 *
 * @throws {never} This function never throws - it handles all error cases internally
 */
export function safeArray(args: unknown): unknown[] {
  // Handle null/undefined cases
  if (args === undefined || args === null) {
    return [];
  }

  // Preserve existing arrays
  if (Array.isArray(args)) {
    return args;
  }

  // Handle string inputs
  if (typeof args === 'string') {
    // Trim the string first
    const trimmedStr = args.trim();

    // Return empty array for empty strings
    if (trimmedStr === '') {
      return [];
    }

    // Convert comma-separated strings to arrays
    if (trimmedStr.includes(',')) {
      const items = trimmedStr
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== ''); // Remove empty items

      // If all items were empty, return empty array
      return items.length > 0 ? items : [];
    }

    // Single non-empty string
    return [trimmedStr];
  }

  // Handle object inputs
  if (typeof args === 'object') {
    try {
      return [args];
    } catch (error) {
      console.error('Error converting object to array:', error);
      return [`[Unprocessable object: ${typeof args}]`];
    }
  }

  // Handle all other types by wrapping in array
  return [args];
}

/**
 * Check if the memory usage is above a certain threshold.
 * This uses the `performance.memory` API, which is available only in certain browsers (e.g., Chrome).
 */
export const checkMemoryUsage = () => {
  if (typeof window !== 'undefined' && window.performance) {
    // Check if memory property is available in the browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const performanceMemory = (window.performance as any).memory;
    if (performanceMemory) {
      const { usedJSHeapSize, totalJSHeapSize } = performanceMemory;
      if (usedJSHeapSize > totalJSHeapSize * 0.8) {
        console.warn('🚨 Memory usage is high! Please monitor performance.');
      }
    } else {
      console.warn('🚫 Memory API is not supported in this browser.');
    }
  }
};
