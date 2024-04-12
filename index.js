// Declare searchInput globally
const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', function () {
  // Get references to search button
  const searchButton = document.getElementById('searchButton');

  // Search button click event listener
  searchButton.addEventListener('click', function () {
    searchCocktails();
  });

  // Search input change event listener 
  searchInput.addEventListener('input', function () {
    console.log('Search input value changed:', searchInput.value);
    searchCocktails();
  });

  // Save button click event listener
  document.addEventListener('click', function (event) {
    if (event.target.matches('.saveButton')) {
      const cocktailData = JSON.parse(event.target.dataset.cocktail);
      saveCocktail(cocktailData);
    }
  });

  // Delete button click event listener
  document.addEventListener('click', function (event) {
    if (event.target.matches('.deleteButton')) {
      const cocktailId = event.target.dataset.cocktailId;
      deleteCocktail(cocktailId);
    }
  });
});

function searchCocktails() {
  const searchInputValue = searchInput.value;
  // Log the URL being fetched
  console.log('Fetching URL:', url);
  // Construct the API URL with the search query
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInputValue}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Check if data.drinks is empty
      if (data.drinks === null) {
        displayErrorMessage("Drink not found. Please try another one.");
      } else {
        displayCocktails(data.drinks);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error.message);
      displayErrorMessage("Error fetching data. Please try again later.");
    });  
}


// Function to display error message
function displayErrorMessage(message) {
  console.error(message);
}

// Function to save cocktail data
function saveCocktail(cocktailData) {
  console.log('Saving cocktail:', cocktailData);
}

// Function to delete a cocktail
function deleteCocktail(cocktailId) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`;

  fetch(url, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Cocktail deleted successfully:', data);
  })
  .catch(error => {
    console.error('Error deleting cocktail:', error);
  });
}

// Function to display cocktails
function displayCocktails(cocktails) {
  console.log('Received cocktails:', cocktails);
  const cocktailList = document.getElementById('cocktailList');
  cocktailList.innerHTML = '';

  if (!cocktails) {
    cocktailList.innerHTML = '<p>No cocktails found</p>';
    return;
  }

  cocktails.forEach(cocktail => {
    const instructions = cocktail.strInstructions.charAt(0).toUpperCase() + cocktail.strInstructions.slice(1).toLowerCase();

    // Create a new object with the manipulated data
    const modifiedCocktail = {
      ...cocktail,
      strInstructions: instructions
    };

    const cocktailDiv = document.createElement('div');
    cocktailDiv.classList.add('cocktail');
    cocktailDiv.innerHTML = `
      <h2>${modifiedCocktail.strDrink}</h2>
      <img src="${modifiedCocktail.strDrinkThumb}" alt="${modifiedCocktail.strDrink}" width="100">
      <p>Category: ${modifiedCocktail.strCategory}</p>
      <p>Glass: ${modifiedCocktail.strGlass}</p>
      <p>Instructions: ${modifiedCocktail.strInstructions}</p>
      <button class="saveButton" data-cocktail='${JSON.stringify(modifiedCocktail)}'>Save</button>
      <button class="deleteButton" data-cocktail-id='${modifiedCocktail.idDrink}'>Delete</button>
    `;
    cocktailList.appendChild(cocktailDiv);
  });
}
