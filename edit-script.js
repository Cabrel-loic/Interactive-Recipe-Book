document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'recipes';
  const urlParams = new URLSearchParams(window.location.search);
  const recipeIndex = Number(urlParams.get('index'));
  const recipes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const recipe = recipes[recipeIndex];

  if (!recipe || Number.isNaN(recipeIndex)) {
    window.location.href = 'index.html';
    return;
  }

  const normalizeIngredients = (value) =>
    value
      .split(/[\n,]+/)
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

  document.getElementById('edit-recipe-title').value = recipe.title || '';
  document.getElementById('edit-recipe-category').value = recipe.category || '';
  document.getElementById('edit-recipe-time').value = recipe.prepTime || '';
  document.getElementById('edit-recipe-ingredients').value = (recipe.ingredients || []).join(', ');
  document.getElementById('edit-recipe-steps').value = recipe.steps || '';

  document.getElementById('edit-recipe-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedTitle = document.getElementById('edit-recipe-title').value.trim();
    const updatedCategory = document.getElementById('edit-recipe-category').value.trim() || 'General';
    const updatedPrepTime = document.getElementById('edit-recipe-time').value.trim() || 'Flexible';
    const updatedIngredients = normalizeIngredients(document.getElementById('edit-recipe-ingredients').value);
    const updatedSteps = document.getElementById('edit-recipe-steps').value.trim();

    if (!updatedTitle || !updatedIngredients.length || !updatedSteps) {
      window.alert('Please complete the recipe name, ingredients, and steps before saving.');
      return;
    }

    recipes[recipeIndex] = {
      title: updatedTitle,
      category: updatedCategory,
      prepTime: updatedPrepTime,
      ingredients: updatedIngredients,
      steps: updatedSteps,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    window.alert('Recipe updated successfully!');
    window.location.href = 'index.html';
  });
});