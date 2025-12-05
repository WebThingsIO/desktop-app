/**
 * Toast.
 *
 * A transient UI element for displaying information messages and errors.
 */
export class Toast extends HTMLElement {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');

    template.innerHTML = `
    <style>
      :host {
        display: block;
        max-width: 500px;
      }

      .toast {
        position: relative;
        width: calc(100% - 20px);
        max-width: 500px;
        min-height: 42px;
        margin: 0 10px 10px 10px;
        background-color: rgba(0, 0, 0, 0.18);
        border-radius: 5px;
        opacity: 1;
        transition: opacity 1s ease;
      }
      
      .toast .message-box {
        font-size: 14px;
        color: #fff;
        padding: 10px 42px 10px 10px;
      }

      .toast .close-button {
        position: absolute;
        top: 0;
        right: 0;
        width: 32px;
        height: 32px;
        margin: 5px;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTIiCiAgIGhlaWdodD0iMTIiCiAgIHZpZXdCb3g9IjAgMCAzLjE3NTAwMDEgMy4xNzUiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzE1MTQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczE1MTEiIC8+CiAgPGcKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MC4yMTMzNTEsLTczLjkyMDk1NSkiPgogICAgPGcKICAgICAgIGFyaWEtbGFiZWw9IisiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjE2NTU1MTY5LDAuMTY1NTUxNjksLTAuMTY1NTUxNjksMC4xNjU1NTE2OSwtNDI4LjE4MzQ0LC05MDAuMzk5MzgpIgogICAgICAgaWQ9InRleHQxMjkxLTUiCiAgICAgICBzdHlsZT0iZm9udC1zaXplOjQuMDE2MjNweDtsaW5lLWhlaWdodDowJTtsZXR0ZXItc3BhY2luZzowcHg7d29yZC1zcGFjaW5nOjBweDtmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzM0Njg2Ij4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSA0NDk2LjIwNDEsMTQwOC4yNjggaCAtNy4zODE1IHYgNy4zODE1IGggLTIuMjQ4MyB2IC03LjM4MTUgaCAtNy4zODE0IHYgLTIuMTY3IGggNy4zODE0IHYgLTcuMzgxNSBoIDIuMjQ4MyB2IDcuMzgxNSBoIDcuMzgxNSB6IgogICAgICAgICBzdHlsZT0iZm9udC1zaXplOjI3LjczOHB4O2xpbmUtaGVpZ2h0OjEuMjUiCiAgICAgICAgIGlkPSJwYXRoMTQ5OCIgLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=');        background-size: 12px;
        background-position: center;
        background-repeat: no-repeat;
        background-color: transparent;
        border: none;
        border-radius: 5px;
      }

      .toast .close-button:hover {
        background-color: rgba(255, 255, 255, 0.18);
      }

      .toast.hidden {
        opacity: 0;
      }
    </style>
    <div class="toast">
      <p class="message-box"></p>
      <button class="close-button"></button>
    </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.toast = this.shadowRoot.querySelector('.toast');
    this.closeButton = this.shadowRoot.querySelector('.close-button');
    this.messageBox = this.shadowRoot.querySelector('.message-box');
  }

  /**
   * Set message as an observed attribute.
   */
  static get observedAttributes() {
    return ['message'];
  }

  /**
   * Make the message property reflect the message attribute.
   */
  get message() {
    return this.getAttribute('message');
  }

  /**
   * Make the message attribute reflect the message property.
   * 
   * @param {String} message The message to set.
   */
  set message(message) {
    this.setAttribute('message', message);
  }

  /**
   * Set message text content when the message attribute is changed.
   * 
   * @param {String} name The name of the attribute that changed.
   * @param {String} oldValue The old value of the attribute.
   * @param {String} newValue The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'message') {
      this.messageBox.textContent = newValue;
    }
  }

  /**
   * Add event listeners when element appended into document.
   */
  connectedCallback() {
    // Create a version of the close method bound to `this`, which can be 
    // referenced when removing the event listener
    this.boundClose = this.close.bind(this);
    this.closeButton.addEventListener('click', this.boundClose);
    // Hide the toast after a delay
    this.hide();
  }
    
  /**
   * Remove event listeners when element disconnected from DOM.
   */
  disconnectedCallback() {
    this.closeButton.removeEventListener('click', this.boundClose);
  }

  /**
   *  Fade out the toast after four seconds, then close it.
   */
  hide()  {
    setTimeout(() => {
      this.toast.classList.add('hidden');
    }, 4000);

    setTimeout(() => {
      this.remove();
    }, 5000);
  }

  /**
   * Manually close the toast.
   */
  close() {
    this.remove();
  }

}

// Register custom element
customElements.define('wt-toast', Toast);