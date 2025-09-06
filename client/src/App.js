import React, { useState } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  // --- START: New State for UX ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // To track if a search has been performed
  // --- END: New State for UX ---

  const handleSearch = (e) => {
    e.preventDefault();
    if (!ingredients) return; // Prevent search if input is empty

    // Reset states for a new search
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setSearched(true);
    console.log(`Frontend: Searching for recipes with: ${ingredients}`);

    const API_URL = process.env.REACT_APP_API_URL; // backend URL from env

    fetch(`${API_URL}/api/recipes?ingredients=${encodeURIComponent(ingredients)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log("Frontend: Received data from backend:", data);
        setRecipes(data);
      })
      .catch(err => {
        console.error("Frontend: Fetch error:", err);
        setError("Sorry, something went wrong. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false); // Stop loading in all cases
      });
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
          <button type="submit" className="search-button" disabled={!ingredients || isLoading}>
            {isLoading ? 'Searching...' : 'Find Recipes'}
          </button>
        </form>

        {/* --- START: Conditional Rendering for UX --- */}
        <div className="results-container">
          {isLoading && <p className="loading-message">Searching for the best recipes...</p>}
          
          {error && <p className="error-message">{error}</p>}

          {!isLoading && !error && searched && recipes.length === 0 && (
            <p className="no-results-message">No matching recipes found. Try different ingredients!</p>
          )}

          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <a 
                key={recipe.id} 
                href={`https://www.themealdb.com/meal/${recipe.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="recipe-card"
              >
                <img src={recipe.image} alt={recipe.name} />
                <h3>{recipe.name}</h3>
              </a>
            ))}
          </div>
        </div>
        {/* --- END: Conditional Rendering for UX --- */}
      </main>

  
    </div>
  );
}

export default App;

