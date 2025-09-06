import React, { useState } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);


  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Frontend: Searching for recipes with: ${ingredients}`);

fetch(`/api/recipes?ingredients=${encodeURIComponent(ingredients)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Frontend: Received data from backend:", data);
        setRecipes(data); // Update the state with the recipes
      })
      .catch(err => console.error("Frontend: Fetch error:", err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Ideas for Taylor</h1>
        <p>What ingredients do you have?</p>
      </header>
      <main>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="e.g., chicken, tomatoes, rice"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button type="submit" className="search-button">
            Find Recipes
          </button>
        </form>

        {/* This is the new part for displaying recipes */}
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.name} />
              <h3>{recipe.name}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

