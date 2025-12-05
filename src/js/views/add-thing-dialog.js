'use strict';

/**
 * Add Thing Dialog.
 */
export class AddThingDialog {
  /**
   * Initialise the add thing dialog.
   */
  constructor() {
    this.addThingDialog = document.getElementById('add-thing-dialog');
    this.closeButton = document.getElementById('add-thing-close-button');
    this.addThingIcon = document.getElementById('add-thing-icon');
    this.spinner = document.getElementById('add-thing-spinner');
    this.thingPreview = document.getElementById('thing-preview');
    this.thingPreviewTitle = document.getElementById('thing-preview-title');
    this.form = document.getElementById('add-thing-form');
    this.thingUrlInput = document.getElementById('add-thing-url');
    this.thingTokenInput = document.getElementById('add-thing-token');
    this.cancelButton = document.getElementById('add-thing-cancel');
    this.nextButton = document.getElementById('add-thing-next');
    this.addButton = document.getElementById('add-thing-add');
    this.messageArea = document.getElementById('add-thing-message-area');

    this.closeButton.addEventListener('click',
      this.close.bind(this));
    this.cancelButton.addEventListener('click',
      this.close.bind(this));
    this.addThingDialog.addEventListener('cancel', 
      this.close.bind(this));
    this.form.addEventListener('submit',
      this.handleFormSubmit.bind(this));
  }

  /**
   * Show the Add Thing dialog.
   */
  show() {
    this.addThingDialog.showModal();
  }

  /**
   * Close the Add Thing dialog.
   */
  close() {
    // Reset state
    this.thingUrlInput.classList.remove('hidden');
    this.thingTokenInput.classList.add('hidden');
    this.addButton.classList.add('hidden');
    this.nextButton.classList.remove('hidden');
    this.hideThingPreview();
    this.thingUrlInput.value = '';
    this.thingTokenInput.value = '';
    this.thingDescription = undefined;
    this.thingUrl = undefined;
    // Close the dialog.
    this.addThingDialog.close();
  }

  /**
   * Handle submission of the Add Thing form.
   * 
   * @param {Event} event Submit event.
   */
  handleFormSubmit(event) {
    event.preventDefault();

    if(event.submitter == this.nextButton) {
      this.previewThing();
    } else {
      this.addThing();
    }
  }

  /**
   * Attempt to fetch and parse the Thing Description and generate a preview.
   */
  previewThing() {
    // Check that the URL is valid
    try {
      this.thingUrl = new URL(this.thingUrlInput.value);
    } catch (error) {
      console.error('Provided thing URL is not a valid URL.')
      this.showMessage('Invalid URL.');
      return;
    }

    // Set request headers
    const options = {
      headers: {
        'Accept': 'application/td+json, application/json'
      }
    }

    // If a Bearer token is provided, then add an Authorization header
    if(this.thingTokenInput.value) {
      options.headers.Authorization = 'Bearer ' + this.thingTokenInput.value;
    }

    // Start spinner
    this.addThingIcon.classList.add('hidden');
    this.spinner.classList.remove('hidden');

    // Fetch the Thing Description
    fetch(this.thingUrl, options)
      .then((response) => {
        // Stop spinner
        this.addThingIcon.classList.remove('hidden');
        this.spinner.classList.add('hidden');
        
        // If get a success response, return the response parsed as JSON
        if (response.ok) {
          return response.json();
        }

        // If unauthorized response, show token input field
        if(response.status == 401) {
          console.log('Thing Description not authorised, requesting token from user');
          // Reset the token field if invalid token provided
          this.thingTokenInput.value = '';
          // Show token field
          this.thingTokenInput.classList.remove('hidden');
          this.showMessage('Valid authentication token needed.');
        }
      })
      .then((description) => {
        if(!description) {
          return;
        }

        // Very basic validation of Thing Description
        if(!description.title) {
          this.showMessage('Invalid Thing Description');
          return;
        }

        // Hide input fields
        this.thingUrlInput.classList.add('hidden');
        this.thingTokenInput.classList.add('hidden');

        // Show Thing preview
        this.thingDescription = description;
        this.showThingPreview(this.thingDescription);

        // Replace next button with add button
        this.nextButton.classList.add('hidden');
        this.addButton.classList.remove('hidden');
      }).catch((error) => {
        // Stop spinner
        this.addThingIcon.classList.remove('hidden');
        this.spinner.classList.add('hidden');
        console.error('Error fetching or parsing Thing Description: ' + error);
        this.showMessage('Error fetching device description.');
      });
  }

  /**
   * Add the Thing. 
   */
  addThing() {
    if (!this.thingDescription || !this.thingUrl) {
      console.error('Tried to add a Thing without Thing Description and URL');
      return;
    }
    this.addThingCallback(this.thingDescription, this.thingUrl.href).then(() => {
      this.close();
    }).catch((error) => {
      switch(error.message) {
        case 'InvalidThingDescription':
          console.error('Failed to create Thing due to invalid Thing Description');
          this.showMessage('Error: Invalid Thing Description.');
        case 'DatabaseError':
          console.error('Database error when trying to create Thing');
          this.showMessage('Database error.');
        case 'InvalidRequest':
          console.error('Invalid request when trying to create Thing');
          this.showMessage('Error: Invalid request.');
        default:
          console.log(`Unknown error when trying to create Thing: ${error}`);
          this.showMessage('Unknown Error.');
      }
    });
  }

  /**
   * Show Thing Preview.
   * 
   * Displays metadata about a Thing from its Thing Description to provide 
   * a preview before saving.
   * 
   * @param {Object} thingDescription A Thing Description.
   */
  showThingPreview(thingDescription) {
    this.thingPreviewTitle.textContent = thingDescription.title;
    this.thingPreview.classList.remove('hidden');
  }

  /**
   * Hide the Thing preview.
   */
  hideThingPreview() {
    this.thingPreviewTitle.textContent = '';
    this.thingPreview.classList.add('hidden');
  }

  /**
   * Show a message to the user as a toast.
   */
  showMessage(message) {
    const toast = new Toast();
    toast.setAttribute('message', message);
    this.messageArea.appendChild(toast);
  }

  /**
   * Bind the callback function to call when the user requests adding a Thing.
   * 
   * @param {function} addThingCallback The add thing callback. Accepts thingDescription 
   *   and thingUrl as arguments and returns a Promise.
   */
  bindAddThing(addThingCallback) {
    this.addThingCallback = addThingCallback;
  }

}