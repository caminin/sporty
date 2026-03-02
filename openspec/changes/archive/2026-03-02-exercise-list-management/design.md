## Context

L'application utilise actuellement un seul fichier `exercises.json` pour stocker les exercices. L'utilisateur souhaite étendre cela pour supporter plusieurs listes d'exercices avec gestion administrative protégée par mot de passe.

## Goals / Non-Goals

**Goals:**
- Supporter plusieurs listes d'exercices nommées et organisées
- Protéger les modifications par mot de passe admin "sporty"
- Sauvegarder les listes sur le serveur de manière persistante
- Maintenir la compatibilité avec le système existant

**Non-Goals:**
- Gestion d'utilisateurs multiples (authentification simple uniquement)
- Partage de listes entre utilisateurs
- Synchronisation cloud des listes

## Decisions

**Structure de stockage:** Créer un répertoire `/data/exercise-lists/` contenant des fichiers JSON individuels pour chaque liste, nommés par identifiant unique.

**Format des données:** Chaque liste contient métadonnées (nom, description, date de création) plus le contenu des exercices identique au format actuel.

**Authentification:** Vérification simple côté serveur du mot de passe "sporty" pour toutes les opérations d'administration.

**API:** Nouveaux endpoints Server Actions pour gérer les listes (liste, création, modification, suppression, chargement).

**Interface:** Étendre l'interface des paramètres avec un nouvel onglet "Gestion des listes" protégé par mot de passe.

**Docker:** Ajouter un volume monté sur `/data` pour persister les listes d'exercices.

## Risks / Trade-offs

- **Sécurité:** Mot de passe en dur dans le code → Risque acceptable pour une application personnelle
- **Migration:** Passage du système mono-liste au multi-listes → Migration automatique de l'existant vers une liste par défaut
- **Complexité:** Interface plus complexe pour l'utilisateur → Compensé par la flexibilité gagnée