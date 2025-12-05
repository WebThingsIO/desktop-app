import { Thing } from './thing.js';

/**
 * Things.
 * 
 * Represents the collection of Things stored in the app.
 * 
 * Provides methods for the things controller to call, and emits events for the
 * things view to listen for when state changes.
 */
export class Things extends EventTarget {
  DB_NAME = 'database';

  constructor() {
    super();
    this.db = new Map();
    this.things = [];
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.DB_NAME, 1);

      request.onerror = (event) => {
        console.error('Error opening database.');
        console.debug(`${event.target.error.name}: ${event.target.error.message}`);
        reject();
      }

      request.onsuccess = (event) => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('Upgrading database...');
        const db = event.target.result;
        const oldVersion = event.oldVersion;

        // Version 1
        if (oldVersion < 1) {
          const thingsObjectStore = db.createObjectStore('things');

          thingsObjectStore.transaction.addEventListener('complete', (event) => {
            console.log('Created Things store in database.')
          });

          thingsObjectStore.transaction.addEventListener('error', (event) => {
            console.error('Error creating things object store.');
            console.debug(`${event.target.error.name}: ${event.target.error.message}`);
          });
        }
      }
    });
  }

  /**
   * Create a Thing.
   * 
   * Saves a Thing to the database.
   * 
   * @param {Object} thingDescription The raw content of the Thing Description parsed from JSON.
   * @param {String} thingUrl The URL from which the Thing Description was retrieved.
   * @returns {Promise<Thing>} A Promise that resolves with a Thing on successful creation or rejects with an
   *   'InvalidRequest', 'InvalidThingDescription' or 'DatabaseError' error.
   */
  create(thingDescription, thingUrl) {
    return new Promise((resolve, reject) => {
      if (!thingDescription || !thingUrl) {
        console.error(`Can't create a Thing without a Thing Description and URL`);
        reject(new Error('InvalidRequest'));
      }
      let thing;

      // Check that the Thing Description is valid.
      try {
        thing = new Thing(thingDescription, thingUrl);
      } catch (error) {
        console.error(`Error parsing Thing Description retrieved from URL ${thingUrl}: ${error}`);
        reject(new Error('InvalidThingDescription'));
      }

      // TODO: Also save Bearer token if required

      const transaction = this.db.transaction(['things'], 'readwrite');

      transaction.oncomplete = (event) => {
        console.log(`Created Thing with id ${thing.id}`);
        this.things.set(thing.id, thing);
        const thingCreatedEvent = new CustomEvent('thingcreated', {detail: thing });
        this.dispatchEvent(thingCreatedEvent);
        const thingsUpdatedEvent = new CustomEvent('thingsupdated', {detail: this.things});
        this.dispatchEvent(thingsUpdatedEvent);
        resolve();
      };

      transaction.onerror = (event) => {
        console.error(`Error creating thing with id ${thing.id}:`);
        console.debug(`${event.target.error.name}: ${event.target.error.message}`);
        reject(new Error('DatabaseError'));
      };

      const objectStore = transaction.objectStore('things');

      objectStore.add({
        'thingDescription': thing.thingDescription,
        'thingUrl': thing.thingUrl
      }, thing.id);
    });
  }

  /**
   * Load all Things from the database into memory.
   * 
   * @returns {Promise} A Promise which resolves on successfully reading Things.
   */
  loadAll() {
    return new Promise((resolve, reject) => {
      let thingRecords = new Map(); // Map of database records
      let things = new Map(); // Map of instantiated Thing object

      const transaction = this.db.transaction('things', 'readonly');
      const objectStore = transaction.objectStore('things');

      const request = objectStore.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          thingRecords.set(cursor.key, cursor.value);
          cursor.continue();
        } else {
          thingRecords.forEach((thingRecord, thingId) => {
            try {
              let thing = new Thing(thingRecord.thingDescription, thingRecord.thingUrl);
              things.set(thingId, thing);
            } catch (error) {
              console.error(`Failed to instantiate thing with id ${thingId}: error`);
            }
          });
          this.things = things;
          const event = new CustomEvent('thingsupdated', {detail: things });
          this.dispatchEvent(event);
          resolve();
        }
      };

      request.onerror = (event) => {
        console.error('Error requesting cursor on things object store');
        console.debug(`${event.target.error.name}: ${event.target.error.message}`);
        reject(new Error('DatabaseError'));
      }
    });
  }

  /**
   * Get a list of Things
   * 
   * @returns {Map<string, Thing>} Map of Thing IDs to Thing objects.
   */
  list() {
    return this.things;
  }

}