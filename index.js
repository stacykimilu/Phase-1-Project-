document.addEventListener('DOMContentLoaded', function () {
  // Get references to search button and input
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  // Search button click event listener
  searchButton.addEventListener('click', function () {
      searchCocktails();
  });

  // Search input change event listener 
  searchInput.addEventListener('input', function () {
      console.log('Search input value changed:', searchInput.value);
      searchCocktails();
  });

  // Function to search for cocktails
  function searchCocktails() {
      const searchInputValue = searchInput.value;
      // Construct the API URL with the search query
      const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInputValue}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              // Display the cocktails received from the API
              displayCocktails(data.drinks);
          })
          .catch(error => {
              console.error('Error fetching data:', error.message);
          });
  }

  // Function to save cocktail data
  function saveCocktail() {
      fetch("http://localhost:3000/cocktails", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({}) // No argument passed
      })
          .then(res => res.json())
          .then(data => console.log(data))
          .catch(error => console.error("Error saving cocktail:", error));
  }

  // Function to delete cocktail data
  async function deleteCocktail(cocktailId) {
      try {
          const requestOptions = {
              method: "DELETE"
          };
          const response = await fetch(`http://localhost:3000/cocktails/${cocktailId}`, requestOptions);
          if (!response.ok) {
              throw new Error("Failed to delete cocktail.");
          }
          // Remove the cocktail from the UI
          const cocktailElement = document.querySelector(`[data-id="${cocktailId}"]`);
          if (cocktailElement) {
              cocktailElement.remove();
          }
      } catch (error) {
          console.error("Error deleting cocktail:", error);
      }
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
          cocktailDiv.dataset.id = cocktail.idDrink; // Set data-id attribute
          cocktailDiv.innerHTML = `
              <h2>${modifiedCocktail.strDrink}</h2>
              <img src="${modifiedCocktail.strDrinkThumb}" alt="${modifiedCocktail.strDrink}" width="100">
              <p>Category: ${modifiedCocktail.strCategory}</p>
              <p>Glass: ${modifiedCocktail.strGlass}</p>
              <p>Instructions: ${modifiedCocktail.strInstructions}</p>
              <button class="save-btn">Save Cocktail</button>
              <button class="delete-btn">Delete Cocktail</button>
          `;
          cocktailList.appendChild(cocktailDiv);

          // Attach event listeners dynamically
          cocktailDiv.querySelector('.save-btn').addEventListener('click', saveCocktail);
          cocktailDiv.querySelector('.delete-btn').addEventListener('click', () => deleteCocktail(cocktail.idDrink));
      });
  }
});
