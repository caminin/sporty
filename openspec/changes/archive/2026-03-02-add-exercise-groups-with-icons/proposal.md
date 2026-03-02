## Why

L'application Sporty permet actuellement de gérer des exercices organisés en groupes prédéfinis, mais les utilisateurs ne peuvent pas créer leurs propres groupes personnalisés avec des icônes représentatives. Cette limitation empêche une organisation plus flexible et personnalisée des séances d'entraînement, particulièrement utile pour les programmes sportifs spécialisés ou les objectifs personnels spécifiques.

## What Changes

- Ajouter la possibilité de créer de nouveaux groupes d'exercices personnalisés
- Permettre aux utilisateurs de choisir une icône pour chaque groupe personnalisé
- Modifier l'interface de gestion des groupes pour supporter la création et l'édition de groupes personnalisés
- Étendre le système de stockage pour persister les groupes personnalisés avec leurs icônes

## Capabilities

### New Capabilities
- `exercise-group-creation`: Permet la création, modification et suppression de groupes d'exercices personnalisés par les utilisateurs
- `exercise-group-icons`: Gestion des icônes associées aux groupes d'exercices personnalisés, avec sélection depuis une bibliothèque prédéfinie
- `custom-group-storage`: Extension du système de stockage pour persister les groupes personnalisés et leurs métadonnées

### Modified Capabilities
- `group-settings`: Extension de l'interface existante pour supporter la gestion des groupes personnalisés en plus des groupes prédéfinis

## Impact

- Interface utilisateur : Modification de la page de paramètres des groupes pour inclure les fonctionnalités de création/édition
- Stockage : Extension du fichier `exercises.json` pour inclure les groupes personnalisés
- Composants : Mise à jour des composants d'affichage des groupes pour supporter les icônes personnalisées
- API : Nouvelles fonctions pour la gestion CRUD des groupes personnalisés