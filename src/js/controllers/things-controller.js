/**
 * Things Controller.
 * 
 * The things controller wires together the things model and things view.
 * It provides callbacks to the things view for user actions and modifies the
 * model.
 */
export class ThingsController {
  
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddThing(this.handleAddThingRequest.bind(this));
  }

  /**
   * Initialise the things controller.
   * 
   * @throws {Error} Throws an error if the model fails to initialise.
   */
  async init() {
    // Initialise the things model and load Things from database.
    try {
      await this.model.init();
      await this.model.loadAll();
    } catch(error) {
      console.debug(error);
      throw new Error('InitialisationError');
    }
  }

  /**
   * Handle a request to add a new Thing.
   * 
   * @param {object} thingDescription The Thing Description of the Thing.
   * @param {string} thingUrl The URL from which the Thing Description was fetched.
   * @returns {Promise} A Promise which resolves on successfully creating the Thing.
   */
  handleAddThingRequest(thingDescription, thingUrl) {
    return this.model.create(thingDescription, thingUrl);
  }
 
}