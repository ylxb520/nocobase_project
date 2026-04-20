export class FieldIsDependedOnByOtherError extends Error {
  options;
  constructor(options) {
    super(
      `Can't delete field ${options.fieldName} of ${options.fieldCollectionName}, it is used by field ${options.dependedFieldName} in collection ${options.dependedFieldCollectionName} as ${options.dependedFieldAs}`,
    );
    this.options = options;
    this.name = 'FieldIsDependedOnByOtherError';
  }
}
//# sourceMappingURL=field-is-depended-on-by-other.js.map
