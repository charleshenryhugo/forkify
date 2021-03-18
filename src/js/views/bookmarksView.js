import icons from 'url:../../img/icons.svg'; // parcel2
import View from './view.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.bookmarks__list');
    this._message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  }

  addHandlerForDomEvents(handler) {
    ['load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _generateMarkup(data = this._data) {
    return data.map(previewView.render).join(' ');
  }
}

export default new BookmarksView();
