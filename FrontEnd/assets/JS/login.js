// Login JS Page
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const url = 'http://localhost:5678/api';
        const loginUrl = `${url}/users/login`;

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);

            // Redirection vers la page d'accueil
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erreur de connexion:', error);
            errorMessage.textContent = 'Erreur dans l\'email ou le mot de passe';
        }
    });
    
    highlightLoginLink();
});


function highlightLoginLink() {
    const loginLink = document.querySelector("#loginItem a");
    if (!loginLink) return; // Si le lien n'existe pas, arrête la fonction

    // Vérifie si l'URL actuelle correspond à la page de connexion
    if (window.location.pathname.includes("login.html")) {
        loginLink.classList.add("active-login"); // Add a class for loginItem bold style 
    } else {
        loginLink.classList.remove("active-login"); // Remove the class if we're not on the logIn page
}
}