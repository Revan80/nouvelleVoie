# Guide d'utilisation du CMS - La Nouvelle Voie

## 🎯 Accès à l'interface d'administration

Une fois le site déployé sur Netlify, votre client peut accéder à l'interface d'administration via :
**`https://votre-site.netlify.app/admin/`**

## 📝 Comment modifier le contenu

### 1. **Pages principales**
- **Page d'accueil** : Modifier le titre, sous-titre et boutons
- **Profil du Président** : Changer le nom, titre, rôle et photos
- **Éditorial** : Éditer le texte d'introduction
- **Appel à l'action** : Modifier le message d'encouragement

### 2. **Nos Valeurs**
- Ajouter, modifier ou supprimer des valeurs
- Changer les icônes (émojis) et descriptions

### 3. **Actualités**
- Publier de nouveaux articles
- Gérer les dates, auteurs et contenu
- Ajouter des images

### 4. **Nos Positions**
- **"Nous défendons"** : Modifier la liste des points de défense
- **"Nous luttons"** : Mettre à jour les points de lutte

## 🔧 Configuration technique

### Déploiement sur Netlify
1. Connecter le repository GitHub à Netlify
2. Le site se déploiera automatiquement
3. Activer l'authentification Git Gateway dans Netlify

### Authentification
- L'interface admin utilise Netlify Identity
- Votre client recevra un email d'invitation
- Il pourra se connecter avec son compte

## 📁 Structure des fichiers

```
content/
├── pages/           # Pages principales (accueil, profil, etc.)
├── valeurs/         # Fichiers des valeurs (solidarité, écologie, etc.)
└── actualites/      # Articles d'actualité
admin/
├── index.html       # Interface d'administration
└── config.yml       # Configuration des champs éditables
```

## 🎨 Personnalisation

### Ajouter de nouveaux champs
Modifier le fichier `admin/config.yml` pour :
- Ajouter de nouveaux types de contenu
- Créer des champs personnalisés
- Modifier l'interface d'administration

### Styling
- Le CSS reste dans `style.css`
- Les modifications de design se font dans le fichier CSS
- Le contenu est chargé dynamiquement via `cms-loader.js`

## 🚀 Avantages de cette solution

✅ **Gratuit** - Utilise Netlify CMS (open source)  
✅ **Simple** - Interface intuitive pour votre client  
✅ **Sécurisé** - Authentification via Netlify Identity  
✅ **Automatique** - Déploiement automatique à chaque modification  
✅ **Flexible** - Facilement extensible  
✅ **Mobile-friendly** - Interface responsive  

## 📞 Support

Si votre client rencontre des difficultés :
1. Vérifier qu'il est bien connecté à son compte Netlify
2. S'assurer que Git Gateway est activé
3. Contrôler que les fichiers sont bien sauvegardés

## 🔄 Workflow de modification

1. **Se connecter** à `/admin/`
2. **Sélectionner** le contenu à modifier
3. **Éditer** dans l'interface
4. **Sauvegarder** → Déploiement automatique
5. **Vérifier** sur le site public

Le site se met à jour automatiquement en quelques secondes !
