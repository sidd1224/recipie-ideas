const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Import the fetch library
const app = express();
const PORT = 5001;

app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ message: "SUCCESS! The connection is working!" });
});

// --- This is the updated endpoint ---
app.get('/api/recipes', async (req, res) => {
  const ingredients = req.query.ingredients;
  console.log(`Backend received a search request for: ${ingredients}`);

  if (!ingredients) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  // Split the comma-separated string into an array of ingredients
  const ingredientArray = ingredients.split(',').map(item => item.trim());

  try {
    // 1. Fetch recipes for each ingredient in parallel
    const recipePromises = ingredientArray.map(ingredient =>
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
    );

    const recipeResults = await Promise.all(recipePromises);

    // 2. Find the intersection of all the recipe lists
    // This is the core logic that finds recipes matching ALL ingredients
    const meals = recipeResults.map(result => result.meals || []);
    const commonRecipes = meals.reduce((a, b) => a.filter(c => b.some(d => d.idMeal === c.idMeal)));

    // 3. Format the data for the frontend
    const formattedRecipes = commonRecipes.map(recipe => ({
      id: recipe.idMeal,
      name: recipe.strMeal,
      image: recipe.strMealThumb
    }));

    console.log(`Found ${formattedRecipes.length} matching recipes.`);
    res.json(formattedRecipes);

  } catch (error) {
    console.error("Error fetching from TheMealDB:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

