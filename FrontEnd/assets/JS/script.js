//Script JS Page
const url = 'http://localhost:5678/api'; //  l'URL de votre API
const loginUrl = `${url}/login`; // URL pour la connexion
const categoriesUrl = 'http://localhost:5678/api/categories'; //  l'URL des catégories

let data; // Variable pour stocker les données des travaux
let token; // Variable pour stocker le token d'authentification
let categories; // Variable pour stocker les catégories



async function getData() {
  try {
    const response = await fetch(url + "/works", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    data = await response.json();
    console.log(data);
    displayWorks(data);
  } catch (error) {
    console.error(`Problème avec Fetch : ${error.message}`);
  }
}

function displayWorks(works) {
  const travauxList = document.getElementById('travauxList');
  travauxList.innerHTML = ''; // Effacer les travaux existants
  works.forEach(travail => {
    if (travail.category && travail.category.name) { // Vérification pour éviter les erreurs
      const travailItem = document.createElement('figure');
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

async function getCategories() {
  try {
    const response = await fetch(categoriesUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    categories = await response.json();
    return categories;
  } catch (error) {
    console.error(`Problème avec Fetch : ${errorMessage}`);
  }
}

async function generateCategoryMenu(categories) {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = ''; // Effacer les boutons existants
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('categoryButton');
  allButton.classList.add('active');
  allButton.setAttribute('dataCategory', 'all');
  categoryFilter.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.classList.add('categoryButton');
    button.setAttribute('dataCategory', category.name);
    categoryFilter.appendChild(button);
  });

  // Ajouter les événements de clic pour les boutons de catégorie
  document.querySelectorAll('.categoryButton').forEach(button => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('dataCategory');
      document.querySelectorAll('.categoryButton').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      if (selectedCategory === 'all') {
        displayWorks(data);
      } else {
        const filteredWorks = data.filter(travail => travail.category && travail.category.name === selectedCategory);
        if (filteredWorks.length === 0) {
          console.log(`Aucun travail trouvé pour la catégorie ${selectedCategory}`);
        } else {
          displayWorks(filteredWorks);
        }
      }
    });
  });
}

// Appel initial pour récupérer les catégories et les données des travaux
getCategories().then(async categories => {
  await generateCategoryMenu(categories);
  await getData();
});

//ouverture de la modal au click sur le bouton "Modifier"
const editBtn = document.querySelector(".editBtn");
const editModal = document.getElementById("editModal");
const closeBtn = editModal.querySelector(".close")

function showPopup() {
  editModal.style.display = "block";
}

function hidePopup() {
  editModal.style.display = "none";
}

editBtn.addEventListener("click", showPopup);
closeBtn.addEventListener("click", hidePopup);

window.addEventListener("click", (event) => {
  if (event.target === editModal) {
    hidePopup();
  }
});


//modal
document.querySelectorAll('.close').forEach(closeButton => {
  closeButton.addEventListener('click', function () {
    let loginModal = document.getElementById('loginModal');
    let addWorkModal = document.getElementById('addWorkModal');
    loginModal.style.display = 'none';
    addWorkModal.style.display = 'none';
  });
});

window.addEventListener('click', function (event) {
  if (event.target == document.getElementById('loginModal') || event.target == document.getElementById('addWorkModal')) {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('addWorkModal').style.display = 'none';
  }
});

/*-------------------------------------------------*/
/****EDITION MODE****/
let editionMode = false

function init() {
  if (localStorage.getItem("token")) {
    editionMode = true;
    let paramodif = document.createElement("p");
    paramodif.textContent = "Mode édition";
    paramodif.classList.add("modeEdition");
    document.getElementById("editionMode").appendChild(paramodif);
    document.getElementById("categoryFilter").style.display = "none";
    document.querySelector(".editBtn").style.display = "flex";
  }
}

init()

// login logout --- nf°p
document.addEventListener('DOMContentLoaded', function () {
  init();
  
});
function init() {
  if (localStorage.getItem("token")) {
    editionMode = true;
    let paramodif = document.createElement("p");
    paramodif.textContent = "Mode édition";
    paramodif.classList.add("modeEdition");
    document.getElementById("categoryFilter").style.display = "none";
    document.querySelector(".editBtn").style.display = "flex";
  }

}

// Vérifier si l'utilisateur est en mode édition (par exemple, s'il est connecté)
const isEditionMode = localStorage.getItem('token') !== null;

if (isEditionMode) {
  const loginItem = document.querySelector("#loginItem a");
  if (loginItem) {
    loginItem.textContent = "Logout";
    loginItem.href = "#"; // Optionnel : changer le lien
    loginItem.addEventListener('click', function (e) {
      e.preventDefault();
      // Logique de déconnexion
      localStorage.removeItem('token');
      window.location.reload();
    });
  }
};





