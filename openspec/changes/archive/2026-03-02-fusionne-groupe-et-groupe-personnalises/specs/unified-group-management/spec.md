# unified-group-management Specification

## Purpose
Cette capability définit la gestion unifiée des groupes d'exercices, éliminant la distinction entre groupes prédéfinis et personnalisés pour une expérience utilisateur cohérente.

## Requirements

### Requirement: Structure de données unifiée
Le système DOIT utiliser une seule structure `Group` pour représenter tous les types de groupes d'exercices, incluant métadonnées (ID, nom, icône, date de création).

#### Scenario: Chargement de groupes prédéfinis avec métadonnées
- **WHEN** le système charge une configuration sans métadonnées complètes
- **THEN** il assigne automatiquement des IDs déterministes et des icônes par défaut aux groupes prédéfinis
- **THEN** il définit une date de création par défaut pour ces groupes

#### Scenario: Fusion des groupes personnalisés existants
- **WHEN** le système charge une configuration avec `customGroups`
- **THEN** il migre automatiquement ces groupes vers la structure unifiée `groups`
- **THEN** il préserve toutes les métadonnées existantes (ID, icône, date de création)

### Requirement: API de gestion unifiée
Le système DOIT fournir une API cohérente pour créer, modifier et supprimer tous types de groupes.

#### Scenario: Création de groupe personnalisé
- **WHEN** un utilisateur crée un nouveau groupe personnalisé
- **THEN** le système génère un ID unique et stocke le groupe dans la structure unifiée
- **THEN** le groupe est traité de manière identique aux groupes prédéfinis dans toutes les interfaces

#### Scenario: Modification de groupe prédéfini
- **WHEN** un utilisateur modifie un groupe prédéfini (ajout/suppression d'exercices)
- **THEN** le système applique les changements dans la structure unifiée
- **THEN** les modifications sont persistées de manière transparente

### Requirement: Rétrocompatibilité
Le système DOIT maintenir la compatibilité avec les formats de stockage existants.

#### Scenario: Chargement de configuration ancienne
- **WHEN** le système charge une configuration avec seulement `groups` (sans métadonnées)
- **THEN** il effectue automatiquement la migration vers le nouveau format
- **THEN** il sauvegarde la configuration migrée pour éviter les migrations répétées

#### Scenario: Export de configuration
- **WHEN** le système exporte la configuration des groupes
- **THEN** il produit un format compatible avec les versions précédentes
- **THEN** les groupes personnalisés sont inclus dans l'export