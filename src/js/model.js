/*
State
Business Logic
HTTP Library
 */
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPageNum: 1,
    totalPagesNum: 1,
  },
  bookmarks: JSON.parse(localStorage.getItem('bookmarks')) ?? [],
};

/*
demo of data returned from API
data:
  recipe:
    cooking_time: 23
    createdAt: "2021-03-17T03:25:41.689Z"
    id: "6051c07857e7840017c3e6cd"
    image_url: "TEST001"
    ingredients: (3) [{…}, {…}, {…}]
    key: "6009359a-b4e7-49d3-bef8-a1bc66725dc7"
    publisher: "TEST001"
    servings: 23
    source_url: "TEST001"
    title: "TEST001"
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    bookmarked: state.bookmarks.some(bm => bm.id === recipe.id),
    key: recipe.key,
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    const data = await AJAX(`${API_URL}${recipeId}?key=${API_KEY}`);
    // console.log(data.data.recipe);

    state.recipe = createRecipeObject(data);
  } catch (e) {
    throw e;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (Array.isArray(data.data.recipes) && data.data.recipes.length === 0) {
      throw new Error(`No recipes found for "${query}"`);
    }

    state.search.results = data.data.recipes.map(recipe =>
      Object({
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        key: recipe.key,
      })
    );
    state.search.currentPageNum = 1;
    state.search.totalPagesNum = Math.ceil(
      state.search.results.length / RESULTS_PER_PAGE
    );
  } catch (e) {
    throw e;
  }
};

export const getSearchResultsByPage = function (
  page = state.search.currentPageNum
) {
  state.search.currentPageNum = page;

  return state.search.results.slice(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE
  );
};

export const updateServings = function (targetServings) {
  if (targetServings < 1) return;

  // 1. update ingredients quantity
  state.recipe.ingredients.forEach(
    ing =>
      ing.quantity && (ing.quantity *= targetServings / state.recipe.servings)
  );

  // 2. update servings
  state.recipe.servings = targetServings;
};

export const addBookmark = function (recipe = state.recipe) {
  // return if this recipe already bookmarked
  if (state.bookmarks.some(bm => bm.id === recipe.id)) return;

  // add to bookmarks
  state.bookmarks.push(recipe);

  // update current state.recipe if the id matched
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }

  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const deleteBookmark = function (recipeId = state.recipe.id) {
  // return if there is no such recipeId bookmarked
  const index = state.bookmarks.findIndex(bm => bm.id === recipeId);
  if (index < 0) return;

  // remove from bookmarks
  state.bookmarks.splice(index, 1);

  // update current state.recipe if the id matched
  if (state.recipe.id === recipeId) {
    state.recipe.bookmarked = false;
  }

  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const setBookmark = function () {
  if (state.recipe.bookmarked) {
    deleteBookmark(state.recipe.id);
  } else {
    addBookmark(state.recipe);
  }
};

/*
newRecipe formData demo
title TEST
sourceUrl TEST
image TEST
publisher TEST
cookingTime 23
servings 23
ingredient-1 0.5,kg,Rice
ingredient-2 1,,Avocado
ingredient-3 ,,salt
ingredient-4
ingredient-5
ingredient-6
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = [];
    for (const [k, v] of Object.entries(newRecipe)) {
      if (!k.startsWith('ingredient')) continue;
      if (!v) continue;

      const [quantity, unit, description] = v.split(',').map(str => str.trim());
      if (!description)
        throw new Error(
          'Wrong ingredient format! Please use the correct format :)'
        );
      ingredients.push({
        quantity: quantity ? +quantity : null,
        unit: unit ? unit : null,
        description,
      });
    }

    const recipeJsonObject = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeJsonObject);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
};
