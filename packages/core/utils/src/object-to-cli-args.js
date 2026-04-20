/**
 * Convert object to CLI arguments array
 * @param obj Object to convert
 * @returns CLI arguments array
 */
export function objectToCliArgs(obj) {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      return `--${key}=${stringValue}`;
    });
}
//# sourceMappingURL=object-to-cli-args.js.map
