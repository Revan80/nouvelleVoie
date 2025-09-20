/**
 * CMS Content Loader pour La Nouvelle Voie
 * Charge le contenu depuis les fichiers Markdown
 */

class CMSLoader {
    constructor() {
        this.content = {};
        this.init();
    }

    async init() {
        try {
            await this.loadContent();
            this.updatePage();
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
        }
    }

    async loadContent() {
        // Charger tous les fichiers de contenu
        const files = [
            'content/pages/accueil.md',
            'content/pages/profil.md',
            'content/pages/editorial.md',
            'content/pages/defendons.md',
            'content/pages/luttons.md',
            'content/pages/cta.md'
        ];

        for (const file of files) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const text = await response.text();
                    const content = this.parseMarkdown(text);
                    const filename = file.split('/').pop().replace('.md', '');
                    this.content[filename] = content;
                }
            } catch (error) {
                console.warn(`Impossible de charger ${file}:`, error);
            }
        }

        // Charger les valeurs
        await this.loadValues();
        
        // Charger les actualités
        await this.loadActualites();
    }

    async loadValues() {
        try {
            const response = await fetch('content/valeurs/');
            if (response.ok) {
                const text = await response.text();
                // Parser la réponse pour obtenir la liste des fichiers
                const files = text.match(/href="([^"]*\.md)"/g);
                if (files) {
                    this.content.valeurs = [];
                    for (const fileMatch of files) {
                        const filename = fileMatch.match(/href="([^"]*)"/)[1];
                        const fileResponse = await fetch(`content/valeurs/${filename}`);
                        if (fileResponse.ok) {
                            const content = this.parseMarkdown(await fileResponse.text());
                            this.content.valeurs.push(content);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Impossible de charger les valeurs:', error);
        }
    }

    async loadActualites() {
        try {
            // Charger les actualités depuis GitHub API
            const response = await fetch('https://api.github.com/repos/Revan80/nouvelleVoie/contents/content/actualites');
            if (response.ok) {
                const files = await response.json();
                this.content.actualites = [];
                for (const file of files) {
                    if (file.name.endsWith('.md')) {
                        const fileResponse = await fetch(file.download_url);
                        if (fileResponse.ok) {
                            const content = this.parseMarkdown(await fileResponse.text());
                            this.content.actualites.push(content);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Impossible de charger les actualités:', error);
        }
    }

    parseMarkdown(text) {
        const lines = text.split('\n');
        const content = {};
        let inFrontmatter = false;
        let frontmatter = '';

        // Parser le frontmatter YAML
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line === '---' && i === 0) {
                inFrontmatter = true;
                continue;
            }
            
            if (line === '---' && inFrontmatter) {
                inFrontmatter = false;
                continue;
            }
            
            if (inFrontmatter) {
                frontmatter += line + '\n';
            }
        }

        // Parser le YAML simple
        if (frontmatter) {
            const yamlLines = frontmatter.split('\n');
            for (const line of yamlLines) {
                if (line.includes(':')) {
                    const [key, ...valueParts] = line.split(':');
                    const value = valueParts.join(':').trim();
                    
                    if (value.startsWith('"') && value.endsWith('"')) {
                        content[key.trim()] = value.slice(1, -1);
                    } else if (value.startsWith('|')) {
                        // Gérer le format YAML multiline
                        content[key.trim()] = value.slice(1).trim();
                    } else {
                        content[key.trim()] = value;
                    }
                }
            }
        }

        // Ajouter le contenu markdown s'il y en a
        const contentStart = text.indexOf('---', text.indexOf('---') + 3) + 3;
        if (contentStart > 2) {
            content.body = text.substring(contentStart).trim();
        }

        return content;
    }

    updatePage() {
        // Mettre à jour la section hero
        if (this.content.accueil) {
            const accueil = this.content.accueil;
            this.updateElement('.hero-title', accueil.titre);
            this.updateElement('.hero-subtitle', accueil.sous_titre);
            this.updateElement('.btn-primary', accueil.bouton_principal);
            this.updateElement('.btn-secondary', accueil.bouton_secondaire);
        }

        // Mettre à jour le profil
        if (this.content.profil) {
            const profil = this.content.profil;
            this.updateElement('.profile-name', profil.nom);
            this.updateElement('.profile-title', profil.titre);
            this.updateElement('.profile-role', profil.role);
            
            if (profil.photo) {
                this.updateImage('.profile-photo', profil.photo);
            }
            if (profil.signature) {
                this.updateImage('.profile-signature', profil.signature);
            }
        }

        // Mettre à jour les valeurs
        if (this.content.valeurs && Array.isArray(this.content.valeurs)) {
            this.updateValues();
        }

        // Mettre à jour l'éditorial
        if (this.content.editorial) {
            this.updateElement('.editorial-content', this.content.editorial.contenu || this.content.editorial.body);
        }

        // Mettre à jour les positions
        if (this.content.defendons) {
            this.updateList('.defend-list', this.content.defendons.points);
        }

        if (this.content.luttons) {
            this.updateList('.fight-list', this.content.luttons.points);
        }

        // Mettre à jour l'appel à l'action
        if (this.content.cta) {
            this.updateElement('.cta-box p', this.content.cta.message);
        }
    }

    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element && content) {
            element.innerHTML = content;
        }
    }

    updateImage(selector, src) {
        const element = document.querySelector(selector);
        if (element && src) {
            if (element.tagName === 'IMG') {
                element.src = src;
            } else {
                element.innerHTML = `<img src="${src}" alt="" style="max-width: 100%; height: auto;">`;
            }
        }
    }

    updateList(selector, items) {
        const element = document.querySelector(selector);
        if (element && Array.isArray(items)) {
            element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }
    }

    updateValues() {
        const valuesGrid = document.querySelector('.values-grid');
        if (valuesGrid && this.content.valeurs) {
            valuesGrid.innerHTML = this.content.valeurs.map(value => `
                <div class="value-card">
                    <div class="value-icon">${value.icone || '📋'}</div>
                    <h3>${value.titre || 'Valeur'}</h3>
                    <p>${value.description || ''}</p>
                </div>
            `).join('');
        }
    }

    // Méthode pour ajouter une nouvelle actualité
    async addActualite(actualite) {
        // Cette méthode sera utilisée par l'interface d'administration
        console.log('Nouvelle actualité:', actualite);
    }

    // Méthode pour obtenir le contenu actuel
    getContent() {
        return this.content;
    }
}

// Initialiser le loader quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.cmsLoader = new CMSLoader();
});

// Exporter pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CMSLoader;
}
