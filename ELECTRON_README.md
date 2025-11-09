# Guide de démarrage Electron pour Vision IA Admin

## Prérequis
- Node.js installé
- npm installé

## Installation des dépendances
```bash
npm install
```

## Démarrage de l'application

### Méthode 1 : Lancement manuel (2 terminaux)

**Terminal 1 - Démarrer Next.js :**
```bash
npm run dev
```
Attendez que Next.js démarre (vous verrez "Ready in X ms")

**Terminal 2 - Démarrer Electron :**
```bash
npm run electron
```

### Méthode 2 : Lancement automatique (recommandé)
Pour installer les dépendances nécessaires :
```bash
npm install --save-dev concurrently wait-on
```

Puis lancez :
```bash
npm run dev:electron
```
Cette commande démarre Next.js et Electron automatiquement.

## Build de production

1. **Construire l'application Next.js :**
```bash
npm run build
```

2. **Installer electron-builder (si pas encore fait) :**
```bash
npm install --save-dev electron-builder
```

3. **Builder l'application Electron :**
```bash
npm run electron:build
```

## Configuration

### electron.js
- Mode développement : charge `http://localhost:3000` (ou le port défini dans `PORT`)
- Mode production : charge le fichier `out/index.html` généré par Next.js

### next.config.ts
- Configuré pour l'export statique (`output: "export"`)
- Les images sont non-optimisées pour compatibilité avec Electron

## Problèmes courants

### Port 3000 déjà utilisé
Si Next.js démarre sur un autre port (ex: 3001), electron.js s'adaptera automatiquement si vous définissez la variable d'environnement `PORT`:
```bash
PORT=3001 npm run electron
```

### Fenêtre Electron ne s'affiche pas
- Vérifiez que Next.js est bien démarré sur le port 3000
- Regardez les logs dans la console Electron

### Erreur "Unable to acquire lock"
Une instance de Next.js tourne déjà. Tuez le processus ou utilisez un port différent.

## Structure du projet
```
vision-ia-admin/
├── electron.js          # Point d'entrée Electron
├── next.config.ts       # Configuration Next.js
├── app/                 # Application Next.js
├── out/                 # Build statique Next.js (généré)
└── package.json         # Scripts et dépendances
```
