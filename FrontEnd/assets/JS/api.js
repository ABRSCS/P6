//API

const API = {
    BASE_URL: 'http://localhost:5678/api',
    ENDPOINTS: {
        WORKS: '/works',
        CATEGORIES: '/categories',
        LOGIN: '/users/login'
    },
    getFullUrl: function (endpoint) {
        return `${this.BASE_URL}${endpoint}`;
    }
};

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
        if (!token) {
            throw new Error('Token is required for delete operations')
        }
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
            return response;
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
            console.log("Réponse brute de deleteData:", response);
            return response;
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Problème avec Fetch : ${error.message}`);
            throw error;
        }
    }
}


export { API, APIService };
export async function getCategories() {
    try {
        const response = await fetch(API.getFullUrl(API.ENDPOINTS.CATEGORIES));
        if (!response.ok) {
            throw new Error(`Erreur API : ${response.status}`);
        }
        const categories = await response.json();
        return categories;  // Retourner les catégories récupérées
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return [];  // Retourner un tableau vide en cas d'erreur
    }
}
