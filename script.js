const searchInput = document.querySelector('#search');
const submitBtn = document.querySelector('button[type="submit"]');
const randomBtn = document.querySelector('#random');
const resultHeading = document.querySelector('#result-heading');
const mealsElement = document.querySelector('#meals');
const singleMealElement = document.querySelector('#single-meal');

// Event listeners
submitBtn.addEventListener('click', searchMeal);

mealsElement.addEventListener('click', e => {
  if (e.target.hasAttribute('data-meal-id')) {
    const mealId = e.target.getAttribute('data-meal-id');
    getMealById(mealId)
  }
})

// Functions

// Serach meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  singleMealElement.innerHTML = '';

  // Get search query
  const searchValue = searchInput.value;

  // Check for empty
  if (searchValue.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search result for '${searchValue}':</h2>`;

        // Check for empty response
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          const meals = data.meals.map(meal => {
            return `<div class=meal>
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-meal-id="${meal.idMeal}">
                <h3 data-meal-id="${meal.idMeal}">${meal.strMeal}</h3>
              </div>
            </div>`
          });

          mealsElement.innerHTML = meals.join('')
        }
      });

    // Clear search input
    searchInput.value = '';
  } else {
    alert('Please enter a search value');
  }
}

// Get meal by ID from API
function getMealById(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  const measures = [];

  // Return array of a meal object
  const mealArr = Object.entries(meal);

  const regexIngredient = new RegExp('strIngredient*');
  const regexMeasure = new RegExp('strMeasure*');

  // Look for specific regex values
  mealArr.forEach(element => {
    const [key, value] = element;

    if (value && regexIngredient.test(key)) {
      ingredients.push(value)
    } else if (value && regexMeasure.test(key)) {
      measures.push(value)
    }
  });

  const ingredientsAndMeasures = [];

  // Join ingredients and measures into one array
  for (let i = 0; i < ingredients.length; i++) {
    ingredientsAndMeasures.push(`${ingredients[i]} - ${measures[i]}`);
  }

  singleMealElement.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}` : ''}
        ${meal.strArea ? `<p>${meal.strArea}` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredientsAndMeasures.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}