import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // unstructuring
  const { recipe } = data.data;

  // changing keyIds
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    coockingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // the same as key: recipe.key, but it checks if recipe.key exists (conditionally adding properties to objects)
  };
};

// This function will change the state object
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 🔴🔴🔴`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log('data from loadSearchResults:', data);

    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// this will not be an async function bc we already have the data we need from the loadSearchResults - we are not fetching anything from the web
export const getSearchResultsPage = function (page = 1) {
  state.search.currentPage = page;
  // expressions to calculate pages
  const start = (page - 1) * 10;
  const end = page * 10;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

// Function to store bookmars at local storage
const persistBookmarks = function (recipe) {
  // this creates an item at the local storage with 'bookmarks' name and store the values in 'state.bookmarks' as a string due to JSON.stringify method
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Finding the index position of the bookmark
  const index = state.bookmarks.findIndex(element => element.id === id);

  // Deleting 1 element from position 'index'
  state.bookmarks.splice(index, 1);

  // Remove bookmark from bookmarked recipes
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
    console.log('bookmarks from localStorage', state.bookmarks);
  }
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log('newRecipe: ', Object.entries(newRecipe));

    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) throw new Error('Wrong ingredients format!');

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    //console.log('ingredients:', ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    //console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
