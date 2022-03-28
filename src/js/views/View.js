import icons from 'url:../../img/icons.svg';

// Top parent class
export default class View {
  _data;
  _errorWindow = document.querySelector('.add-error-window');
  _overlayError = document.querySelector('.overlay-error');

  // Any message
  _overlayWindowMessage = document.querySelector('.overlay-window-message');
  _windowMessage = document.querySelector('.add-window-message');

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Leonardo Conti
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();

    if (data.results != '') {
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }
  /**
   * Updates only the DOM modified data on the window
   * @param {Object} data  The data to be updated
   * @returns {undefined} It doesn't return anything
   * @this {Object} View instance
   */
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    // this creates like a virtual DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // this selects only nodes that contain strings
      ) {
        // console.log('LOG:', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner(parent = this._parentElement) {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    parent.innerHTML = '';
    parent.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(
    message = this._errorMessage,
    parent = this._parentElement,
    clear = true
  ) {
    message === '_' ? (message = this._message) : '';
    parent === '_' ? (parent = this._parentElement) : '';
    clear === '_' ? (clear = true) : '';

    if (clear) this._clear(parent);
    const markup = `
    <div class="error">
        <div>
        <svg>
            <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>`;
    parent.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(
    message = this._message,
    parent = this._parentElement,
    clear = true,
    icon = 'smile'
  ) {
    message === '_' ? (message = this._message) : '';
    parent === '_' ? (parent = this._parentElement) : '';
    clear === '_' ? (clear = true) : '';
    icon === '_' ? (icon = 'smile') : '';

    if (clear) this._clear(parent);
    const markup = `
    <div class="message">
        <div>
        <svg>
            <use href="${icons}#icon-${icon}"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>`;
    parent.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render a window message for any reason
   * @param {string} message message to appear in the window
   * @param {DOM element} [parent=document.querySelector('.add-window-message')] container to render the msg
   * @param {boolean} [clear=true] clear previous content from parent
   * @param {string} [icon='smile'] icon to be shown (smile, alert-circle, alert-triangle, arrow-left, arrow-right, loader )
   * @param {number | boolean} [timeOut=false] to set a timeOut input a number of seconds (e.g. 3)
   * @returns nothing
   * @this {Object} View instance that is calling
   * @author Leonardo Conti
   */
  renderWindowMessage(
    message,
    parent = this._windowMessage,
    clear = true,
    icon = 'smile',
    timeOut = false
  ) {
    message === '_' ? (message = this._message) : '';
    parent === '_' ? (parent = this._windowMessage) : '';
    clear === '_' ? (clear = true) : '';
    icon === '_' ? (icon = 'smile') : '';
    timeOut === '_' ? (timeOut = false) : '';

    if (clear) this._clear(parent);
    const markup = `
    <div class="message">
        <div>
        <svg>
            <use href="${icons}#icon-${icon}"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>`;
    parent.insertAdjacentHTML('afterbegin', markup);

    this.toggleWindowMessage(timeOut);
  }

  toggleWindowMessage(timeOut = false) {
    this._overlayWindowMessage.classList.toggle('hidden');
    this._windowMessage.classList.toggle('hidden');

    if (!this._overlayWindowMessage.classList.contains('hidden') && timeOut)
      setTimeout(() => {
        this.toggleWindowMessage();
      }, timeOut * 1000);
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  toggleWindowError() {
    this._overlayError.classList.toggle('hidden');
    this._errorWindow.classList.toggle('hidden');
  }

  _clear(parent = this._parentElement) {
    parent.innerHTML = '';
  }
}
