// Script pour charger le contenu depuis les fichiers Markdown
class ContentLoader {
    constructor() {
        this.contentCache = new Map();
    }

    // Fonction pour parser le frontmatter YAML
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (match) {
            const frontmatter = match[1];
            const body = match[2];
            const data = {};
            
            // Parse simple du YAML (pour les cas basiques)
            frontmatter.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    data[key] = value;
                }
            });
            
            return { data, body };
        }
        
        return { data: {}, body: content };
    }

    // Charger un fichier de contenu
    async loadContent(filePath) {
        // Ajouter un timestamp pour éviter le cache
        const cacheBuster = `?t=${Date.now()}&v=${Math.random()}`;
        const fullPath = filePath + cacheBuster;
        
        // Ne pas utiliser le cache pour les fichiers de contenu
        try {
            const response = await fetch(fullPath, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Erreur de chargement: ${response.status}`);
            }
            
            const content = await response.text();
            const parsed = this.parseFrontmatter(content);
            
            console.log(`Contenu chargé depuis ${filePath}:`, parsed.data);
            return parsed;
        } catch (error) {
            console.error(`Erreur lors du chargement de ${filePath}:`, error);
            return { data: {}, body: '' };
        }
    }

    // Charger le contenu de la page d'accueil
    async loadAccueilContent() {
        return await this.loadContent('content/pages/accueil.md');
    }

    // Charger le contenu du profil
    async loadProfilContent() {
        return await this.loadContent('content/pages/profil.md');
    }

    // Charger le contenu éditorial
    async loadEditorialContent() {
        return await this.loadContent('content/pages/editorial.md');
    }

    // Charger le contenu des valeurs
    async loadValeursContent() {
        const valeurs = [];
        const valeurFiles = [
            'content/valeurs/solidarite.md',
            'content/valeurs/ecologie.md',
            'content/valeurs/justice.md',
            'content/valeurs/securite.md',
            'content/valeurs/education.md',
            'content/valeurs/travail.md'
        ];

        for (const file of valeurFiles) {
            try {
                const content = await this.loadContent(file);
                if (content.data.titre) {
                    valeurs.push(content.data);
                }
            } catch (error) {
                console.warn(`Impossible de charger ${file}:`, error);
            }
        }

        return valeurs;
    }

    // Charger les actualités
    async loadActualitesContent() {
        try {
            // Pour les actualités, on va chercher tous les fichiers dans le dossier
            const response = await fetch('content/actualites/');
            if (!response.ok) {
                // Si on ne peut pas lister le dossier, on essaie les fichiers connus
                const knownFiles = [
                    'content/actualites/premiere-actualite.md'
                ];
                
                const actualites = [];
                for (const file of knownFiles) {
                    try {
                        const content = await this.loadContent(file);
                        if (content.data.titre) {
                            actualites.push(content.data);
                        }
                    } catch (error) {
                        console.warn(`Impossible de charger ${file}:`, error);
                    }
                }
                return actualites;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des actualités:', error);
            return [];
        }
    }

    // Mettre à jour le contenu de la page d'accueil
    async updateAccueilContent() {
        const accueilData = await this.loadAccueilContent();
        
        // Mettre à jour le titre principal
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && accueilData.data.titre) {
            heroTitle.textContent = accueilData.data.titre;
        }

        // Mettre à jour le sous-titre
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && accueilData.data.sous_titre) {
            heroSubtitle.textContent = accueilData.data.sous_titre;
        }

        // Mettre à jour le bouton principal
        const primaryButton = document.querySelector('.hero-buttons .btn-primary');
        if (primaryButton && accueilData.data.bouton_principal) {
            primaryButton.textContent = accueilData.data.bouton_principal;
        }

        // Mettre à jour le bouton secondaire
        const secondaryButton = document.querySelector('.hero-buttons .btn-secondary');
        if (secondaryButton && accueilData.data.bouton_secondaire) {
            secondaryButton.textContent = accueilData.data.bouton_secondaire;
        }

        // Mettre à jour le titre de la page
        if (accueilData.data.titre) {
            document.title = `${accueilData.data.titre} - ${accueilData.data.sous_titre || 'La Nouvelle Voie'}`;
        }
    }

    // Mettre à jour le contenu du profil
    async updateProfilContent() {
        const profilData = await this.loadProfilContent();
        
        if (profilData.data.nom) {
            const profileName = document.querySelector('.profile-name');
            if (profileName) profileName.textContent = profilData.data.nom;
        }

        if (profilData.data.titre) {
            const profileTitle = document.querySelector('.profile-title');
            if (profileTitle) profileTitle.textContent = profilData.data.titre;
        }

        if (profilData.data.role) {
            const profileRole = document.querySelector('.profile-role');
            if (profileRole) profileRole.textContent = profilData.data.role;
        }

        // Gérer l'image de profil si elle existe
        if (profilData.data.photo) {
            const profilePhoto = document.querySelector('.profile-photo');
            if (profilePhoto) {
                profilePhoto.innerHTML = `<img src="${profilData.data.photo}" alt="Photo de profil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
        }
    }

    // Mettre à jour le contenu éditorial
    async updateEditorialContent() {
        const editorialData = await this.loadEditorialContent();
        
        if (editorialData.body) {
            const editorialContent = document.querySelector('.editorial-content');
            if (editorialContent) {
                // Convertir le markdown basique en HTML (version simplifiée)
                let html = editorialData.body
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br>');
                
                if (!html.startsWith('<p>')) {
                    html = '<p>' + html;
                }
                if (!html.endsWith('</p>')) {
                    html = html + '</p>';
                }
                
                editorialContent.innerHTML = html;
            }
        }
    }

    // Mettre à jour les valeurs
    async updateValeursContent() {
        const valeursData = await this.loadValeursContent();
        
        if (valeursData.length > 0) {
            const valuesGrid = document.querySelector('.values-grid');
            if (valuesGrid) {
                valuesGrid.innerHTML = '';
                
                valeursData.forEach(valeur => {
                    const valueCard = document.createElement('div');
                    valueCard.className = 'value-card';
                    
                    const icon = valeur.icone || '📋';
                    const titre = valeur.titre || 'Valeur';
                    const description = valeur.description || '';
                    
                    valueCard.innerHTML = `
                        <div class="value-icon">${icon}</div>
                        <h3>${titre}</h3>
                        <p>${description}</p>
                    `;
                    
                    valuesGrid.appendChild(valueCard);
                });
            }
        }
    }

    // Recharger le contenu périodiquement
    startAutoReload() {
        // Recharger toutes les 10 secondes pour un test plus rapide
        setInterval(async () => {
            try {
                console.log('🔄 Rechargement automatique du contenu...');
                await this.updateAccueilContent();
                console.log('✅ Contenu rechargé automatiquement');
            } catch (error) {
                console.warn('⚠️ Erreur lors du rechargement automatique:', error);
            }
        }, 10000);
    }

    // Initialiser le chargement de tout le contenu
    async init() {
        try {
            await Promise.all([
                this.updateAccueilContent(),
                this.updateProfilContent(),
                this.updateEditorialContent(),
                this.updateValeursContent()
            ]);
            
            console.log('Contenu chargé avec succès depuis le CMS');
            
            // Démarrer le rechargement automatique
            this.startAutoReload();
            
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
        }
    }
}

// Initialiser le chargeur de contenu
document.addEventListener('DOMContentLoaded', function() {
    const contentLoader = new ContentLoader();
    contentLoader.init();
});
