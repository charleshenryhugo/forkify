/*
representation logic (UI layer)
 */

import icons from 'url:../../img/icons.svg'; // parcel2
import { Fraction } from 'fractional';
import View from './view.js';

class RecipeView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.recipe');
    this._errorMessage =
      'We could not find that recipe, please try another one!';
    this._message = '';
  }

  /**
   * Publisher
   *
   * DOM events should be listened in view,
   * but should be handled in controller
   * @param handler
   */
  addHandlerForDomEvents(handler) {
    ['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerForUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      const btnUpdateServings = e.target.closest('.btn--increase-servings');
      if (!btnUpdateServings) return;

      const targetServings = +btnUpdateServings.dataset.servings;

      targetServings > 0 && handler(targetServings);
    });
  }

  addHandlerForSettingBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const btnBookmark = e.target.closest('.btn--bookmark');
      if (!btnBookmark) return;

      handler();
    });
  }

  _generateIngredientsMarkup(ingredients) {
    return ingredients
      .map(ing => {
        return `
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ing.quantity
                ? new Fraction(ing.quantity.toFixed(6)).toString()
                : ''
            }</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ing.unit ?? ''}</span>
              ${ing.description ?? ''}
            </div>
          </li>
        `;
      })
      .join('');
  }

  _generateMarkup(data = this._data) {
    const recipe = data;

    const ingredientsMarkup = this._generateIngredientsMarkup(
      recipe.ingredients
    );

    const bookmarkIcon = `${icons}#${
      recipe.bookmarked ? 'icon-bookmark-fill' : 'icon-bookmark'
    }`;

    return `
      <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            recipe.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            recipe.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings"
                    data-servings="${+recipe.servings - 1}"
            >
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings"
                    data-servings="${+recipe.servings + 1}"
            >
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="recipe__user-generated ${recipe.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${bookmarkIcon}"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${ingredientsMarkup}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            recipe.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href=${recipe.sourceUrl}
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }
}

export default new RecipeView();
