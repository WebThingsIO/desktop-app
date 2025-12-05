import { Things } from './models/things.js';
import { ThingsView } from './views/things-view.js';
import { ThingsController } from './controllers/things-controller.js';
import { Toast } from './views/components/toast.js';

/**
 * WebThings Desktop App
 */
export class App {
  constructor() {
    this.messageArea = document.getElementById('message-area');

    const thingsModel = new Things();
    const thingsView = new ThingsView(thingsModel);
    const thingsController = new ThingsController(thingsModel, thingsView);

    thingsController.init().catch((error) => {
      console.error(`Error starting ThingsController: ${error}`);
      this.showMessage('Error initialising app.');
    });
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

/**
  * Start on page load.
  */
 window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  new App();
});