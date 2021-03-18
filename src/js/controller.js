/*
Application Logic
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchFormView from './views/searchFormView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_DELAY_DEC } from './config.js';

/*
Allow hot module loading,
so that model.state is kept when we change the code
 */
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    // 1. parse recipe ID from window.location.hash
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;

    // 2. update resultsView to highlight the selected search result
    searchResultsView.update(model.getSearchResultsByPage());
    bookmarksView.update(model.state.bookmarks);

    // 3. render spinner when waiting for result
    recipeView.renderSpinner();

    await model.loadRecipe(recipeId);

    recipeView.render(model.state.recipe);
  } catch (e) {
    recipeView.renderError(e);
  }
};

const controlServings = function (targetServings) {
  // 1. update servings and ingredients quantities
  model.updateServings(targetServings);

  // 2. update recipeView (rather than re-render it)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlSearchResults = async function () {
  try {
    // 1. get query from searchFormView
    const query = searchFormView.getQuery();
    if (!query) return;

    // 2. load search results by model
    searchResultsView.renderSpinner();
    await model.loadSearchResults(query);

    // 3. render results
    searchResultsView.render(model.getSearchResultsByPage(1));

    // 4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (e) {
    searchResultsView.renderError();
  }
};

const controlPagination = function (targetPageNum) {
  // 1. render NEW results
  searchResultsView.render(model.getSearchResultsByPage(targetPageNum));

  // 2. render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlSettingBookmark = function () {
  // 1. add / delete bookmark
  model.setBookmark();
  // 2. update recipeView
  recipeView.update(model.state.recipe);

  // 3. render bookmarks view
  if (model.state.bookmarks.length > 0) {
    bookmarksView.render(model.state.bookmarks);
  } else {
    bookmarksView.renderMessage();
  }
};

// need to render the bookmarks in the beginning
const controlInitBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    // 1. render spinner while waiting
    addRecipeView.renderSpinner();

    // 2. POST new recipe to API
    await model.uploadRecipe(newRecipe);

    // 3. render success message
    addRecipeView.renderMessage();

    // 4. render the newly added recipe
    recipeView.render(model.state.recipe);
    // 5. change ID in url, without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6. render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // 7. auto close modal after a delay
    setTimeout(() => {
      addRecipeView.closeAddRecipeWindow();
    }, MODAL_CLOSE_DELAY_DEC * 1000);
  } catch (e) {
    // console.log(e);
    addRecipeView.renderError(e);
  }
};

const init = function () {
  // Subscribers
  bookmarksView.addHandlerForDomEvents(controlInitBookmarks);
  recipeView.addHandlerForDomEvents(controlRecipe);
  recipeView.addHandlerForUpdateServings(controlServings);
  recipeView.addHandlerForSettingBookmark(controlSettingBookmark);
  searchFormView.addHandlerForFormSubmit(controlSearchResults);
  paginationView.addHandlerForClick(controlPagination);
  addRecipeView.addHandlerForUpload(controlUploadRecipe);
};

init();
