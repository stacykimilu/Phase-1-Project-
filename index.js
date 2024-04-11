function searchCocktails() {
    const searchInput = document.getElementById('searchInput').value;
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayCocktails(data.drinks);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
function saveCocktail(cocktailId){
  fetch("http://localhost:3000/cocktails", {
    method: "POST",
    body: JSON.stringify({ cocktailId })
  })
  .then(res => res.json())
  .then(data => console.log(data))
}

function removeCocktail(id){
  fetch(`http://localhost:3000/cocktails/${id}`, {
    method: "DELETE",
  })
  .then(res => res.json())
  .then(data => console.log(data))
}

  function displayCocktails(cocktails) {
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
        <button onclick="saveCocktail(${cocktail.idDrink})">Save</button>
      `;
      cocktailList.appendChild(cocktailDiv);
    });
  }
  