const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 
const app = express();


app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ message: "SUCCESS! The connection is working!" });
});


app.get('/api/recipes', async (req, res) => {
  const ingredients = req.query.ingredients;
  console.log(`Backend received a search request for: ${ingredients}`);

  if (!ingredients) {
    return res.status(400).json({ error: "No ingredients provided" });
  }


  const ingredientArray = ingredients.split(',').map(item => item.trim());

  try {
    const recipePromises = ingredientArray.map(ingredient =>
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
    );

    const recipeResults = await Promise.all(recipePromises);
    const meals = recipeResults.map(result => result.meals || []);
    const commonRecipes = meals.reduce((a, b) => a.filter(c => b.some(d => d.idMeal === c.idMeal)));


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


module.exports = app;
