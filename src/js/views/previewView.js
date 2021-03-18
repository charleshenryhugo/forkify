import icons from 'url:../../img/icons.svg'; // parcel2
import View from './view.js';

class PreviewView extends View {
  render(recipe) {
    const recipeId = window.location.hash.slice(1);
    const activeClass = recipeId === recipe.id ? 'preview__link--active' : '';

    return `
      <li class="preview">
        <a class="preview__link ${activeClass}" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
             <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewView();
