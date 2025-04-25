const recipes = [

  {

    title: "Nasi Goreng",

    description: "Nasi goreng dengan bumbu sederhana, cocok untuk sarapan.",

    image: "https://via.placeholder.com/300x180?text=Nasi+Goreng",

    ingredients: ["nasi", "bawang", "telur", "kecap", "cabai"]

  },

  {

    title: "Ayam Bakar",

    description: "Ayam bakar manis pedas dengan sambal terasi.",

    image: "https://via.placeholder.com/300x180?text=Ayam+Bakar",

    ingredients: ["ayam", "kecap", "bawang", "cabai"]

  },

  {

    title: "Mie Goreng",

    description: "Mie goreng praktis dengan sayuran dan telur.",

    image: "https://via.placeholder.com/300x180?text=Mie+Goreng",

    ingredients: ["mie", "telur", "wortel", "kol", "bawang"]

  }

];

const recipeList = document.getElementById("recipeList");

const searchInput = document.getElementById("searchInput");

const ingredientInput = document.getElementById("ingredientInput");

function displayRecipes(data) {

  recipeList.innerHTML = "";

  if (data.length === 0) {

    recipeList.innerHTML = "<p>Tidak ditemukan resep yang cocok.</p>";

    return;

  }

  data.forEach(recipe => {

    const card = document.createElement("div");

    card.className = "recipe-card";

    card.innerHTML = `

      <img src="${recipe.image}" alt="${recipe.title}">

      <div class="content">

        <h3>${recipe.title}</h3>

        <p>${recipe.description}</p>

        <button onclick="saveRecipe('${recipe.title}')">Simpan Resep</button>

      </div>

    `;

    recipeList.appendChild(card);

  });

}

function saveRecipe(title) {

  alert(`Resep "${title}" disimpan!`);

}

function filterRecipes() {

  const search = searchInput.value.toLowerCase();

  const ingredients = ingredientInput.value.toLowerCase().split(",").map(i => i.trim());

  const filtered = recipes.filter(recipe => {

    const matchTitle = recipe.title.toLowerCase().includes(search);

    const matchIngredients = ingredients.every(i =>

      i === "" || recipe.ingredients.includes(i)

    );

    return matchTitle && matchIngredients;

  });

  displayRecipes(filtered);

}

searchInput.addEventListener("input", filterRecipes);

ingredientInput.addEventListener("input", filterRecipes);

// Tampilkan semua resep saat pertama kali dibuka

displayRecipes(recipes);