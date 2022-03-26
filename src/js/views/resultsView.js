import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please, try again!';
  _message = '';

  _generateMarkup() {
    console.log(this);

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

// exporting one instance of the ResultsView class
export default new ResultsView();