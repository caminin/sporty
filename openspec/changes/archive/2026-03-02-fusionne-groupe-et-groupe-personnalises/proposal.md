## Why

Le système actuel sépare les groupes d'exercices prédéfinis (stockés dans exercises.json) des groupes personnalisés créés par les utilisateurs (stockés dans customGroups). Cette séparation crée une duplication conceptuelle et une complexité technique inutile. Unifier ces deux systèmes permettra une gestion cohérente des groupes, une meilleure maintenabilité du code, et une expérience utilisateur plus fluide.

## What Changes

- Fusionner les groupes prédéfinis et personnalisés dans une seule structure unifiée
- Migrer les groupes existants vers le nouveau format avec métadonnées (icônes, etc.)
- Simplifier l'interface de gestion des groupes
- Supprimer la distinction technique entre groupes "préférés" et "personnalisés"

## Capabilities

### New Capabilities
- `unified-group-management`: Gestion unifiée des groupes d'exercices avec métadonnées complètes

### Modified Capabilities
- `group-settings`: Modification pour gérer tous les types de groupes de manière unifiée
- `exercise-group-display`: Adaptation pour fonctionner avec la nouvelle structure unifiée

## Impact

Cette modification affectera:
- Le stockage des configurations d'exercices (exercises.json et customGroups)
- Les interfaces de gestion des groupes dans group-settings
- Les fonctions de chargement/sauvegarde des configurations
- Les composants d'affichage des groupes dans l'interface timer