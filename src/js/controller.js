import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'regenerator-runtime/runtime'; // POLYFILLING ASYNC-AWAIT
import 'core-js/stable'; // POLYFILLING EVERYTHING ELSE
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // Getting id
    const id = window.location.hash.slice(1);

    // guard clause-early return
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 0.5) Update bookmarks based on local storage
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id); // await is necessary bc loadRecipe returns a promise

    // 2) Rendering recipe on screen
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    //console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // getting query from user in the view
    const query = searchView.getQuery();

    // rendering spinner
    query ? resultsView.renderSpinner() : '';

    // guard clause - early return
    // implement a window alert***
    if (!query) return;

    // fetching data from web in Model
    await model.loadSearchResults(query);

    // render results
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  const recipe = model.state.recipe;

  // 1) Add/Remove bookmark
  if (!recipe.bookmarked) model.addBookmark(recipe);
  else if (recipe.bookmarked) model.deleteBookmark(recipe.id);

  // 2) Update recipe view
  recipeView.update(recipe);
  console.log('Current bookmarks:');
  console.log(model.state.bookmarks);

  // 3) Render books
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view (render insert a new element)
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // this method is supposed to change the URL without reloading the page pushState(state,title,url)
    console.log('newRecipe id: ', model.state.recipe.id);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎇', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  console.log('init()');

  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
