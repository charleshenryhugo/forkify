/*
representation logic (UI layer)
 */

class SearchFormView {
  constructor() {
    this._parentElement = document.querySelector('.search');
    this._searchField = this._parentElement.querySelector('.search__field');
  }

  getQuery() {
    const query = this._searchField.value;
    this._searchField.value = '';
    return query;
  }

  /**
   * Publisher
   */
  addHandlerForFormSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchFormView();
