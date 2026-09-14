document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'recipes';
  const recipeForm = document.getElementById('recipe-form');
  const recipesContainer = document.getElementById('recipes-container');
  const recipeSearch = document.getElementById('recipe-search');
  const clearAllButton = document.getElementById('clear-all');

  const normalizeIngredients = (value) =>
    value
      .split(/[\n,]+/)
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

  const getRecipes = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveRecipes = (recipes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  };

  const createRecipeCard = (recipe, index) => {
    const recipeCard = document.createElement('article');
    recipeCard.classList.add('recipe');

    const ingredients = (recipe.ingredients || []).map(
      (ingredient) => `<span class="ingredient-tag">${ingredient}</span>`
    ).join('');

    recipeCard.innerHTML = `
      <div class="recipe-meta">
        <span class="recipe-badge">${recipe.category || 'General'}</span>
        <span class="recipe-badge">${recipe.prepTime || 'Flexible'}</span>
      </div>

      <h3 class="recipe-title">
        <a href="edit-recipe.html?index=${index}">${recipe.title}</a>
      </h3>

      <div class="recipe-info">
        <div class="ingredients-list">${ingredients || '<span class="ingredient-tag">No ingredients listed</span>'}</div>
        <div><strong>Steps:</strong> ${recipe.steps}</div>
      </div>

      <div class="recipe-actions">
        <a class="inline-btn" href="edit-recipe.html?index=${index}">Edit</a>
        <button class="delete-btn delete-recipe" type="button" aria-label="Delete recipe">Delete</button>
      </div>
    `;

    recipeCard.querySelector('.delete-recipe').addEventListener('click', () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
      if (!confirmDelete) return;

      const recipes = getRecipes();
      recipes.splice(index, 1);
      saveRecipes(recipes);
      loadRecipes();
    });

    recipesContainer.appendChild(recipeCard);
  };

  const loadRecipes = () => {
    const recipes = getRecipes();
    const query = (recipeSearch?.value || '').trim().toLowerCase();

    const filteredRecipes = recipes
      .map((recipe, index) => ({ recipe, index }))
      .filter(({ recipe, index }) => {
        if (!query) return true;
        return (
          String(recipe.title || '').toLowerCase().includes(query) ||
          String(recipe.category || '').toLowerCase().includes(query) ||
          String(recipe.steps || '').toLowerCase().includes(query) ||
          String(recipe.prepTime || '').toLowerCase().includes(query) ||
          (recipe.ingredients || []).some((ingredient) =>
            String(ingredient).toLowerCase().includes(query)
          ) ||
          index.toString().includes(query)
        );
      });

    recipesContainer.innerHTML = '';

    if (!filteredRecipes.length) {
      recipesContainer.innerHTML = `
        <div class="empty-state">
          <h3>No recipes found</h3>
          <p>Add your first recipe or try a different search.</p>
        </div>
      `;
      return;
    }

    filteredRecipes.forEach(({ recipe, index }) => createRecipeCard(recipe, index));
  };

  recipeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('recipe-title').value.trim();
    const category = document.getElementById('recipe-category').value.trim() || 'General';
    const prepTime = document.getElementById('recipe-time').value.trim() || 'Flexible';
    const ingredients = normalizeIngredients(document.getElementById('recipe-ingredients').value);
    const steps = document.getElementById('recipe-steps').value.trim();

    if (!title || !ingredients.length || !steps) {
      window.alert('Please complete the title, ingredients, and steps before saving.');
      return;
    }

    const recipes = getRecipes();
    recipes.push({ title, category, prepTime, ingredients, steps });
    saveRecipes(recipes);

    loadRecipes();
    recipeForm.reset();
  });

  recipeSearch.addEventListener('input', loadRecipes);

  clearAllButton.addEventListener('click', () => {
    const confirmClear = window.confirm('Clear all recipes from this browser?');
    if (!confirmClear) return;

    localStorage.removeItem(STORAGE_KEY);
    loadRecipes();
  });

  loadRecipes();
});
