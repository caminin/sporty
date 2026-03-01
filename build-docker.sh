#!/bin/bash

# Script de build et déploiement Docker pour Sporty
# Utilisation: ./build-docker.sh [tag]

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Docker est installé et fonctionne
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé ou n'est pas dans le PATH"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker daemon n'est pas accessible. Démarrez Docker Desktop ou le service Docker."
        exit 1
    fi

    log_success "Docker est prêt"
}

# Nettoyer les images temporaires
cleanup() {
    log_info "Nettoyage des images temporaires..."
    docker image prune -f || true
}

# Build de l'application
build_app() {
    log_info "Construction de l'application Next.js..."
    npm run build
    log_success "Build Next.js terminé"
}

# Build de l'image Docker
build_docker() {
    local tag=$1
    log_info "Construction de l'image Docker: rcharlot49/sporty:$tag"
    docker build -t "rcharlot49/sporty:$tag" .
    log_success "Image Docker construite: rcharlot49/sporty:$tag"
}

# Push vers Docker Hub
push_docker() {
    local tag=$1
    log_info "Push de l'image vers Docker Hub: rcharlot49/sporty:$tag"
    docker push "rcharlot49/sporty:$tag"
    log_success "Image poussée avec succès: rcharlot49/sporty:$tag"
}

# Tag latest si c'est une version spécifique
tag_latest() {
    local tag=$1
    if [[ "$tag" != "latest" ]]; then
        log_info "Taggage de l'image $tag comme latest..."
        docker tag "rcharlot49/sporty:$tag" "rcharlot49/sporty:latest"
        push_docker "latest"
    fi
}

# Fonction principale
main() {
    local tag=${1:-$(date +%Y-%m-%d)}

    log_info "🚀 Début du processus de build Docker pour Sporty"
    log_info "Tag à utiliser: $tag"

    # Vérifications préalables
    check_docker

    # Nettoyage
    cleanup

    # Build de l'app
    build_app

    # Build Docker
    build_docker "$tag"

    # Push
    push_docker "$tag"

    # Tag latest si nécessaire
    tag_latest "$tag"

    log_success "🎉 Build et déploiement terminés avec succès !"
    log_info "📦 Image disponible: rcharlot49/sporty:$tag"
    if [[ "$tag" != "latest" ]]; then
        log_info "📦 Image disponible: rcharlot49/sporty:latest"
    fi
    log_info "🚀 Prêt pour le déploiement sur Unraid !"
}

# Gestion des erreurs
trap 'log_error "Le script a échoué à l'\''étape $BASH_COMMAND"' ERR

# Vérifier les arguments
if [[ $# -gt 1 ]]; then
    echo "Usage: $0 [tag]"
    echo "Exemples:"
    echo "  $0                    # Utilise la date du jour (YYYY-MM-DD)"
    echo "  $0 latest            # Utilise le tag 'latest'"
    echo "  $0 v1.0.0            # Utilise un tag personnalisé"
    exit 1
fi

# Lancer le script
main "$@"