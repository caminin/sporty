# Script de build et déploiement Docker pour Sporty
# Utilisation: .\build-docker.ps1 [-Tag "custom-tag"]

param(
    [string]$Tag = $(Get-Date -Format "yyyy-MM-dd")
)

# Fonction d'affichage
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Vérifier si Docker est installé et fonctionne
function Test-Docker {
    try {
        $null = docker version
        Write-Success "Docker est prêt"
    }
    catch {
        Write-Error "Docker n'est pas installé ou n'est pas accessible"
        Write-Error "Assurez-vous que Docker Desktop est démarré"
        exit 1
    }
}

# Nettoyer les images temporaires
function Clear-DockerImages {
    Write-Info "Nettoyage des images temporaires..."
    try {
        docker image prune -f | Out-Null
    }
    catch {
        Write-Warning "Impossible de nettoyer les images temporaires"
    }
}

# Build de l'application
function Build-App {
    Write-Info "Construction de l'application Next.js..."
    try {
        npm run build
        Write-Success "Build Next.js terminé"
    }
    catch {
        Write-Error "Échec du build Next.js: $($_.Exception.Message)"
        exit 1
    }
}

# Build de l'image Docker
function Build-DockerImage {
    param([string]$ImageTag)

    Write-Info "Construction de l'image Docker: rcharlot49/sporty:$ImageTag"
    try {
        docker build -t "rcharlot49/sporty:$ImageTag" .
        Write-Success "Image Docker construite: rcharlot49/sporty:$ImageTag"
    }
    catch {
        Write-Error "Échec du build Docker: $($_.Exception.Message)"
        exit 1
    }
}

# Push vers Docker Hub
function Push-DockerImage {
    param([string]$ImageTag)

    Write-Info "Push de l'image vers Docker Hub: rcharlot49/sporty:$ImageTag"
    try {
        docker push "rcharlot49/sporty:$ImageTag"
        Write-Success "Image poussée avec succès: rcharlot49/sporty:$ImageTag"
    }
    catch {
        Write-Error "Échec du push Docker: $($_.Exception.Message)"
        exit 1
    }
}

# Tag latest si c'est une version spécifique
function Set-LatestTag {
    param([string]$ImageTag)

    if ($ImageTag -ne "latest") {
        Write-Info "Taggage de l'image $ImageTag comme latest..."
        try {
            docker tag "rcharlot49/sporty:$ImageTag" "rcharlot49/sporty:latest"
            Push-DockerImage "latest"
        }
        catch {
            Write-Warning "Impossible de tagger l'image comme latest: $($_.Exception.Message)"
        }
    }
}

# Fonction principale
function Main {
    Write-Host "🚀 Début du processus de build Docker pour Sporty" -ForegroundColor Cyan
    Write-Info "Tag à utiliser: $Tag"

    # Vérifications préalables
    Test-Docker

    # Nettoyage
    Clear-DockerImages

    # Build de l'app
    Build-App

    # Build Docker
    Build-DockerImage $Tag

    # Push
    Push-DockerImage $Tag

    # Tag latest si nécessaire
    Set-LatestTag $Tag

    Write-Host "🎉 Build et déploiement terminés avec succès !" -ForegroundColor Green
    Write-Info "📦 Image disponible: rcharlot49/sporty:$Tag"
    if ($Tag -ne "latest") {
        Write-Info "📦 Image disponible: rcharlot49/sporty:latest"
    }
    Write-Info "🚀 Prêt pour le déploiement sur Unraid !"
}

# Gestion des erreurs
$ErrorActionPreference = "Stop"

try {
    Main
}
catch {
    Write-Error "Le script a échoué: $($_.Exception.Message)"
    exit 1
}