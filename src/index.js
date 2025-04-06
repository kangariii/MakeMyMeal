import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample recipe database
  const recipeDatabase = [
    {
      name: 'Pasta Aglio e Olio',
      ingredients: ['pasta', 'garlic', 'olive oil', 'red pepper flakes', 'parsley'],
      instructions: 'Boil pasta. Sauté garlic in olive oil. Add red pepper flakes. Toss with pasta and garnish with parsley.',
      cookingTime: 20
    },
    {
      name: 'Scrambled Eggs',
      ingredients: ['eggs', 'butter', 'salt', 'pepper'],
      instructions: 'Whisk eggs. Melt butter in pan. Cook eggs on low heat, stirring constantly.',
      cookingTime: 5
    },
    {
      name: 'Tomato Soup',
      ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'olive oil', 'salt', 'pepper'],
      instructions: 'Sauté onion and garlic. Add tomatoes and broth. Simmer. Blend until smooth.',
      cookingTime: 30
    },
    {
      name: 'Grilled Cheese Sandwich',
      ingredients: ['bread', 'cheese', 'butter'],
      instructions: 'Butter bread. Add cheese between slices. Grill until golden and cheese melts.',
      cookingTime: 10
    },
    {
      name: 'Avocado Toast',
      ingredients: ['bread', 'avocado', 'salt', 'pepper', 'olive oil'],
      instructions: 'Toast bread. Mash avocado with salt, pepper, and olive oil. Spread on toast.',
      cookingTime: 5
    },
    {
      name: 'Vegetable Stir Fry',
      ingredients: ['rice', 'bell pepper', 'broccoli', 'carrot', 'soy sauce', 'garlic', 'ginger', 'vegetable oil'],
      instructions: 'Cook rice. Stir fry vegetables with garlic and ginger. Add soy sauce. Serve over rice.',
      cookingTime: 25
    },
    {
      name: 'Banana Smoothie',
      ingredients: ['banana', 'milk', 'yogurt', 'honey', 'ice'],
      instructions: 'Blend all ingredients until smooth.',
      cookingTime: 3
    },
    {
      name: 'Guacamole',
      ingredients: ['avocado', 'onion', 'tomato', 'lime', 'salt', 'cilantro', 'garlic'],
      instructions: 'Mash avocados. Mix in diced onion, tomato, minced garlic, lime juice, salt, and cilantro.',
      cookingTime: 15
    }
  ];

  const addIngredient = () => {
    if (currentIngredient.trim() !== '' && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const findRecipes = () => {
    setLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      if (ingredients.length === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      // Find recipes that have at least one matching ingredient
      const matchedRecipes = recipeDatabase.filter(recipe => {
        const matchCount = recipe.ingredients.filter(ingredient => 
          ingredients.some(userIngredient => 
            ingredient.toLowerCase().includes(userIngredient.toLowerCase()) || 
            userIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;
        
        // Return true if at least half of user's ingredients are used
        // or if all ingredients in the recipe are available
        return matchCount >= Math.min(ingredients.length * 0.5, recipe.ingredients.length);
      });

      // Sort by match quality (number of matching ingredients)
      matchedRecipes.sort((a, b) => {
        const aMatches = a.ingredients.filter(ingredient => 
          ingredients.some(userIngredient => 
            ingredient.toLowerCase().includes(userIngredient.toLowerCase()) || 
            userIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;
        
        const bMatches = b.ingredients.filter(ingredient => 
          ingredients.some(userIngredient => 
            ingredient.toLowerCase().includes(userIngredient.toLowerCase()) || 
            userIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;
        
        return bMatches - aMatches;
      });
      
      setRecipes(matchedRecipes);
      setLoading(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="app-container">
      <h1>What's in Your Pantry?</h1>
      <div className="ingredient-input">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter an ingredient"
        />
        <button onClick={addIngredient}>Add</button>
      </div>

      <div className="ingredients-list">
        <h2>Your Ingredients:</h2>
        {ingredients.length === 0 ? (
          <p>No ingredients added yet</p>
        ) : (
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient}
                <button onClick={() => removeIngredient(ingredient)}>✕</button>
              </li>
            ))}
          </ul>
        )}
        <button 
          className="find-recipes-btn" 
          onClick={findRecipes}
          disabled={ingredients.length === 0}
        >
          Find Recipes
        </button>
      </div>

      <div className="recipes-container">
        <h2>Recipe Suggestions:</h2>
        {loading ? (
          <p>Finding recipes...</p>
        ) : recipes.length === 0 ? (
          <p>No recipes found. Try adding more ingredients!</p>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe, index) => (
              <div className="recipe-card" key={index}>
                <h3>{recipe.name}</h3>
                <div className="cooking-time">
                  <span className="time-label">⏱️ Cooking Time:</span> {recipe.cookingTime} minutes
                </div>
                <div className="recipe-ingredients">
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i} className={ingredients.some(userIng => 
                        ingredient.toLowerCase().includes(userIng.toLowerCase()) || 
                        userIng.toLowerCase().includes(ingredient.toLowerCase())
                      ) ? 'available' : 'missing'}>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="recipe-instructions">
                  <h4>Instructions:</h4>
                  <p>{recipe.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
