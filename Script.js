document.addEventListener('DOMContentLoaded', () => {
 const recipeForm = document.getElementById('recipe-form');
 const recipesContainer = document.getElementById('recipes-container');

 // Load recipes from localStorage
 const loadRecipes = () => {
   const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
   recipesContainer.innerHTML = ''; // Clear container
   recipes.forEach((recipe, index) => createRecipeCard(recipe, index));
 };

 // Save recipes to localStorage
 const saveRecipes = (recipes) => {
   localStorage.setItem('recipes', JSON.stringify(recipes));
 };

 // Create a recipe card
 const createRecipeCard = (recipe, index) => {
   const recipeCard = document.createElement('div');
   recipeCard.classList.add('recipe');
   recipeCard.innerHTML = `
     <h2>
       <B>
         <a href="edit-recipe.html?index=${index}">
           ${recipe.title}
         </a>
       </B>
     </h2>
     <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
     <p><strong>Steps:</strong> ${recipe.steps}</p>
     <button class="delete-recipe">&times;</button>
   `;

   // Delete functionality with confirmation
   recipeCard.querySelector('.delete-recipe').addEventListener('click', () => {
     const confirmDelete = confirm("Are you sure you want to delete this recipe?");
     if (confirmDelete) {
       const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
       recipes.splice(index, 1);
       saveRecipes(recipes);
       loadRecipes();
     }
   });

   recipesContainer.appendChild(recipeCard);
 };

 // Add a new recipe
 recipeForm.addEventListener('submit', (e) => {
   e.preventDefault();

   const title = document.getElementById('recipe-title').value;
   const ingredients = document.getElementById('recipe-ingredients').value.split(',');
   const steps = document.getElementById('recipe-steps').value;

   const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
   recipes.push({ title, ingredients, steps });
   saveRecipes(recipes);

   loadRecipes();
   recipeForm.reset();
 });

 // Initial load
 loadRecipes();
});