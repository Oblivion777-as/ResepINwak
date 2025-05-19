// Data resep contoh
const recipes = [
    {
        id: 1,
        title: "Nasi Goreng Spesial",
        image: "https://source.unsplash.com/random/800x600/?fried-rice",
        ingredients: [
            "Nasi putih",
            "Telur",
            "Bawang merah",
            "Bawang putih",
            "Kecap manis",
            "Garam",
            "Minyak goreng",
            "Ayam suwir"
        ],
        steps: [
            "Panaskan minyak dalam wajan",
            "Tumis bawang merah dan bawang putih hingga harum",
            "Masukkan telur, orak-arik",
            "Tambahkan nasi putih, aduk rata",
            "Bumbui dengan kecap manis dan garam",
            "Masukkan ayam suwir, aduk hingga matang",
            "Sajikan hangat"
        ]
    },
    // ... (data resep lainnya tetap sama)
];

// State Management
let appState = {
    currentView: 'main',
    previousStates: [],
    selectedIngredients: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    currentRecipes: [...recipes]
};

// DOM Elements
const dom = {
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    ingredientInput: document.getElementById('ingredient-input'),
    addIngredientBtn: document.getElementById('add-ingredient-btn'),
    ingredientsTags: document.getElementById('ingredients-tags'),
    filterBtn: document.getElementById('filter-btn'),
    resetBtn: document.getElementById('reset-btn'),
    showFavoritesBtn: document.getElementById('show-favorites-btn'),
    recipesContainer: document.getElementById('recipes-container'),
    mainHeader: document.querySelector('.main-header'),
    subMenuHeader: document.querySelector('.submenu-header'),
    subMenuTitle: document.querySelector('.submenu-title'),
    subMenuInfo: document.querySelector('.submenu-info'),
    recipeModal: document.getElementById('recipe-modal'),
    closeModal: document.getElementById('close-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalImage: document.getElementById('modal-image'),
    modalIngredients: document.getElementById('modal-ingredients'),
    modalSteps: document.getElementById('modal-steps'),
    favoriteBtn: document.getElementById('favorite-btn')
};

// Fungsi Tampilan Resep
function displayRecipes(recipesToDisplay) {
    dom.recipesContainer.innerHTML = '';
    
    if (recipesToDisplay.length === 0) {
        dom.recipesContainer.innerHTML = `
            <div class="empty-state">
                <p>📭 Tidak ditemukan resep yang sesuai</p>
            </div>
        `;
        return;
    }
    
    recipesToDisplay.forEach(recipe => {
        const isFavorited = appState.favorites.includes(recipe.id);
        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.image}" 
                     alt="${recipe.title}" 
                     class="recipe-image"
                     onerror="this.src='img/default-food.jpg'">
                <div class="recipe-info">
                    <h3>${recipe.title}</h3>
                    <div class="ingredients-preview">
                        ${recipe.ingredients.slice(0, 3).join(', ')}...
                    </div>
                    <div class="recipe-actions">
                        <button class="view-btn" data-id="${recipe.id}">👁️ Lihat</button>
                        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                                data-id="${recipe.id}">
                            ${isFavorited ? '❤️ Favorit' : '♡ Favorit'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        dom.recipesContainer.insertAdjacentHTML('beforeend', recipeCard);
    });

    // Event Listeners untuk tombol
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recipeId = parseInt(e.target.dataset.id);
            showRecipeModal(recipeId);
        });
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recipeId = parseInt(e.target.dataset.id);
            toggleFavorite(recipeId);
        });
    });
}

// Fungsi Navigasi
function navigateTo(viewType, title, additionalInfo = '') {
    appState.previousStates.push({
        type: appState.currentView,
        title: document.title,
        recipes: appState.currentRecipes
    });
    
    appState.currentView = viewType;
    updateView(title, viewType, additionalInfo);
    updateDocumentTitle(title);
}

function goBack() {
    if (appState.previousStates.length > 0) {
        const prevState = appState.previousStates.pop();
        appState.currentView = prevState.type;
        appState.currentRecipes = prevState.recipes;
        updateView(prevState.title, prevState.type);
        displayRecipes(appState.currentRecipes);
        updateDocumentTitle(prevState.title);
    }
}

// Fungsi Pencarian
function handleSearch() {
    const searchTerm = dom.searchInput.value.trim().toLowerCase();
    if (!searchTerm) return;

    appState.currentRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
    
    navigateTo('search', `Hasil Pencarian: "${searchTerm}"`);
    displayRecipes(appState.currentRecipes);
}

// Fungsi Filter Bahan
function applyFilter() {
    if (appState.selectedIngredients.length === 0) {
        alert('Silakan tambahkan bahan terlebih dahulu!');
        return;
    }

    appState.currentRecipes = recipes.filter(recipe =>
        appState.selectedIngredients.every(ing =>
            recipe.ingredients.some(recipeIng =>
                recipeIng.toLowerCase().includes(ing.toLowerCase())
            )
        )
    );
    
    navigateTo(
        'filter', 
        'Resep Berdasarkan Bahan',
        `Bahan: ${appState.selectedIngredients.join(', ')}`
    );
    displayRecipes(appState.currentRecipes);
}

// Fungsi Favorit
function toggleFavorite(recipeId) {
    const index = appState.favorites.indexOf(recipeId);
    if (index === -1) {
        appState.favorites.push(recipeId);
    } else {
        appState.favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(appState.favorites));
    
    if (appState.currentView === 'favorites') {
        showFavorites();
    } else {
        displayRecipes(appState.currentRecipes);
    }
}

function showFavorites() {
    appState.currentRecipes = recipes.filter(r => 
        appState.favorites.includes(r.id)
    );
    
    navigateTo('favorites', 'Resep Favorit');
    displayRecipes(appState.currentRecipes);
}

// Fungsi Bahan
function addIngredient() {
    const ingredient = dom.ingredientInput.value.trim();
    if (ingredient && !appState.selectedIngredients.includes(ingredient)) {
        appState.selectedIngredients.push(ingredient);
        updateIngredientsTags();
        dom.ingredientInput.value = '';
    }
}

function updateIngredientsTags() {
    dom.ingredientsTags.innerHTML = '';
    appState.selectedIngredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${ingredient}
            <span class="tag-remove" data-ingredient="${ingredient}">&times;</span>
        `;
        dom.ingredientsTags.appendChild(tag);
    });

    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ingredientToRemove = e.target.dataset.ingredient;
            appState.selectedIngredients = appState.selectedIngredients.filter(
                ing => ing !== ingredientToRemove
            );
            updateIngredientsTags();
        });
    });
}

// Fungsi Modal
function showRecipeModal(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    dom.modalTitle.textContent = recipe.title;
    dom.modalImage.src = recipe.image;
    dom.modalImage.alt = recipe.title;

    dom.modalIngredients.innerHTML = '';
    recipe.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        dom.modalIngredients.appendChild(li);
    });

    dom.modalSteps.innerHTML = '';
    recipe.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        dom.modalSteps.appendChild(li);
    });

    const isFavorited = appState.favorites.includes(recipeId);
    dom.favoriteBtn.textContent = isFavorited ? '❤️ Hapus Favorit' : '♡ Tambah Favorit';
    dom.favoriteBtn.dataset.id = recipeId;
    
    dom.recipeModal.style.display = 'block';
}

// Fungsi Bantuan
function updateView(title, type, additionalInfo = '') {
    if (type === 'main') {
        dom.mainHeader.style.display = 'block';
        dom.subMenuHeader.classList.add('hidden');
    } else {
        dom.mainHeader.style.display = 'none';
        dom.subMenuHeader.classList.remove('hidden');
        dom.subMenuTitle.textContent = title;
        dom.subMenuInfo.textContent = additionalInfo;
    }
}

function updateDocumentTitle(title) {
    document.title = `${title} - ResepIN`;
}

function resetApp() {
    appState = {
        currentView: 'main',
        previousStates: [],
        selectedIngredients: [],
        favorites: JSON.parse(localStorage.getItem('favorites')) || [],
        currentRecipes: [...recipes]
    };
    dom.searchInput.value = '';
    updateIngredientsTags();
    updateView('Resep Terbaru', 'main');
    displayRecipes(appState.currentRecipes);
}

// Event Listeners
dom.searchBtn.addEventListener('click', handleSearch);
dom.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

dom.addIngredientBtn.addEventListener('click', addIngredient);
dom.ingredientInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addIngredient();
});

dom.filterBtn.addEventListener('click', applyFilter);
dom.resetBtn.addEventListener('click', resetApp);
dom.showFavoritesBtn.addEventListener('click', showFavorites);
dom.closeModal.addEventListener('click', () => {
    dom.recipeModal.style.display = 'none';
});
dom.favoriteBtn.addEventListener('click', (e) => {
    const recipeId = parseInt(e.target.dataset.id);
    toggleFavorite(recipeId);
    dom.recipeModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === dom.recipeModal) {
        dom.recipeModal.style.display = 'none';
    }
});

// Inisialisasi
updateView('Resep Terbaru', 'main');
displayRecipes(appState.currentRecipes);
