import { API, APIService } from './api.js';
import { WorksDisplay } from './works.js';
import { deleteWork } from './app.js';

function loadImagesInModal(data) {
    const photosList = document.getElementById('photosList');
    photosList.innerHTML = '';

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

async function setupModalListeners(data) {
    // Variables pour la modale visuel 1 galerie photos
    const editBtn = document.querySelector(".editBtn");
    const galleryModal = document.getElementById("galleryModal");
    const closeBtn = document.querySelector(".close");
    const backToGallery = document.getElementById("backToGallery")
    const addPhotoBtn = document.getElementById("addPhotoBtn");
    const addPhotoForm = document.getElementById("addPhotoForm");
    const workDisplay = document.getElementById("workDisplay");

    //Variables pour la modale visuel 2 et 3 ajout photo
    const photoInput = document.getElementById('photoInput');
    const uploadForm = document.getElementById('uploadForm');
    const projectTitle = document.getElementById('projectTitle');
    const projectCategory = document.getElementById('projectCategory');
    const submitButton = document.getElementById('submitButton');
    const rectangle = document.querySelector('.rectangle');
    const icon = document.querySelector('.rectangle i');
    const label = document.querySelector('.rectangle label');
    const paragraph = document.querySelector('.rectangle p');
    const preview = document.getElementById('preview');

    // Gestion des événements pour ouvrir/fermer la modale
    editBtn.addEventListener("click", () => galleryModal.style.display = "block");
    loadImagesInModal(data);
    closeBtn.addEventListener("click", () => galleryModal.style.display = "none");
    backToGallery.addEventListener("click", () => {
        workDisplay.style.display = "block";
        addPhotoForm.style.display = "none";
    });
    addPhotoBtn.addEventListener("click", () => {
        workDisplay.style.display = "none";
        addPhotoForm.style.display = "block";
    });

    editBtn.addEventListener("click", () => {
        galleryModal.style.display = "block";
        loadImagesInModal(data);
    });

    window.addEventListener("click", (event) => {
        if (event.target === galleryModal) {
            galleryModal.style.display = "none";
        }
    });

    // Fonction pour vérifier la validité du formulaire
    function checkFormValidity() {
        const isPhotoUploaded = rectangle.querySelector('img') !== null; // Vérifie si une image est présente
        const isTitleFilled = projectTitle.value.trim() !== '';
        const isCategorySelected = projectCategory.value !== '';

        if (isPhotoUploaded && isTitleFilled && isCategorySelected) {
            submitButton.removeAttribute('disabled'); // Active le bouton
            submitButton.style.backgroundColor = '#1D6154'; // Vert
            submitButton.style.cursor = 'pointer';
        } else {
            submitButton.setAttribute('disabled', 'true'); // Désactive le bouton
            submitButton.style.backgroundColor = '#cccccc'; // Gris
            submitButton.style.cursor = 'not-allowed';
        }
    }
    // Gestion de la prévisualisation de l'image et validation du formulaire
    photoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Cacher l'icone, le label et le paragraphe
                icon.style.display = 'none';
                label.style.display = 'none';
                paragraph.style.display = 'none';

                // Afficher la prévisualisation
                rectangle.innerHTML = `<img src="${e.target.result}" style="height: 100%; object-fit: cover;">`;
                checkFormValidity();
            }
            reader.readAsDataURL(file);
        } else {
            // Si aucun fichier n'est sélectionné, réinitialiser l'affichage
            icon.style.display = 'block';
            label.style.display = 'block';
            paragraph.style.display = 'block';
            rectangle.innerHTML = `<i class="fa-regular fa-image"></i>
                                   <label for="photoInput">+ Ajouter photo</label>
                                   <input type="file" id="photoInput" accept="image/*" style="display: none;">
                                   <p>jpg, png : 4mo max</p>`;
            checkFormValidity();
        }
    });
    // Gestion des événements pour vérifier la validité du formulaire

    projectTitle.addEventListener('input', checkFormValidity);
    projectCategory.addEventListener('change', checkFormValidity);
    // Récupérer les catégories depuis l'API
    try {
        const categories = await APIService.getData(API.ENDPOINTS.CATEGORIES);
        // Ajouter les options au menu déroulant
        projectCategory.innerHTML = ''; // Vider les options existantes
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            projectCategory.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Aucune catégorie disponible';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        projectCategory.appendChild(defaultOption);
    }
    // Validation initiale du formulaire pour configurer l'état initial du bouton
    checkFormValidity();
    // Gestion du formulaire d'ajout de photo
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', photoInput.files[0]);
        formData.append('title', projectTitle.value);
        formData.append('category', projectCategory.value);

        // Debug : Vérifiez le contenu du FormData
        console.log('Contenu du FormData :');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API.getFullUrl(API.ENDPOINTS.WORKS), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error(`Erreur HTTP : ${response.status}`, errorDetails);
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            // Mettre à jour la liste des travaux après ajout
            const newWork = await response.json();
            data = await APIService.getData(API.ENDPOINTS.WORKS);

            WorksDisplay.displayWorks(data);
            loadImagesInModal(data);

            // Réinitialiser le formulaire et fermer la modale
            uploadForm.reset();
            rectangle.innerHTML = `<i class="fa-regular fa-image"></i>
                                   <label for="photoInput">+ Ajouter photo</label>
                                   <input type="file" id="photoInput" accept="image/*" style="display: none;">
                                   <p>jpg, png : 4mo max</p>`;
            galleryModal.style.display = "none";
            checkFormValidity()
        } catch (error) {
            console.error("Erreur lors de l'ajout du travail :", error);
        }
    });
}

export { loadImagesInModal, setupModalListeners };
