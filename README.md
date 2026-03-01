# Sporty

Application Next.js pour la gestion d'exercices sportifs et de sessions d'entraînement.

## Déploiement Docker

### Sur Unraid

1. **Via Docker (interface graphique)** :
   - Aller dans l'onglet Docker d'Unraid
   - Cliquer sur "Add Container"
   - Dans "Repository", entrer : `rcharlot49/sporty:2026-03-01`
   - Dans "Name", entrer : `sporty`
   - Dans "Network Type", sélectionner `bridge`
   - Ajouter un port mapping :
     - Host Port : `3000`
     - Container Port : `3000`
     - Protocol : `tcp`
   - Ajouter un volume mapping :
     - Container Path : `/app/app/exercises.json`
     - Host Path : `/mnt/user/appdata/sporty/exercises.json`
   - Cliquer sur "Create"

2. **Via Docker Compose** :
   ```bash
   # Sur votre serveur Unraid
   cd /mnt/user/appdata/sporty
   wget https://raw.githubusercontent.com/rcharlot49/sporty/main/docker-compose.yml
   docker-compose up -d
   ```

### Accès

Une fois déployé, accéder à l'application via : `http://votre-ip-unraid:3000`

### Volumes

- `/app/app/exercises.json` : Fichier de données des exercices (à monter pour persister les modifications)

### Variables d'environnement

Aucune variable d'environnement requise pour le moment.

## Développement

```bash
npm install
npm run dev
```

## Build et déploiement

### Script automatisé (recommandé)

Le projet inclut des scripts automatisés pour construire et déployer l'image Docker :

#### Linux/macOS
```bash
# Build avec tag automatique (date du jour)
./build-docker.sh

# Build avec tag personnalisé
./build-docker.sh v1.0.0

# Build avec tag latest
./build-docker.sh latest
```

#### Windows (PowerShell)
```powershell
# Build avec tag automatique (date du jour)
.\build-docker.ps1

# Build avec tag personnalisé
.\build-docker.ps1 -Tag "v1.0.0"

# Build avec tag latest
.\build-docker.ps1 -Tag "latest"
```

### Build manuel

```bash
# Build Next.js
npm run build

# Build image Docker
docker build -t rcharlot49/sporty:2026-03-01 .

# Push vers Docker Hub
docker push rcharlot49/sporty:2026-03-01
```

## Scripts disponibles

- `build-docker.sh` - Script bash pour Linux/macOS
- `build-docker.ps1` - Script PowerShell pour Windows
- `docker-compose.yml` - Configuration pour déploiement