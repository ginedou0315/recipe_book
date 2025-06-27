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
  refreshRecipeList();

  // 📥 Show overlay form
  addRecipeButton.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    newRecipeForm.onsubmit = defaultSubmitHandler;
  });

  // ❌ Cancel overlay
  cancelForm.addEventListener("click", () => {
    overlay.classList.add("hidden");
    newRecipeForm.reset();
    newRecipeForm.onsubmit = defaultSubmitHandler;
  });

  // ✅ Save recipe from overlay
  function defaultSubmitHandler(e) {
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

    overlay.classList.add("hidden");
    newRecipeForm.reset();
    refreshRecipeList();
  }

  newRecipeForm.onsubmit = defaultSubmitHandler;

  // 🧾 Display a recipe card
  function displayRecipeCard(recipe, index) {
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card m-2";
    cardWrapper.style.width = "18rem";

    cardWrapper.innerHTML = `
      ${
        recipe.image
          ? `<img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">`
          : ""
      }
      <div class="card-body">
        <h5 class="card-title">${recipe.title}</h5>
        <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
        <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
       <div class="d-flex justify-content-between mt-3">
  <button class="btn btn-sm btn-warning edit-btn">Edit</button>
  <button class="btn btn-sm btn-danger delete-btn">Delete</button>
</div>
      </div>
    `;

    // Delete or Edit Recipes
    cardWrapper.querySelector(".delete-btn").addEventListener("click", () => {
      let saved = JSON.parse(localStorage.getItem("recipes")) || [];
      saved.splice(index, 1);
      localStorage.setItem("recipes", JSON.stringify(saved));
      refreshRecipeList();
    });

    cardWrapper.querySelector(".edit-btn").addEventListener("click", () => {
      let saved = JSON.parse(localStorage.getItem("recipes")) || [];
      let r = saved[index];

      // Pre-fill the overlay form
      document.getElementById("recipeTitle").value = recipe.title;
      document.getElementById("recipeImage").value = recipe.image;
      document.getElementById("recipeIngredients").value = recipe.ingredients;
      document.getElementById("recipeInstructions").value = recipe.instructions;

      // Show overlay
      overlay.classList.remove("hidden");

      // Replace submit handler temporarily
      newRecipeForm.onsubmit = function (e) {
        e.preventDefault();

        saved[index] = {
          title: document.getElementById("recipeTitle").value.trim(),
          image: document.getElementById("recipeImage").value.trim(),
          ingredients: document
            .getElementById("recipeIngredients")
            .value.trim(),
          instructions: document
            .getElementById("recipeInstructions")
            .value.trim(),
        };

        localStorage.setItem("recipes", JSON.stringify(saved));
        overlay.classList.add("hidden");
        newRecipeForm.reset();
        newRecipeForm.onsubmit = defaultSubmitHandler;
        refreshRecipeList();
      };
    });

    recipeList.appendChild(cardWrapper);
  }
  // Refresh recipe list
  function refreshRecipeList() {
    recipeList.innerHTML = "";
    let saved = JSON.parse(localStorage.getItem("recipes")) || [];
    saved.forEach((recipe, index) => displayRecipeCard(recipe, index));
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
