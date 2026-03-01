# Guide de Build et Déploiement

## Scripts de build

### build-docker.sh (Linux/macOS)

Script bash automatisé qui exécute toutes les étapes :

1. ✅ Vérification de Docker
2. 🧹 Nettoyage des images temporaires
3. 🔨 Build de l'application Next.js (`npm run build`)
4. 🐳 Construction de l'image Docker
5. 📤 Push vers Docker Hub
6. 🏷️ Taggage automatique (latest si nécessaire)

#### Utilisation

```bash
# Tag automatique (date du jour : YYYY-MM-DD)
./build-docker.sh

# Tag personnalisé
./build-docker.sh v1.0.0

# Tag latest
./build-docker.sh latest
```

#### Exemples de sortie

```
[INFO] 🚀 Début du processus de build Docker pour Sporty
[INFO] Tag à utiliser: 2026-03-01
[SUCCESS] Docker est prêt
[INFO] Nettoyage des images temporaires...
[INFO] Construction de l'application Next.js...
[SUCCESS] Build Next.js terminé
[INFO] Construction de l'image Docker: rcharlot49/sporty:2026-03-01
[SUCCESS] Image Docker construite: rcharlot49/sporty:2026-03-01
[INFO] Push de l'image vers Docker Hub: rcharlot49/sporty:2026-03-01
[SUCCESS] Image poussée avec succès: rcharlot49/sporty:2026-03-01
[INFO] Taggage de l'image 2026-03-01 comme latest...
[SUCCESS] 🎉 Build et déploiement terminés avec succès !
[INFO] 📦 Image disponible: rcharlot49/sporty:2026-03-01
[INFO] 📦 Image disponible: rcharlot49/sporty:latest
[INFO] 🚀 Prêt pour le déploiement sur Unraid !
```

### build-docker.ps1 (Windows)

Version PowerShell du script bash avec les mêmes fonctionnalités.

#### Utilisation

```powershell
# Tag automatique
.\build-docker.ps1

# Tag personnalisé
.\build-docker.ps1 -Tag "v1.0.0"

# Tag latest
.\build-docker.ps1 -Tag "latest"
```

## Dépannage

### Docker n'est pas accessible

```
[ERROR] Docker daemon n'est pas accessible. Démarrez Docker Desktop ou le service Docker.
```

**Solution** : Démarrer Docker Desktop (Windows/macOS) ou le service Docker (Linux)

### Build Next.js échoue

```
[ERROR] Échec du build Next.js
```

**Solution** :
- Vérifier que `npm install` a été exécuté
- Vérifier les erreurs TypeScript : `npm run lint`
- Vérifier les tests : `npm test`

### Push Docker échoue

```
[ERROR] Échec du push Docker
```

**Solution** :
- Vérifier les identifiants Docker Hub : `docker login`
- Vérifier que le repository `rcharlot49/sporty` existe sur Docker Hub

## Variables et configuration

### Tags automatiques

- **Par défaut** : Date du jour (`YYYY-MM-DD`)
- **Latest** : Toujours taggé en plus du tag spécifique
- **Personnalisé** : Tout tag passé en paramètre

### Images générées

- `rcharlot49/sporty:latest` - Dernière version
- `rcharlot49/sporty:YYYY-MM-DD` - Version datée
- `rcharlot49/sporty:v1.0.0` - Version personnalisée

## Déploiement sur Unraid

Après le build, utiliser l'une des méthodes décrites dans `README.md` :

- Interface Docker d'Unraid
- Docker Compose
- Commande manuelle

## Optimisations

### Cache Docker

Le Dockerfile utilise un build multi-stage pour optimiser la taille finale :
- **Stage builder** : Construction avec toutes les dépendances
- **Stage runner** : Image de production minimale

### Cache Next.js

Configurez le cache de build pour des rebuilds plus rapides :
```bash
# Dans next.config.ts
experimental: {
  incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
},
```

### .dockerignore

Le fichier `.dockerignore` exclut :
- `node_modules`
- `.next`
- `.git`
- Fichiers temporaires

Cela réduit le contexte de build et améliore les performances.