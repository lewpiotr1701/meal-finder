const searchInput = document.querySelector('#search');
const submitBtn = document.querySelector('button[type="submit"]');
const randomBtn = document.querySelector('#random');
const resultHeading = document.querySelector('#result-heading');
const mealsElement = document.querySelector('#meals');
const singleMealElement = document.querySelector('#single-meal');

// Event listeners
submitBtn.addEventListener('click', searchMeal);

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
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>`
          });

          console.log(meals)

          mealsElement.innerHTML = meals.join('')
        }
      });

    // Clear search input
    searchInput.value = '';
  } else {
    alert('Please enter a search value');
  }
}