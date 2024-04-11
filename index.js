document.addEventListener('DOMContentLoaded', function () {
  // Get references to search button and input
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  // Search button click event listener
  searchButton.addEventListener('click', function () {
    searchCocktails();
  });

  // Search input change event listener (optional)
  searchInput.addEventListener('input', function () {
    console.log('Search input value changed:', searchInput.value);
    // Uncomment to search on every input change
    // searchCocktails();
  });

  // Function to search for cocktails
  function searchCocktails() {
    const searchInputValue = searchInput.value;
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInputValue}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayCocktails(data.drinks);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  // Save button click event listener
  document.addEventListener('click', function (event) {
    if (event.target.matches('.saveButton')) {
      const cocktailData = JSON.parse(event.target.dataset.cocktail);
      saveCocktail(cocktailData);
    }
  });

  function saveCocktail(cocktailData) {
    const { idDrink, strDrink, strInstructions, strDrinkThumb } = cocktailData;

    const dataToSave = {
      idDrink,
      strDrink,
      strInstructions,
      strDrinkThumb
    };

    fetch("http://localhost:3000/cocktails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSave)
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error saving cocktail:", error));
  }

  // Delete button click event listener (basic implementation)
  document.addEventListener('click', function (event) {
    if (event.target.matches('.deleteButton')) {
      const cocktailId = event.target.dataset.cocktailId;
      console.log('Deleting cocktail with ID:', cocktailId);
      // Implement logic to delete from server or UI here
    }
  });

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
      const cocktailDiv = document.createElement('div');
      cocktailDiv.classList.add('cocktail');
      cocktailDiv.innerHTML = `
        <h2>${cocktail.strDrink}</h2>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" width="100">
        <p>Category: ${cocktail.strCategory}</p>
        <p>Glass: ${cocktail.strGlass}</p>
        <p>Instructions: ${cocktail.strInstructions}</p>
        <button class="saveButton" data-cocktail='${JSON.stringify(cocktail)}'>Save</button>
        <button class="deleteButton" data-cocktail-id='${cocktail.idDrink}'>Delete</button>
      `;
      cocktailList.appendChild(cocktailDiv);
    });
  }
});
