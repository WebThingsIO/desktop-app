
/**
 * Validation Error.
 * 
 * An error containing one or more validation errors following the format
 * described in the W3C WoT Discovery specification 
 * (https://www.w3.org/TR/wot-discovery/#exploration-directory-api-things-validation)
 */
export class ValidationError extends Error {

  /**
   * Constructor
   * 
   * @param {Array<Object>} validationErrors A list of validation errors, e.g.
   *  [
   *    {
   *      "field": "(root)",
   *      "description": "security is required"
   *    },
   *    {
   *      "field": "properties.status.forms.0.href",
   *      "description": "Invalid type. Expected: string, given: integer"
   *    }
   *  ]
   * @param  {...any} params Other Error parameters.
   */
  constructor(validationErrors, ...params) {
    super(...params);
    this.validationErrors = validationErrors;
  }
}