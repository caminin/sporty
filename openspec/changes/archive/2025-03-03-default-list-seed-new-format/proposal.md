## Why

La liste par défaut est initialisée depuis `exercises.json`, mais ce fichier utilise un format obsolète (`groups: { "nom": [exercices] }`) incompatible avec la structure unifiée `Group` (id, name, icon, createdAt, exercises). La migration actuelle (`migrateWorkoutConfig`) ne convertit plus les groupes prédéfinis — elle retourne `groups: {}` pour l'ancien format. Résultat : la liste par défaut est vide à la première initialisation.

## What Changes

- Créer une source de vérité pour le seed de la liste par défaut au format `Group` unifié
- Convertir le contenu actuel de `exercises.json` (Cardio endurance, Épaules et frappe, Abdos, Explosivité jambes, Agilité et déplacements) vers ce format
- Modifier `ensureDefaultList` pour charger ce seed au lieu de `exercises.json`
- Dépouiller ou supprimer la logique de migration de l'ancien format dans `workout-config.ts` pour le cas du seed par défaut

## Capabilities

### New Capabilities

- `default-list-seed`: Source de vérité pour le contenu initial de la liste par défaut, au format Group unifié. Chargeable sans migration.

### Modified Capabilities

- `list-system-testing`: Le scénario "Migration depuis exercises.json" devient "Chargement du seed par défaut" — le contenu provient du nouveau fichier seed, pas de exercises.json.

## Impact

- `app/exercises/` : nouveau fichier seed (JSON ou TS), `lists.ts` (ensureDefaultList), éventuellement `workout-config.ts`
- `app/exercises.json` : peut être conservé pour rétrocompat ou supprimé selon le design
- Tests d'initialisation dans `app/__tests__/`
