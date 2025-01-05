document.addEventListener('DOMContentLoaded', () => {
 const urlParams = new URLSearchParams(window.location.search);
 const recipeIndex = urlParams.get('index');
 const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
 const recipe = recipes[recipeIndex];

 // Populate form with recipe details
 document.getElementById('edit-recipe-title').value = recipe.title;
 document.getElementById('edit-recipe-ingredients').value = recipe.ingredients.join(', ');
 document.getElementById('edit-recipe-steps').value = recipe.steps;

 // Handle form submission
 document.getElementById('edit-recipe-form').addEventListener('submit', (e) => {
   e.preventDefault();

   // Get updated values
   const updatedTitle = document.getElementById('edit-recipe-title').value;
   const updatedIngredients = document.getElementById('edit-recipe-ingredients').value.split(',');
   const updatedSteps = document.getElementById('edit-recipe-steps').value;

   // Update recipe in localStorage
   recipes[recipeIndex] = { title: updatedTitle, ingredients: updatedIngredients, steps: updatedSteps };
   localStorage.setItem('recipes', JSON.stringify(recipes));

   alert('Recipe updated successfully!');
   window.location.href = index.html;
  });
});