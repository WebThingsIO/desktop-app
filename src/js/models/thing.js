import { ValidationError } from './validation-error.js';

/**
 * Thing
 * 
 * Represents a Web Thing.
 * 
 * Implements the W3C WoT Thing Description 1.1 specification.
 * https://www.w3.org/TR/wot-thing-description11/
 */
export class Thing extends EventTarget {
  /**
   * 
   * @param {Object} thingDescription Raw Thing Description.
   * @param {string} thingUrl The URL from which the Thing Description was retrieved.
   */
  constructor(thingDescription, thingUrl) {
    super();
    // Create an empty validation error to collect errors during parsing.
    let validationError = new ValidationError([]);

    this.thingDescription = thingDescription;
    this.thingUrl = thingUrl;

    // Parse mandatory members of Thing Description
    try {
      this.parseTitleMember(thingDescription.title);
    } catch(error) {
      if (error instanceof ValidationError) {
        // Collect validation errors.
        validationError.validationErrors.push(...error.validationErrors);
      } else {
        throw error;
      }
    }

    /* TODO: Parse remaining mandatory members
        - @context
        - security
        - securityDefinitions
    */
  
    // Parse optional members of Thing Description.

    // Parse id member
    if (thingDescription.id) {
      try {
        this.parseIdMember(thingDescription.id);
      } catch(error) {
        if (error instanceof ValidationError) {
          validationError.validationErrors.push(...error.validationErrors);
        } else {
          throw error;
        }
      }   
    }

    // If no id member provide in Thing Description, fall back to thing URL
    if (!this.id) {
      this.id = thingUrl;
    }

    // TODO: Parse remaining optional members of Thing Description.

    // Throw validation errors
    if(validationError.validationErrors.length > 0) {
      throw validationError;
    }
  }

  /**
   * Parse the id member of a Thing Description.
   * 
   * @param {string} id The id member provided in a Thing Description.
   * @throws {ValidationError} A validation error. 
   */
  parseIdMember(id) {
    let idUri;
    try {
      idUri = new URL(id);
      // TODO: Test with URI types other than http, https and urn
    } catch(error) {
      throw new ValidationError([{
        'field': 'id',
        'description': 'id member is not a valid URI'
      }]);
    }
    this.id = idUri.href;
  }

  /**
   * Parse the title member of a Thing Description.
   * 
   * @param {string} title The title provided in the Thing Description.
   * @throws {ValidationError} A validation error.
   */
  parseTitleMember(title) {

    if(!title) {
      throw new ValidationError([{
        'field': '(root)',
        'description': 'Mandatory title member not provided'
      }]);
    }

    if(typeof(title) !== 'string') {
      throw new ValidationError([{
        'field': 'title',
        'description': 'title member is not a string'  
      }]);
    }

    this.title = title;
  }

  /**
   * Get the raw Thing Description which was originally retrieved.
   * 
   * @returns {Object} Thing Description. 
   */
  getThingDescription() {
    return this.thingDescription;
  }

}