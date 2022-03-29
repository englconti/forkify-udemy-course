import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _messageSuccessRecipeAdd = 'Recipe was successfully uploaded!!';
  _messageWrongIngFormat = 'Wrong format of ingredients, please review!';

  constructor() {
    super();
    // only after super() we can use the 'this' keyword, bc it is a child class
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();

    // Clear all template inputs in ADD RECIPE
    // this._clearValues();
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    [this._btnClose, this._overlay].map(element =>
      element.addEventListener('click', this.toggleWindow.bind(this))
    );
    this._overlayWindowMessage.addEventListener(
      'click',
      this.toggleWindowMessage.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      console.log(dataArr);

      // Object.fromEntries() takes an array and converts it to an object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}

  _clearValues() {
    [
      'title',
      'sourceUrl',
      'image',
      'publisher',
      'cookingTime',
      'servings',
      'ingredient-1',
      'ingredient-2',
      'ingredient-3',
      'ingredient-4',
      'ingredient-5',
      'ingredient-6',
    ].map(el => (document.querySelector(`[name="${el}"]`).value = ''));
  }
}

export default new AddRecipeView();
