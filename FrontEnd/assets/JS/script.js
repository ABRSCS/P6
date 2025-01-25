// Configuration
const API = {
  BASE_URL: 'http://localhost:5678/api',
  ENDPOINTS: {
    WORKS: '/works',
    CATEGORIES: '/categories',
    LOGIN: '/users/login'
  },
  getFullUrl: function(endpoint) {
    return `${this.BASE_URL}${endpoint}`;
  }
};

// Variables globales
let data = []; // Données des travaux
let categories = []; // Catégories

// Classe APIService
class APIService {
  static async getData(endpoint, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const response = await fetch(API.getFullUrl(endpoint), { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Problème avec Fetch : ${error.message}`);
      throw error;
    }
  }

  static async postData(endpoint, data, token) {
    try {
      const response = await fetch(API.getFullUrl(endpoint), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Problème avec Fetch : ${error.message}`);
      throw error;
    }
  }

  static async deleteData(endpoint, token) {
    try {
      const response = await fetch(API.getFullUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Problème avec Fetch : ${error.message}`);
      throw error;
    }
  }
}

// Classe WorksDisplay
class WorksDisplay {
  static displayWorks(works) {
    const travauxList = document.getElementById('travauxList');
    travauxList.innerHTML = '';
    works.forEach(travail => {
      if (travail.category && travail.category.name) {
        const travailItem = document.createElement('figure');
        travailItem.dataset.category = travail.category.name;
        const img = document.createElement('img');
        img.src = travail.imageUrl;
        img.alt = travail.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = travail.title;
        travailItem.appendChild(img);
        travailItem.appendChild(figcaption);
        travauxList.appendChild(travailItem);
      }
    });
  }

  static generateCategoryMenu(categories) {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<button class="categoryButton active" data-category="all">Tous</button>';
    categories.forEach(category => {
      categoryFilter.innerHTML += `<button class="categoryButton" data-category="${category.name}">${category.name}</button>`;
    });
    this.addCategoryListeners();
  }

  static addCategoryListeners() {
    document.querySelectorAll('.categoryButton').forEach(button => {
      button.addEventListener('click', () => {
        const selectedCategory = button.getAttribute('data-category');
        document.querySelectorAll('.categoryButton').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        if (selectedCategory === 'all') {
          this.displayWorks(data);
        } else {
          const filteredWorks = data.filter(travail => travail.category && travail.category.name === selectedCategory);
          this.displayWorks(filteredWorks);
        }
      });
    });
  }
}

// Fonctions principales
async function init() {
  try {
    categories = await APIService.getData(API.ENDPOINTS.CATEGORIES);
    WorksDisplay.generateCategoryMenu(categories);
    data = await APIService.getData(API.ENDPOINTS.WORKS);
    WorksDisplay.displayWorks(data);
    setupModalListeners();
    checkAuthStatus();
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
}

function loadImagesInModal() {
  const photosList = document.getElementById('photosList');
  photosList.innerHTML = '';
  travauxList.innerHTML = '';
  
  data.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const trashIcon = document.createElement('i');
    trashIcon.className = 'fas fa-trash-alt trashIcon';
    trashIcon.addEventListener('click', () => deleteWork(work.id));
    
    figure.appendChild(img);
    figure.appendChild(trashIcon);
    photosList.appendChild(figure);
  });
}

function setupModalListeners() {
  // Variables pour la modale visuel 1 galerie photos
  const editBtn = document.querySelector(".editBtn");
  const galleryModal = document.getElementById("galleryModal");
  const closeBtn = document.querySelector(".close");
  const addPhotoBtn = document.getElementById("addPhotoBtn");
  const addPhotoForm = document.getElementById("addPhotoForm");
  const workDisplay = document.getElementById("workDisplay");

  //Variables pour la modale visuel 2 et 3 ajout photo
  const photoInput = document.getElementById('photoInput');
  const uploadForm = document.getElementById('uploadForm');
  const preview = document.getElementById('preview');
  const projectImage = document.getElementById('projectImage');
  const projectTitle = document.getElementById('projectTitle');
  const projectCategory = document.getElementById('projectCategory');

  editBtn.addEventListener("click", () => galleryModal.style.display = "block");
  closeBtn.addEventListener("click", () => galleryModal.style.display = "none");
  addPhotoBtn.addEventListener("click", () => {
    workDisplay.style.display = "none";
    addPhotoForm.style.display = "block";
  });

  editBtn.addEventListener("click", () => {
    galleryModal.style.display = "block";
    loadImagesInModal(); 
  });

  window.addEventListener("click", (event) => {
    if (event.target === galleryModal) {
      galleryModal.style.display = "none";
    }
  });

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    projectCategory.appendChild(option);
  });

  projectImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-image">`;
      };
      reader.readAsDataURL(file);
    }
  });

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', projectImage.files[0]);
    formData.append('title', projectTitle.value);
    formData.append('category', projectCategory.value);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API.getFullUrl(API.ENDPOINTS.WORKS),
{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newWork = await response.json();
    data.push(newWork);
    WorksDisplay.displayWorks(data);
    loadImagesInModal();
    galleryModal.style.display = "none";
    } catch (error) {
      console.error("Erreur lors de l'ajout du travail :", error);
    }
    });
}

async function deleteWork(workId) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé");
    return;
  }

  try {
    await APIService.deleteData(`${API.ENDPOINTS.WORKS}/${workId}`, token);
    data = data.filter(work => work.id !== workId);
    WorksDisplay.displayWorks(data);
    loadImagesInModal();
  } catch (error) {
    console.error("Erreur lors de la suppression du travail :", error);
  }
}


function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const editionModeElement = document.getElementById("editionMode");
  const categoryFilterElement = document.getElementById("categoryFilter");
  const editBtnElement = document.querySelector(".editBtn");

  if (token) {
    editionModeElement.innerHTML = "<p class='editionMode'>Mode édition</p>";
    editionModeElement.style.display = "block";
    categoryFilterElement.style.display = "none";
    editBtnElement.style.display = "flex";
    setupLogout();
  } else {
    editionModeElement.innerHTML = "";
    editionModeElement.style.display = "none";
    categoryFilterElement.style.display = "block";
    editBtnElement.style.display = "none";
  }
}

function setupLogout() {
  const loginItem = document.querySelector("#loginItem a");
  if (loginItem) {
    loginItem.textContent = "Logout";
    loginItem.href = "#";
    loginItem.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      checkAuthStatus();
      window.location.reload();
    });
  }
}

// Lancement de l'application
document.addEventListener('DOMContentLoaded', () => {
  init();
  checkAuthStatus();
});
