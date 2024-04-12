document.addEventListener('DOMContentLoaded', function () {
    // Get references to search button, search input, and cocktail list
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const cocktailList = document.getElementById('cocktailList');
  
    // Check if required elements exist
    if (!searchButton || !searchInput || !cocktailList) {
        console.error('Required elements not found.');
        return;
    }
  
    // Add event listeners for search button click and input change
    searchButton.addEventListener('click', searchCocktails);
    searchInput.addEventListener('input', searchCocktails);
  
    // Function to search for cocktails
    function searchCocktails() {
        const searchInputValue = searchInput.value.trim();
        if (!searchInputValue) {
            displayMessage('Please enter a search query.');
            return;
        }
        
        // Construct API URL with search query
        const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchInputValue)}`;
  
        // Fetch cocktails from API
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                // Display cocktails if found
                if (!data.drinks) {
                    displayMessage('No cocktails found.');
                    return;
                }
                displayCocktails(data.drinks);
            })
            .catch(error => {
                // Handle errors during fetching
                console.error('Error fetching data:', error);
                displayMessage('An error occurred. Please try again later.');
            });
    }
  
     // Function to save cocktail data
     function saveCocktail() {
      // Implement save functionality here
      fetch("http://localhost:3000/cocktails", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({})
      })
          .then(res => res.json())
          .then(data => console.log(data))
          .catch(error => console.error("Error saving cocktail:", error));
  }
  
    // Function to display cocktails
    function displayCocktails(cocktails) {
        //  cocktail list
        cocktailList.innerHTML = '';
        // Iterate over each cocktail and display it
        cocktails.forEach(cocktail => {
            const instructions = cocktail.strInstructions ? 
                                 cocktail.strInstructions.charAt(0).toUpperCase() + cocktail.strInstructions.slice(1).toLowerCase() :
                                 'No instructions available';
            const cocktailDiv = document.createElement('div');
            cocktailDiv.classList.add('cocktail');
            cocktailDiv.dataset.id = cocktail.idDrink;
            cocktailDiv.innerHTML = `
                <h2>${cocktail.strDrink}</h2>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" width="100">
                <p>Category: ${cocktail.strCategory || 'Unknown'}</p>
                <p>Glass: ${cocktail.strGlass || 'Unknown'}</p>
                <p>Instructions: ${instructions}</p>
                <button class="save-btn">Save Cocktail</button>
                <!-- Review form -->
                <div class="reviewForm">
                  <h3>Add Your Review</h3>
                  <label for="username">Username:</label>
                 <input type="text" id="username" name="username" required><br><br>
                 <label for="rating-${cocktail.idDrink}">Rating:</label>
                  <select id="rating-${cocktail.idDrink}" name="rating-${cocktail.idDrink}" required>
                      <option value="">Select...</option>
                      <option value="1">⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                  </select><br><br>
                  
                  <label for="comment-${cocktail.idDrink}">Comment:</label><br>
                  <textarea id="comment-${cocktail.idDrink}" name="comment-${cocktail.idDrink}" rows="4" cols="50" required></textarea><br><br>
                  
                  <button class="submitReviewButton" data-cocktail-id="${cocktail.idDrink}">Submit Review</button>
              </div>
            `;
            cocktailList.appendChild(cocktailDiv);
            // Add event listener for save button
            cocktailDiv.querySelector('.save-btn').addEventListener('click', saveCocktail);
        });
    }
  
    // Function to display messages in the cocktail list
    function displayMessage(message) {
        cocktailList.innerHTML = `<p>${message}</p>`;
    }
  });
  