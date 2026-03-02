## Purpose
Cette capability étend le système de stockage existant pour persister les groupes d'exercices personnalisés avec leurs métadonnées (nom, icône, date de création) et leurs exercices associés, tout en maintenant la compatibilité avec les groupes prédéfinis existants.

## Requirement: Structure étendue du fichier de configuration
Le système MUST étendre la structure JSON existante pour inclure les groupes personnalisés séparément des groupes prédéfinis.

#### Scenario: Nouvelle propriété customGroups
- **WHEN** l'application charge la configuration des exercices
- **THEN** une propriété `customGroups` est supportée en plus de `groups`
- **THEN** les groupes prédéfinis restent dans la propriété `groups` existante
- **THEN** les groupes personnalisés sont stockés dans `customGroups`

#### Scenario: Structure des groupes personnalisés
- **WHEN** un groupe personnalisé est créé
- **THEN** il est stocké avec la structure suivante : `{ id, name, icon, createdAt, exercises }`
- **THEN** l'`id` est un identifiant unique généré automatiquement
- **THEN** `createdAt` est un timestamp ISO de création
- **THEN** `exercises` est un tableau d'exercices au format existant

## Requirement: Migration backward-compatible
Le système MUST supporter la migration progressive des configurations existantes vers le nouveau format.

#### Scenario: Chargement de configuration sans customGroups
- **WHEN** l'application charge un fichier `exercises.json` sans propriété `customGroups`
- **THEN** la propriété `customGroups` est initialisée comme un objet vide `{}`
- **THEN** les groupes prédéfinis continuent de fonctionner normalement

#### Scenario: Validation de la structure des customGroups
- **WHEN** l'application charge la configuration
- **THEN** chaque groupe personnalisé est validé pour contenir les propriétés requises
- **THEN** les groupes invalides sont signalés mais n'empêchent pas le chargement des autres

## Requirement: Opérations CRUD sur les groupes personnalisés
Le système MUST fournir des fonctions pour créer, lire, modifier et supprimer les groupes personnalisés dans le stockage.

#### Scenario: Création d'un groupe personnalisé
- **WHEN** une fonction de création est appelée avec nom et icône
- **THEN** un nouvel objet groupe est créé avec un ID unique
- **THEN** le groupe est ajouté à `customGroups`
- **THEN** la configuration est sauvegardée sur disque

#### Scenario: Mise à jour d'un groupe personnalisé
- **WHEN** une fonction de mise à jour est appelée avec l'ID et les nouvelles propriétés
- **THEN** le groupe existant est modifié avec les nouvelles valeurs
- **THEN** la configuration est sauvegardée sur disque
- **THEN** un timestamp de modification peut être ajouté

#### Scenario: Suppression d'un groupe personnalisé
- **WHEN** une fonction de suppression est appelée avec l'ID du groupe
- **THEN** le groupe est retiré de `customGroups`
- **THEN** tous les exercices associés sont supprimés
- **THEN** la configuration est sauvegardée sur disque

## Requirement: Intégration avec le système de listes
Le système MUST supporter les groupes personnalisés dans le contexte des listes d'exercices existantes.

#### Scenario: Groupes personnalisés par liste
- **WHEN** l'utilisateur change de liste active
- **THEN** les groupes personnalisés associés à cette liste sont chargés
- **THEN** les groupes personnalisés sont indépendants entre les listes

#### Scenario: Export de configuration avec groupes personnalisés
- **WHEN** l'utilisateur exporte la configuration d'une liste
- **THEN** les groupes personnalisés sont inclus dans l'export JSON
- **THEN** la structure respecte le format étendu
