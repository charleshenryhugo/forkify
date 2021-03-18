/*
representation logic (UI layer)
 */

import icons from 'url:../../img/icons.svg'; // parcel2
import View from './view.js';
import previewView from './previewView.js';

class SearchResultsView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.results');
    this._errorMessage = 'No recipes found for your query, please try again ;)';
    this._message = '';
  }

  _generateMarkup(data = this._data) {
    return data.map(previewView.render).join(' ');
  }
}

export default new SearchResultsView();
