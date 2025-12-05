/**
 * Thing Icon.
 * 
 * A UI component representing a Web Thing in a list of Web Things.
 */
export class ThingIcon extends HTMLElement {

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
        display: inline-block;
        width: 160px;
        height: 160px;
        margin: 10px;
        background-color: #48779a;
        border-radius: 5px;
      }

      :host(:hover), :host(:active) {
        background-color: #436e8e;
      }

      .thing-link {
        display: block;
        width: 100%;
        height: 100%;
        text-decoration: none;
      }

      .thing-icon {
        background-color: #7a9ab0;
        width: 96px;
        height: 96px;
        border-radius: 48px;
        margin: 13px 32px;
        background-image: url('images/thing-icon.svg');
        background-size: 48px;
        background-position: center;
        background-repeat: no-repeat;
      }

      .thing-title {
        display: block;
        width: 140px;
        height: 28px;
        line-height: 13px;
        text-align: center;
        color: #fff;
        font-size: 13px;
        overflow: hidden;
        padding: 0 10px;
      }
    </style>
    <a class="thing-link" href="">
      <div class="thing-icon"></div>
      <span class="thing-title"></span>
    </a>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.linkElement = this.shadowRoot.querySelector('.thing-link')
    this.iconElement = this.shadowRoot.querySelector('.thing-icon');
    this.titleElement = this.shadowRoot.querySelector('.thing-title');
  }

  /**
   * Set observed attributes.
   */
  static get observedAttributes() {
    return ['title', 'href'];
  }

  /**
   * Make the title property reflect the title attribute.
   */
  get title() {
    return this.getAttribute('title');
  }

  /**
   * Make the title attribute reflect the title property.
   * 
   * @param {String} title The title to set.
   */
  set title(title) {
    this.setAttribute('title', title);
  }

  /**
   * Make the href property reflect the href attribute.
   */
  get href() {
    return this.getAttribute('href');
  }

  /**
   * Make the href attribute reflect the href property.
   */
  set href(href) {
    this.setAttribute('href', href);
  }

  /**
   * Update element when attributes are changed.
   * 
   * @param {String} name The name of the attribute that changed.
   * @param {String} oldValue The old value of the attribute.
   * @param {String} newValue The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'title') {
      this.titleElement.textContent = newValue;
    } else if(name == 'href') {
      this.linkElement.href = newValue;
    }
  }

  /**
   * Add event listeners when element appended into document.
   */
  connectedCallback() {

  }
    
  /**
   * Remove event listeners when element disconnected from DOM.
   */
  disconnectedCallback() {

  }

}

// Register custom element
customElements.define('k-thing-icon', ThingIcon);