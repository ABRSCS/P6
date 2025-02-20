// APP
import { API, APIService } from './api.js';
import { WorksDisplay } from './works.js';
import { loadImagesInModal, setupModalListeners } from './modal.js';
import { checkAuthStatus, setupLogout } from './auth.js';
import { createContactForm } from './contact.js';

// Variables globales
let data = []; // Données des travaux
let categories = []; // Catégories

async function init() {

    try {
        categories = await APIService.getData(API.ENDPOINTS.CATEGORIES);
        WorksDisplay.generateCategoryMenu(categories);
        data = await APIService.getData(API.ENDPOINTS.WORKS);
        WorksDisplay.displayWorks(data);
        WorksDisplay.addCategoryListeners(data);
        document.querySelector('main').appendChild(createContactForm());
        setupModalListeners(data);
        checkAuthStatus();

    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
    }
}

async function deleteWork(workId) {
    const token = localStorage.getItem("token");
    console.log("Token utilisé pour la suppression:", token); // Check if the token is present 

    // Token check
    if (!token) {
        console.error("Token non trouvé");
        return;
    }

    const fullUrl = API.getFullUrl(`${API.ENDPOINTS.WORKS}/${workId}`);
    console.log("URL de suppression:", fullUrl);
    console.log("Token utilisé pour la suppression:", token);
    console.log("Token récupéré :", token);

    try {
        const response = await APIService.deleteData(`${API.ENDPOINTS.WORKS}/${workId}`, token);
        console.log("Réponse de suppression:", response);
        const responseBody = await response.text();
        console.log("Corps de la réponse:", responseBody);

        if (response.status === 204) {
            console.log("Suppression réussie");
        }
// Recharger les données depuis le serveur
data = await APIService.getData(API.ENDPOINTS.WORKS);
// Supprimer localement et mettre à jour
data = data.filter(work => work.id !== workId);
WorksDisplay.displayWorks(data);
loadImagesInModal(data);

        if (!response.ok) {
            if (response.status === 401) {
                alert("Votre session a expiré. Veuillez vous reconnecter");
                localStorage.removeItem("token"); // SUppression du token expiré
                window.location.href = "login.html"; // Redirection vers la page de connexion
            }
            throw new Error(`Erreur HTTP : ${response.status}`);
        

        

    } else {
        throw new Error(`Erreur HTTP inattendue : ${response.status}`);
    }
} catch (error) {
    console.error("Erreur détaillée lors de la suppression du travail :", error);
    if (error.message.includes('401')) {
        // Gérer l'erreur d'authentification (par exemple, rediriger vers la page de connexion)
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        // Rediriger vers la page de connexion ou rafraîchir le token
    }
}
}

// Lancement de l'application
document.addEventListener('DOMContentLoaded', () => {
    init();
    checkAuthStatus();
});




export { deleteWork };
