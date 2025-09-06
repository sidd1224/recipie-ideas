import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  // --- START: New State for UX ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // To track if a search has been performed
  const [resultsTitle, setResultsTitle] = useState('Featured Recipes');
  // --- END: New State for UX ---

  // --- START: Fetch initial recipes on page load ---
  useEffect(() => {
    const fetchInitialRecipes = () => {
      setIsLoading(true);
      setError(null);
      // Fetching from a default category to show some initial recipes
      const initialApiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood';

      fetch(initialApiUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load initial recipes');
          return res.json();
        })
        .then(data => {
          const formatted = data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb
          })).slice(0, 8); // Show the first 8 to keep it clean
          setRecipes(formatted);
        })
        .catch(err => {
          console.error("Initial fetch error:", err);
          setError("Welcome! Please search for ingredients to get started.");
        })
        .finally(() => setIsLoading(false));
    };

    fetchInitialRecipes();
  }, []); // The empty array ensures this runs only once on mount
  // --- END: Fetch initial recipes ---


  const handleSearch = (e) => {
    e.preventDefault();
    if (!ingredients) return; // Prevent search if input is empty

    // Reset states for a new search
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setSearched(true);
    setResultsTitle('Your Results'); // Change the title for search results
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

          {!isLoading && !error && recipes.length > 0 && (
            <h2 className="results-title">{resultsTitle}</h2>
          )}

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

      {/* This footer was missing from the previous version */}
      <footer className="app-footer">
        <p>
          Developed by Siddharth Singh | <a href="https://github.com/sidd1224/recipie-ideas" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;

