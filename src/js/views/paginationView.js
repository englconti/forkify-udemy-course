import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // public APIs
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline'); //closest searches up
      // guard clause to avoid error clicking out of the btns
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      console.log(`Current page: ${goToPage}`);
      handler(goToPage);
    });
  }

  // Private methods
  _generateMarkup() {
    const curPage = this._data.currentPage;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const prevBtn = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
    const nextBtn = `
    <button data-goto="${
      curPage + 1
    } "class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    const pageDisplay = `
    <div class="div-current-page pagination__curr">
      <p class="current-page">Page ${curPage} of ${numPages}</p>
    </div>`;

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `${nextBtn}${pageDisplay}`;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `${prevBtn}${pageDisplay}`;
    }

    // Other pages (>1 and <last)
    if (curPage > 1 && curPage < numPages) {
      return `${prevBtn}${nextBtn}${pageDisplay}`;
    }

    // Page 1, and there are NO more pages
    if (numPages === 1) {
      return pageDisplay;
    }
  }
}

export default new PaginationView();
