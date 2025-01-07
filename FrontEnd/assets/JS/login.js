//Login JS Page
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const url = 'http://localhost:5678/api'; //  l'URL de votre API
    const loginUrl = `${url}/users/login`; // URL pour la connexion
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');


    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const responseData = await response.json();
        token = responseData.token; // Stocker le token d'authentification
        localStorage.setItem('token', token); // Stocker le token dans le localStorage


        // Redirection vers la page d'accueil
        window.location.href = 'index.html';
    } catch (error) {
        errorMessage.textContent = 'Erreur dans l\'email ou le mot de passe';
    }
});

