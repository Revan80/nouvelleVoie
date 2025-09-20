/**
 * CMS Simple - Chargement du contenu depuis localStorage
 */

class SimpleCMS {
    constructor() {
        this.init();
    }

    init() {
        this.updatePage();
    }

    updatePage() {
        // Mettre à jour la section hero
        const heroTitle = localStorage.getItem('hero-title');
        const heroSubtitle = localStorage.getItem('hero-subtitle');
        
        if (heroTitle) {
            this.updateElement('.hero-title', heroTitle);
        }
        if (heroSubtitle) {
            this.updateElement('.hero-subtitle', heroSubtitle);
        }

        // Mettre à jour le profil
        const profileName = localStorage.getItem('profile-name');
        const profileTitle = localStorage.getItem('profile-title');
        const profileRole = localStorage.getItem('profile-role');
        
        if (profileName) {
            this.updateElement('.profile-name', profileName);
        }
        if (profileTitle) {
            this.updateElement('.profile-title', profileTitle);
        }
        if (profileRole) {
            this.updateElement('.profile-role', profileRole);
        }

        // Mettre à jour l'éditorial
        const editorialContent = localStorage.getItem('editorial-content');
        if (editorialContent) {
            this.updateElement('.editorial-content', editorialContent.replace(/\n/g, '<br>'));
        }

        // Mettre à jour les actualités
        this.updateNews();
    }

    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element && content) {
            element.innerHTML = content;
        }
    }

    updateNews() {
        const newsList = JSON.parse(localStorage.getItem('news-list') || '[]');
        if (newsList.length > 0) {
            // Créer une section actualités si elle n'existe pas
            let newsSection = document.querySelector('.news-section');
            if (!newsSection) {
                newsSection = document.createElement('section');
                newsSection.className = 'news-section';
                newsSection.innerHTML = '<h2>Actualités</h2><div class="news-list"></div>';
                
                // Insérer avant la section d'adhésion
                const adhesionSection = document.querySelector('#adhesion');
                if (adhesionSection) {
                    adhesionSection.parentNode.insertBefore(newsSection, adhesionSection);
                }
            }
            
            const newsListElement = newsSection.querySelector('.news-list');
            newsListElement.innerHTML = newsList.map(news => `
                <div class="news-item" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                    <h3 style="color: #2c3e50; margin-top: 0;">${news.title}</h3>
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">${new Date(news.date).toLocaleDateString('fr-FR')}</p>
                    <p style="line-height: 1.6;">${news.content.replace(/\n/g, '<br>')}</p>
                </div>
            `).join('');
        }
    }
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.simpleCMS = new SimpleCMS();
});
