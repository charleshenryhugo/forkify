/*
representation logic (UI layer)
 */

import icons from 'url:../../img/icons.svg'; // parcel2
import View from './view.js';

class PaginationView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pagination');
  }

  _generateMarkup(data = this._data) {
    // {query: "pizza", results: Array(59), currentPageNum: 1, totalPagesNum: 6}

    let markup = '';
    if (data.currentPageNum - 1 >= 1) {
      markup += `
        <button class="btn--inline pagination__btn--prev"
                data-page="${data.currentPageNum - 1}"
        >
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${data.currentPageNum - 1}</span>
        </button>
      `;
    }
    if (data.currentPageNum + 1 <= data.totalPagesNum) {
      markup += `
        <button class="btn--inline pagination__btn--next"
                data-page="${data.currentPageNum + 1}"
        >
          <span>Page ${data.currentPageNum + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    return markup;
  }

  addHandlerForClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(+btn.dataset.page);
    });
  }
}

export default new PaginationView();
