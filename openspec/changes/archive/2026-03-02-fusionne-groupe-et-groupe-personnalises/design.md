## Context

Le système actuel maintient une séparation entre:
- **Groupes prédéfinis**: Stockés dans `groups` (Record<string, Exercise[]>), chargés depuis exercises.json
- **Groupes personnalisés**: Stockés dans `customGroups` (Record<string, CustomGroup>), créés dynamiquement par les utilisateurs

Cette séparation nécessite une logique de gestion différente pour chaque type de groupe, créant de la duplication de code et une complexité inutile.

## Goals / Non-Goals

**Goals:**
- Unifier la gestion des groupes dans une seule structure de données
- Maintenir la rétrocompatibilité avec les configurations existantes
- Assigner des icônes appropriées aux groupes prédéfinis
- Simplifier l'API de gestion des groupes

**Non-Goals:**
- Changer l'interface utilisateur existante (sauf pour simplifier la logique)
- Supprimer les groupes prédéfinis existants
- Modifier le format de stockage externe (exercises.json reste compatible)

## Decisions

### 1. Structure de données unifiée
**Décision**: Étendre l'interface `WorkoutConfig` pour utiliser uniquement `groups: Record<string, Group>` où `Group` inclut les métadonnées.

**Rationale**: Élimine la duplication conceptuelle. Les groupes personnalisés deviennent des groupes normaux avec métadonnées supplémentaires.

**Alternatives considérées**:
- Garder `customGroups` séparé mais ajouter un mapping → Complexité accrue
- Migrer vers un tableau `Group[]` → Perte de l'accès par nom, breaking change majeur

### 2. Migration des données existantes
**Décision**: Migration automatique lors du chargement pour les configurations sans métadonnées complètes.

**Rationale**: Transparente pour l'utilisateur, maintient la rétrocompatibilité.

**Migration strategy**:
- Détecter les configurations "anciennes" (avec `groups` simple)
- Assigner des IDs, icônes et dates de création aux groupes prédéfinis
- Conserver les `customGroups` existants en les fusionnant dans `groups`

### 3. Gestion des icônes pour groupes prédéfinis
**Décision**: Assigner des icônes par défaut aux groupes prédéfinis basées sur leur fonction.

**Mapping proposé**:
- "Cardio endurance" → "Heart"
- "Épaules et frappe" → "Dumbbell"
- "Adbos" → "Activity"
- "Explosivité jambes" → "Zap"
- "Agilité et déplacements" → "Shuffle"

### 4. Gestion des IDs
**Décision**: Générer des IDs déterministes pour les groupes prédéfinis (`predefined-<slug>`), garder les IDs existants pour les groupes personnalisés.

**Rationale**: Évite les conflits, permet l'identification des groupes prédéfinis.

## Risks / Trade-offs

**Risque**: Perte de données lors de la migration → **Mitigation**: Validation stricte et tests unitaires complets

**Risque**: Changements d'interface utilisateur inattendus → **Mitigation**: Maintenir les interfaces existantes, ajouter des adaptateurs si nécessaire

**Trade-off**: Complexité de migration vs simplicité future → **Choix**: Complexité initiale acceptable pour simplification long-terme