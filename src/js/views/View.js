import icons from 'url:../../img/icons.svg';

// Top parent class
export default class View {
  _data;
  _overlay = document.querySelector('.overlay');
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
    console.log(data);
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

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(
    message = this._errorMessage,
    parent = this._parentElement,
    clear = true
  ) {
    if (!clear) parent.innerHTML = '';
    const markup = `
    <div class="error">
        <div>
        <svg>
            <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>`;
    if (clear) this._clear();
    parent.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message, parent = this._parentElement) {
    const markup = `
    <div class="message">
        <div>
        <svg>
            <use href="${icons}#icon-smile"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._clear();
    parent.insertAdjacentHTML('afterbegin', markup);
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // private functions
  _clear() {
    this._parentElement.innerHTML = '';
  }
}
