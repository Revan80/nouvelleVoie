// Script pour charger les paramètres du site depuis le CMS
class SiteConfig {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  async loadConfig() {
    try {
      // Charger les paramètres depuis le fichier YAML
      const response = await fetch('/data/settings/general.yml');
      const yamlText = await response.text();
      
      // Parser le YAML simple (format clé: valeur)
      this.config = this.parseSimpleYAML(yamlText);
      
      // Appliquer les paramètres au site
      this.applySiteConfig();
      
      console.log('Configuration du site chargée:', this.config);
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      // Utiliser les valeurs par défaut
      this.config = {
        site_title: 'La Nouvelle Voie',
        site_subtitle: 'Ensemble, construisons l\'avenir de notre société',
        site_description: 'Site officiel de La Nouvelle Voie',
        contact_email: 'contact@lanouvellevoie.fr'
      };
      this.applySiteConfig();
    }
  }

  parseSimpleYAML(yamlText) {
    const config = {};
    const lines = yamlText.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split(':');
        if (key && valueParts.length > 0) {
          let value = valueParts.join(':').trim();
          // Retirer les guillemets si présents
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          config[key.trim()] = value;
        }
      }
    }
    
    return config;
  }

  applySiteConfig() {
    if (!this.config) return;

    // Mettre à jour le titre de la page
    document.title = this.config.site_title || 'La Nouvelle Voie';

    // Mettre à jour le titre dans le header
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
      logoText.textContent = this.config.site_title || 'La Nouvelle Voie';
    }

    // Mettre à jour le titre dans le hero
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.textContent = this.config.site_title || 'La Nouvelle Voie';
    }

    // Mettre à jour le sous-titre dans le hero
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      heroSubtitle.textContent = this.config.site_subtitle || 'Ensemble, construisons l\'avenir de notre société';
    }

    // Mettre à jour le titre dans le footer
    const footerLogo = document.querySelector('.footer-logo span');
    if (footerLogo) {
      footerLogo.textContent = this.config.site_title || 'La Nouvelle Voie';
    }

    // Mettre à jour la meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = this.config.site_description || 'Site officiel de La Nouvelle Voie';
  }

  // Méthode pour obtenir une valeur de configuration
  get(key) {
    return this.config ? this.config[key] : null;
  }
}

// Initialiser la configuration du site
window.siteConfig = new SiteConfig();
