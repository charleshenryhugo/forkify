import icons from 'url:../../img/icons.svg'; // parcel2
import View from './view.js';

class AddRecipeView extends View {
  constructor() {
    super();
    this._message = 'Recipe was successfully uploaded :)';

    this._parentElement = document.querySelector('.upload');
    this._overlay = document.querySelector('.overlay');
    this._addRecipeWindow = document.querySelector('.add-recipe-window');
    this._btnCloseModal = document.querySelector('.btn--close-modal');
    this._btnAddRecipe = document.querySelector('.nav__btn--add-recipe');

    this._addHandlerForToggleModal();
  }

  closeAddRecipeWindow() {
    this._hideAddRecipeWindow();
  }

  addHandlerForUpload(handler) {
    const form = this._parentElement;
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const data = [...new FormData(form)];
      const newRecipe = Object.fromEntries(data);
      handler(newRecipe);
    });
  }

  _addHandlerForToggleModal() {
    this._btnAddRecipe.addEventListener(
      'click',
      this._showAddRecipeWindow.bind(this)
    );

    this._overlay.addEventListener(
      'click',
      this._hideAddRecipeWindow.bind(this)
    );

    this._btnCloseModal.addEventListener(
      'click',
      this._hideAddRecipeWindow.bind(this)
    );
  }

  _showAddRecipeWindow() {
    this.render();
    this._addRecipeWindow.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  _hideAddRecipeWindow() {
    this._addRecipeWindow.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  _generateMarkup() {
    return `
      <div class="upload__column">
        <h3 class="upload__heading">Recipe data</h3>
        <label>Title</label>
        <input value="TEST001" required name="title" type="text" />
        <label>URL</label>
        <input value="TEST001" required name="sourceUrl" type="text" />
        <label>Image URL</label>
        <input value="TEST001" required name="image" type="text" />
        <label>Publisher</label>
        <input value="TEST001" required name="publisher" type="text" />
        <label>Prep time</label>
        <input value="23" required name="cookingTime" type="number" />
        <label>Servings</label>
        <input value="23" required name="servings" type="number" />
      </div>
  
      <div class="upload__column">
        <h3 class="upload__heading">Ingredients</h3>
        <label>Ingredient 1</label>
        <input
          value="0.5,kg,Rice"
          type="text"
          required
          name="ingredient-1"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 2</label>
        <input
          value="1,,Avocado"
          type="text"
          name="ingredient-2"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 3</label>
        <input
          value=",,salt"
          type="text"
          name="ingredient-3"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 4</label>
        <input
          type="text"
          name="ingredient-4"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 5</label>
        <input
          type="text"
          name="ingredient-5"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 6</label>
        <input
          type="text"
          name="ingredient-6"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
      </div>
  
      <button class="btn upload__btn">
        <svg>
          <use href="${icons}#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button>
    `;
  }
}

export default new AddRecipeView();
