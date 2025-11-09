# 🚀 Guide de Démarrage Rapide - Vision IA Admin

## Installation Initiale

### 1. Vérifier les prérequis
```bash
# Vérifier Node.js (version 18 ou supérieure)
node --version

# Vérifier npm
npm --version
```

### 2. Installer les dépendances
```bash
npm install
```

---

## 🌐 Lancement Version Web

### Option Simple
```bash
npm run dev
```

Puis ouvrez votre navigateur sur : **http://localhost:3000**

L'application redirigera automatiquement vers `/authorities` (Dashboard principal).

---

## 💻 Lancement Version Desktop (Electron)

### Option 1 : Lancement Manuel (Recommandé pour le développement)

**Terminal 1** - Démarrer Next.js :
```bash
npm run dev
```
Attendez le message : `✓ Ready in X ms`

**Terminal 2** - Démarrer Electron :
```bash
npm run electron
```

Une fenêtre desktop s'ouvrira automatiquement.

### Option 2 : Vérification Rapide

Si Next.js tourne déjà sur le port 3000, lancez directement :
```bash
npm run electron
```

---

## 📄 Pages Disponibles

Une fois l'application lancée, vous pouvez naviguer vers :

### Via la Sidebar :
- 🏠 **Dashboard** - `/authorities` - Vue d'ensemble des activités
- ✈️ **Flights** - `/authorities/flights` - Gestion des autorités (CRUD complet)
- 💰 **Wallet** - `/authorities/wallet` - Budget et finances
- 📊 **Reports** - `/authorities/reports` - Génération de rapports
- 📈 **Statistics** - `/authorities/statistics` - Tableaux de bord analytiques
- ⚙️ **Settings** - `/authorities/settings` - Paramètres et configuration

### Ou directement dans le navigateur :
```
http://localhost:3000/authorities
http://localhost:3000/authorities/flights
http://localhost:3000/authorities/wallet
http://localhost:3000/authorities/statistics
http://localhost:3000/authorities/reports
http://localhost:3000/authorities/settings
```

---

## 🛠️ Résolution de Problèmes

### Problème : Port 3000 déjà utilisé

**Symptôme** :
```
⚠ Port 3000 is in use by process XXXXX
```

**Solutions** :

**Option A** - Arrêter le processus existant :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Option B** - Utiliser un autre port :
```bash
PORT=3001 npm run dev
```
Puis dans `electron.js`, mettez à jour le port.

---

### Problème : Erreur "Module not found"

**Solution** :
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

### Problème : Electron ne démarre pas

**Vérifications** :
1. Next.js doit tourner avant de lancer Electron
2. Vérifier que le port 3000 est accessible
3. Vérifier les logs dans le terminal

**Solution** :
```bash
# Terminal 1
npm run dev

# Attendre "✓ Ready"
# Terminal 2
npm run electron
```

---

### Problème : Page blanche dans Electron

**Cause** : Next.js n'est pas encore prêt

**Solution** :
- Attendre que Next.js affiche "✓ Ready"
- Redémarrer Electron
- Vérifier que `http://localhost:3000` fonctionne dans un navigateur

---

## 🎯 Points d'Entrée Principaux

### 1. Page d'Accueil
- **Fichier** : `app/page.tsx`
- **Comportement** : Redirection automatique vers `/authorities`

### 2. Layout Authorities
- **Fichier** : `app/authorities/layout.tsx`
- **Composants** : Sidebar + Content Area

### 3. Sidebar Navigation
- **Fichier** : `app/components/layout/Sidebar.tsx`
- **Fonctionnalité** : Navigation principale

---

## 📊 Données de Test

L'application contient actuellement des **données mockées** pour la démonstration :

### Autorités (6 exemples)
- Police Department NYC
- Fire Department LA
- Coast Guard Miami
- Border Patrol TX
- FBI Field Office
- DEA Regional Office

### Statistiques
- Total Authorities: 1,234
- Active Cases: 456
- Pending Reviews: 89
- Resolved: 2,341

### Transactions
- 4 transactions d'exemple avec différents statuts

**Note** : Pour connecter à une vraie base de données, il faudra :
1. Créer une API backend (Node.js/Express, NestJS, etc.)
2. Remplacer les données mockées par des appels API
3. Ajouter l'authentification

---

## 🔥 Commandes Utiles

```bash
# Développement web
npm run dev

# Electron desktop
npm run electron

# Build production
npm run build

# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
```

---

## 📱 Tester le Responsive

### Dans le navigateur :
1. Ouvrir DevTools (F12)
2. Cliquer sur l'icône mobile (Toggle device toolbar)
3. Tester différentes résolutions :
   - Mobile : 375px
   - Tablet : 768px
   - Desktop : 1280px+

---

## ✅ Checklist de Démarrage

- [ ] Node.js 18+ installé
- [ ] npm fonctionne
- [ ] Dependencies installées (`npm install`)
- [ ] Next.js démarre sans erreur (`npm run dev`)
- [ ] Page http://localhost:3000 accessible
- [ ] Redirection vers `/authorities` fonctionne
- [ ] Sidebar visible et navigation fonctionne
- [ ] Toutes les pages se chargent
- [ ] Electron lance une fenêtre (optionnel)

---

## 🎨 Personnalisation Rapide

### Changer les couleurs d'accent :
**Fichier** : Tous les fichiers `.tsx`
**Rechercher** : `from-yellow-400 to-yellow-500`
**Remplacer par** : Vos couleurs préférées (ex: `from-blue-400 to-blue-500`)

### Changer le nom d'utilisateur :
**Fichier** : `app/components/layout/Sidebar.tsx`
**Ligne** : `<h2>ALEX JOHNSON</h2>`

### Changer le titre de l'app :
**Fichier** : `app/layout.tsx`
**Ligne** : `title: "Vision IA Admin..."`

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le terminal
2. Consultez la documentation Next.js : https://nextjs.org/docs
3. Consultez la documentation Electron : https://electronjs.org/docs

---

## 🎉 Profitez de l'application !

Une fois lancée, explorez toutes les fonctionnalités :
- Créez des autorités
- Visualisez les statistiques
- Générez des rapports
- Explorez le design moderne et réactif

**Bonne utilisation ! 🚀**
