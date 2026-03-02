## Context

`ensureDefaultList` charge `exercises.json` et applique `migrateWorkoutConfig`. Depuis le change "remove-default-groups-single-tab", la migration ne convertit plus l'ancien format (groupes = clés, exercices = tableaux) vers le format Group. Elle retourne `groups: {}` pour l'ancien format. La liste par défaut est donc vide à la première initialisation.

Le contenu souhaité (Cardio endurance, Épaules et frappe, Abdos, Explosivité jambes, Agilité et déplacements) existe dans `exercises.json` mais au mauvais format.

## Goals / Non-Goals

**Goals:**
- Un seed unique au format Group pour la liste par défaut
- Chargement direct sans conversion à la volée
- Source de vérité claire et maintenable

**Non-Goals:**
- Ne pas modifier la structure `Group` ou `Exercise`
- Ne pas migrer les listes déjà créées sur disque
- Ne pas changer le système de listes (CRUD, sélection)

## Decisions

### 1. Emplacement et format du seed

**Décision** : Créer `app/exercises/default-seed.json` contenant une `WorkoutConfig` complète au format Group. Chaque groupe a `id`, `name`, `icon`, `createdAt`, `exercises`.

**Alternative** : Module TypeScript `default-seed.ts` exportant la config. Rejeté : JSON est plus simple à éditer, versionné, et évite les imports circulaires.

### 2. Contenu de default-seed.json

**Décision** : Reprendre tous les groupes et exercices de l'actuel `exercises.json`, convertis en format Group. Mapping des icônes : Cardio endurance → `activity`, Épaules et frappe → `target`, Abdos → `zap`, Explosivité jambes → `zap`, Agilité et déplacements → `footprints`. Les exercices ont `id`, `name`, `type`, `value` (pas de `description` dans le type Exercise).

### 3. Rôle de exercises.json

**Décision** : Ne plus utiliser `exercises.json` pour le seed initial. `ensureDefaultList` charge `default-seed.json` en priorité. Si absent, fallback sur config vide (globalRestTime: 15, groups: {}).

**Alternative** : Garder exercises.json comme fallback pour migration d'anciennes installs. Rejeté : simplifier le flux ; les anciennes installations ont déjà une liste default créée.

### 4. Nettoyage de migrateWorkoutConfig

**Décision** : Ne pas modifier `migrateWorkoutConfig` pour ce change. Elle reste utilisée pour charger les listes déjà sauvegardées (format legacy possible). Le seed par défaut est chargé séparément, sans passer par cette migration.

## Risks / Trade-offs

- **[Perte de données]** Les utilisateurs ayant supprimé manuellement la liste default et comptant sur une réinitialisation depuis exercises.json ne retrouveront plus le contenu. → Mitigation : documenter que default-seed.json est la source ; si besoin, on peut ajouter un fallback exercises.json en lecture seule.

- **[Régression]** Si default-seed.json est corrompu ou absent, la liste par défaut sera vide. → Mitigation : validation à la lecture ; log d'avertissement si fichier absent.

## Migration Plan

1. Créer `app/exercises/default-seed.json` avec le contenu converti
2. Modifier `ensureDefaultList` pour charger ce fichier au lieu de exercises.json
3. Mettre à jour les tests d'initialisation
4. Optionnel : supprimer ou archiver exercises.json (non bloquant pour ce change)
