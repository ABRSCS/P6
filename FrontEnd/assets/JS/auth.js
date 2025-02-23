// AUTH

function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const editionModeElement = document.getElementById("editionMode");
    const categoryFilterElement = document.getElementById("categoryFilter");
    const editBtnElement = document.querySelector(".editBtn");
    

    if (token) {
        editionModeElement.innerHTML = `<i class="fa-solid fa-pen-to-square"></i><p class='editionMode'>Mode édition</p>`;
        editionModeElement.style.display = "flex";
        categoryFilterElement.classList.add("hidden");
        editBtnElement.style.display = "flex";
        setupLogout();
    } else {
        editionModeElement.innerHTML = "";
        editionModeElement.style.display = "none";
        categoryFilterElement.classList.remove("hidden");
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


// Appelle highlightLoginLink lors du chargement initial et à chaque vérification d'authentification
document.addEventListener("DOMContentLoaded", () => {
    highlightLoginLink();
    checkAuthStatus();
});

export {checkAuthStatus, setupLogout};