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
    console.error(`Problème avec Fetch : ${error.message}`);
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

/* MODALE */
//ouverture de la modale au click sur le bouton "Modifier"
const galleryModal = document.getElementById("galleryModal")
const close = document.querySelector(".close")


edit.addEventListener("click", () => {
  galleryModal.style.display = "block";
});
async function openGalleryModal() {
  galleryModal.style.display = "block";
  const photos = await getData();
  fetchAndDisplayPhotos()
}
const editBtn = document.querySelector(".editBtn");
editBtn.addEventListener("click", openGalleryModal);
// Fermeture de la modale au click sur la croix et sur l'overlay
close.addEventListener("click", () => {
  galleryModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === galleryModal) {
    galleryModal.style.display = "none";
  }
});


//afficher la modale "ajout photo"
const addPhotoBtn = document.getElementById("addPhotoBtn");
const addPhotoForm = document.getElementById("addPhotoForm");
const workDisplay = document.getElementById("workDisplay");

addPhotoBtn.addEventListener("click", appearAddPhotoForm); 

async function appearAddPhotoForm() {
  workDisplay.style.display = "none";
  addPhotoForm.style.display = "block";
  
}


// Ajouter des écouteurs d'événements pour les boutons de suppression
async function deleteWork(workId, element) {

  const response = await fetch("http://localhost:5678/api/works/" + workId, {
    method: "DELETE",
    headers:{
      Authorization:"Bearer " + localStorage.getItem('token')
    }
  });
element.remove()

}


// Fonction pour récupérer et afficher les photos
async function fetchAndDisplayPhotos() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const photos = await response.json();

    photosList.innerHTML = '';
    photos.forEach(async(photo) => {
      const photoElement = document.createElement('figure');
      const image = document.createElement('img');
      image.src = photo.imageUrl
      image.alt = photo.title
      photoElement.appendChild(image)
      const trashIcon = document.createElement('i');
      trashIcon.classList.add("fa-regular", "fa-trash-can", "trashIcon");
      photoElement.appendChild(trashIcon)
      

      photosList.appendChild(photoElement);
      trashIcon.addEventListener('click', async () => {
        await deleteWork(photo.id,photoElement)
      })
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
  }
}

//modal close
document.querySelectorAll('.close').forEach(closeButton => {
  closeButton.addEventListener('click', function () {
    let loginItem = document.getElementById('loginItem');
    let galleryModal = document.getElementById('galleryModal');
    loginItem.style.display = 'none';
    galleryModal.style.display = 'none';


    // Réinitialiser l'affichage des sections internes de la modale
    document.getElementById('workDisplay').style.display = 'block';
    document.getElementById('addPhotoForm').style.display = 'none';
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




// login logout 
document.addEventListener('DOMContentLoaded', function () {
  init();

});
function init() {
  if (localStorage.getItem("token")) {
    editionMode = true;
    let paramodif = document.createElement("p");
    paramodif.textContent = "Mode édition";
    paramodif.classList.add("editionMode");
    document.getElementById("editionMode").appendChild(paramodif);
    document.getElementById("categoryFilter").style.display = "none";
    document.querySelector(".editBtn").style.display = "flex";
  }

}

// Vérifier si l'utilisateur est en mode édition (par exemple, s'il est connecté)
const isEditionMode = localStorage.getItem('token') !== null;

if (isEditionMode) {
  const loginModal = document.querySelector("#loginItem a");
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