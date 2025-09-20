#!/bin/bash

# Script de déploiement pour La Nouvelle Voie
echo "🚀 Déploiement de La Nouvelle Voie..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "index.html" ]; then
    echo "❌ Erreur: index.html non trouvé. Êtes-vous dans le bon répertoire ?"
    exit 1
fi

# Vérifier que les fichiers de contenu existent
if [ ! -d "content" ]; then
    echo "❌ Erreur: Dossier content non trouvé"
    exit 1
fi

echo "✅ Structure du projet vérifiée"

# Afficher le statut git
echo "📊 Statut Git:"
git status --short

# Ajouter tous les fichiers modifiés
echo "📝 Ajout des fichiers modifiés..."
git add .

# Créer un commit
echo "💾 Création du commit..."
git commit -m "Mise à jour du contenu via CMS - $(date '+%Y-%m-%d %H:%M:%S')"

# Pousser vers le dépôt distant
echo "🌐 Push vers le dépôt distant..."
git push origin main

echo "✅ Déploiement terminé !"
echo "🔗 Votre site sera mis à jour dans quelques minutes sur Netlify"
