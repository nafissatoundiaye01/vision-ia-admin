# Vision IA Admin - Authorities Management System

Une application moderne de gestion des autorités développée avec Next.js 16, React 19, TypeScript et Tailwind CSS, compatible avec Electron pour une version desktop.

## 🎨 Design

L'application utilise un design moderne inspiré des meilleures pratiques UI/UX avec :
- Interface sombre élégante avec sidebar navigation
- Cartes avec ombres et transitions fluides
- Couleurs principales : Jaune/Orange pour les accents, Slate pour le fond
- Design responsive et mobile-friendly
- Composants réutilisables

## 📋 Fonctionnalités

### 🏠 Dashboard Principal
- Vue d'ensemble des vols/activités
- Recherche et filtrage avancés
- Cartes interactives avec détails
- Carte mondiale avec visualisation des routes
- Informations de prix et disponibilité

### ✈️ Gestion des Autorités (Flights)
- Liste complète des autorités enregistrées
- Système de recherche et filtrage par statut
- Création, modification et suppression d'autorités
- Vue en grille avec cartes détaillées
- Statistiques en temps réel (Total, Active, Pending, Inactive)
- Modal d'édition avec formulaire complet

### 💰 Budget & Finance (Wallet)
- Vue d'ensemble du budget total
- Suivi des dépenses par catégorie
- Graphiques de tendance mensuelle
- Liste des transactions avec filtres
- Catégories : Personnel, Equipment, Operations, Training, Maintenance

### 📊 Statistiques
- Dashboard analytique complet
- Cartes de statistiques clés
- Graphiques de tendance mensuelle
- Distribution des cas par catégorie
- Activités récentes avec statuts
- Export de rapports

### 📄 Rapports
- Génération de rapports personnalisés
- Templates prédéfinis :
  - Rapport d'activité
  - Rapport financier
  - Rapport d'incident
  - Rapport de performance
- Filtrage par type de rapport
- Téléchargement et visualisation
- Statuts de génération en temps réel

### ⚙️ Paramètres
- Configuration du profil utilisateur
- Préférences de notifications (Email, Push, SMS)
- Paramètres système
- Sécurité et changement de mot de passe
- Actions rapides et support

## 🚀 Installation

### Prérequis
- Node.js 18+ installé
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

## 💻 Développement

### Mode développement web
```bash
npm run dev
```
Ouvre [http://localhost:3000](http://localhost:3000) dans le navigateur.

### Mode Electron (Desktop)

**Option 1 : Manuel (2 terminaux)**

Terminal 1 - Next.js :
```bash
npm run dev
```

Terminal 2 - Electron :
```bash
npm run electron
```

## 📦 Build Production

### Build Web
```bash
npm run build
```

### Build Electron Desktop
```bash
npm run electron:build
```

## 🗂️ Structure du Projet

```
vision-ia-admin/
├── app/
│   ├── authorities/           # Module autorités
│   │   ├── page.tsx          # Dashboard principal
│   │   ├── layout.tsx        # Layout avec sidebar
│   │   ├── flights/          # Gestion des autorités
│   │   ├── wallet/           # Budget & Finance
│   │   ├── statistics/       # Statistiques
│   │   ├── reports/          # Rapports
│   │   └── settings/         # Paramètres
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.tsx   # Navigation sidebar
│   │   └── ui/
│   │       └── SearchBar.tsx # Barre de recherche
│   ├── layout.tsx            # Layout racine
│   ├── page.tsx              # Page d'accueil (redirect)
│   └── globals.css           # Styles globaux
├── electron.js               # Configuration Electron
├── next.config.ts            # Configuration Next.js
└── package.json              # Dépendances
```

## 🎨 Composants Principaux

### Sidebar
- Navigation avec icônes
- Profil utilisateur
- Utilisateurs actifs
- Carte mondiale interactive

### Cartes (Cards)
- Design modulaire et réutilisable
- Ombres et effets hover
- Badges de statut colorés
- Actions contextuelles

### Formulaires
- Inputs stylisés avec focus ring
- Selects personnalisés
- Validation visuelle
- Boutons avec gradients

## 🌈 Palette de Couleurs

- **Principal** : Slate 700-800 (Navigation, Headers)
- **Accent** : Yellow 400-500 (Boutons, Highlights)
- **Success** : Green 500-600
- **Warning** : Yellow 500-600
- **Danger** : Red 500-600
- **Info** : Blue 500-600
- **Fond** : Slate 50 avec gradient vers Blue 50

## 🛠️ Technologies

- **Frontend** : Next.js 16, React 19, TypeScript
- **Styling** : Tailwind CSS 4
- **Desktop** : Electron 26
- **Build** : Turbopack (Next.js)

## 📝 Scripts Disponibles

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "electron": "cross-env ELECTRON_DEV=true electron electron.js"
}
```

---

**Note** : Cette application est basée sur les spécifications techniques Vision IA et utilise un design moderne inspiré des meilleures pratiques de l'industrie.
"# vision-ia-admin" 
