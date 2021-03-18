import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _parentElement;
  _message;
  _errorMessage;

  /**
   * clear the parent element
   * @private
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * render the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
   * @returns undefined
   */
  render(data) {
    this._data = data;
    this._parentElement.innerHTML = this._generateMarkup(data);
  }

  /**
   * update only changed parts of the markup
   * @param {Object | Object[]} data new data to be used for updating
   * @returns undefined
   * @this {Object} View instance
   * @author ZHU YUE
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(data);

    // create a new dom element that exists in memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newNodes = newDOM.querySelectorAll('*');
    const curNodes = this._parentElement.querySelectorAll('*');

    curNodes.forEach((curNode, i) => {
      const newNode = newNodes[i];
      if (!newNode.isEqualNode(curNode)) {
        // 1. update changed TEXT
        // update the nodes that only contains a "text" node
        if (curNode.firstChild?.nodeValue?.trim()) {
          curNode.textContent = newNode.textContent;
        }
        // 2. update changed ATTRIBUTES
        Array.from(newNode.attributes).forEach(attr => {
          curNode.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    this._parentElement.innerHTML = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
  }

  renderError(message = this._errorMessage) {
    this._parentElement.innerHTML = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
  }

  renderMessage(message = this._message) {
    this._parentElement.innerHTML = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
  }
}
