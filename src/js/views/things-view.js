import { AddThingDialog } from './add-thing-dialog.js';
import { ThingIcon } from './components/thing-icon.js';
import { Toast } from './components/toast.js';

/**
 * Things View.
 * 
 * The user interface for interacting with a collection of Things.
 * 
 * The things view observes the things model to update the user interface when the 
 * state of the model changes, and calls callbacks provided by the things controller to
 * modify the state of the things model on user input.
 */
export class ThingsView {
  /**
   * Initialise the things view.
   */
  constructor(model) {
    // Injected things model 
    this.model = model;

    // Get DOM elements
    this.addThingHint = document.getElementById('add-thing-hint');
    this.addButton = document.getElementById('add-thing-button');
    this.thingsList = document.getElementById('things-list');
    this.titleBarSpinner = document.getElementById('things-title-bar-spinner');
    this.titleBarText = document.getElementById('things-title-bar-text');
    this.titleBarIcon = document.getElementById('things-title-bar-icon');
    this.messageArea = document.getElementById('things-view-message-area');

    // Create an add thing dialog
    this.addThingDialog = new AddThingDialog();

    // Add event listeners
    this.addButton.addEventListener('click',
      this.handleAddButtonClick.bind(this));
    this.model.addEventListener('thingsupdated', (event) => {
      this.showThings(event.detail);
    });
    this.model.addEventListener('thingcreated', () => {
      this.showMessage('Thing added successfully.');
    });

    // Show loading spinner on initial load
    this.showSpinner();
  }

  /**
   * Show Things.
   * 
   * Retrieve a list of Things and render them.
   */
  showThings(things) {
    // Hide the loading spinner now that things have loaded
    this.hideSpinner();

    // If there are no Things then show a hint
    if (things.size < 1) {
      this.thingsList.classList.add('hidden');
      this.addThingHint.classList.remove('hidden');
      // Otherwise show the list of Things
    } else {
      this.thingsList.classList.remove('hidden');
      this.addThingHint.classList.add('hidden');
    }

    // Clear list of Things
    this.thingsList.innerHTML = '';

    // Generate a UI component for each Thing
    things.forEach((thing) => {
      let thingIcon = new ThingIcon();
      thingIcon.title = thing.thingDescription.title;
      this.thingsList.appendChild(thingIcon);
    });
  }

  /**
   * Handle a click on the add thing button.
   * 
   * @param {Event} event Click event.
   */
  handleAddButtonClick(event) {
    this.addThingDialog.show();
  }

  /**
   * Show the loading spinner in the title bar.
   */
  showSpinner() {
    this.titleBarSpinner.classList.remove('hidden');
    this.titleBarIcon.classList.add('hidden');
  }

  /**
   * Hide the loading spinner in the title bar.
   */
  hideSpinner() {
    this.titleBarSpinner.classList.add('hidden');
    this.titleBarIcon.classList.remove('hidden');
  }

  /**
   * Provide a callback to call when the user requests to add a new Thing.
   * 
   * @param {function} addThingHandler A callback to call when the user requests
   *   to add a thing, with thingDescription and thingUrl as arguments. 
   */
  setAddThingHandler(addThingHandler) {
    this.addThingDialog.setAddThingHandler(addThingHandler);
  }

  /**
   * Show a message
   * 
   * Shows a message on the screen as a transient UI element (toast).
   * 
   * @param {String} message A message to show. 
   */
  showMessage(message) {
    const toast = new Toast();
    toast.setAttribute('message', message);
    this.messageArea.appendChild(toast);
  }
}