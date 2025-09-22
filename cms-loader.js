// Netlify CMS Loader
// Ce fichier charge et initialise Netlify CMS

// Vérifier si nous sommes dans l'environnement d'administration
if (window.location.pathname === '/admin/' || window.location.pathname.includes('/admin/')) {
  // Charger le script Netlify CMS depuis le CDN
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/netlify-cms@^3.0.0/dist/netlify-cms.js';
  script.async = true;
  document.head.appendChild(script);
  
  // Optionnel : Ajouter des styles personnalisés
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/netlify-cms@^3.0.0/dist/cms.css';
  document.head.appendChild(link);
  
  console.log('Netlify CMS est en cours de chargement...');
} else {
  console.log('Netlify CMS ne se charge que sur la page admin');
}
