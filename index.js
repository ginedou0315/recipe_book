document.addEventListener("DOMContentLoaded", () => {
  // Elements
  let addRecipeButton = document.getElementById("addRecipeButton");
  let searchInput = document.getElementById("searchInput");
  let recipeList = document.getElementById("recipeList");
  let overlay = document.getElementById("overlayForm");
  let newRecipeForm = document.getElementById("newRecipeForm");
  let cancelForm = document.getElementById("cancelForm");
  let recipeElement = document.getElementById("recipe");
  let instructionInput = document.getElementById("user_instruction");
  let recipeFormElement = document.getElementById("recipe_generator");

  // 💾 Load saved recipe cards
  let savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  savedRecipes.forEach(displayRecipeCard);

  // 📥 Show overlay form
  addRecipeButton.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  // ❌ Cancel overlay
  cancelForm.addEventListener("click", () => {
    overlay.classList.add("hidden");
    newRecipeForm.reset();
  });

  // ✅ Save recipe from overlay
  newRecipeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let title = document.getElementById("recipeTitle").value.trim();
    let image = document.getElementById("recipeImage").value.trim();
    let ingredients = document.getElementById("recipeIngredients").value.trim();
    let instructions = document
      .getElementById("recipeInstructions")
      .value.trim();

    let recipe = { title, image, ingredients, instructions };

    let saved = JSON.parse(localStorage.getItem("recipes")) || [];
    saved.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(saved));

    displayRecipeCard(recipe);
    overlay.classList.add("hidden");
    newRecipeForm.reset();
  });

  // 🧾 Display a recipe card
  function displayRecipeCard(recipe) {
    let card = document.createElement("div");
    card.className = "card m-2";
    card.style.width = "18rem";

    card.innerHTML = `
      ${
        recipe.image
          ? `<img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">`
          : ""
      }
      <div class="card-body">
        <h5 class="card-title">${recipe.title}</h5>
        <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
        <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
      </div>
    `;

    recipeList.appendChild(card);
  }

  // 🧠 Recipe AI Generator
  function displayRecipe(response) {
    new Typewriter("#recipe", {
      strings: response.data.answer,
      autoStart: true,
      cursor: null,
      delay: 10,
    });
  }

  function generateRecipe(event) {
    event.preventDefault();

    let apiKey = "e430a0b40t5635ffab9bc012406aa3ao";
    let context = `You are a Professional Chef AI with a lot of knowledge in baking and cooking. You can generate simple recipes or search for recipes from any ingredients given by the user. Your recipes will have minimum 5 ingredients. The recipe must be written in HTML format. Do not write HTML at the beginning. Sign \`Chef AI 👩‍🍳\` in bigger bold Font and color purple at the end of the recipe.`;
    let prompt = `User's Instruction: Generate a simple but tasteful recipe that can be easily found in the kitchen about ${instructionInput.value}. Make sure the main ingredients is the User Instruction.`;

    recipeElement.classList.remove("hidden");
    recipeElement.innerHTML = `<div class="generating">🪄🪄🪄 Concocting the best recipes for ${instructionInput.value}...</div>`;

    axios
      .get(
        `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`
      )
      .then(displayRecipe)
      .catch((error) => {
        recipeElement.innerHTML = `<p class="text-danger">Oops! Something went wrong. Try again later.</p>`;
        console.error("Error fetching AI recipe:", error);
      });
  }

  recipeFormElement.addEventListener("submit", generateRecipe);
});
