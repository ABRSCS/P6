//WORKS
import { API } from './api.js';

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

    static addCategoryListeners(data) {
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

export { WorksDisplay };