## Why

Le fichier `default-seed.json` et l’action admin « Réinitialiser » dupliquent le flux principal (`exercice_list/` + import manuel) sans apporter de valeur au quotidien. Le curseur d’intensité (0,5x–2x) complexifie l’accueil et la séance alors que les valeurs catalogue / overrides suffisent ; le tableau de bord (nombre d’exercices, repos, durée estimée) reste utile sans ce réglage.

## What Changes

- **BREAKING** : suppression de `app/exercises/default-seed.json`, de `loadDefaultSeedConfig`, `seedExerciseList`, `seedListWithDefaultTemplate` et du bouton « Réinitialiser » dans les réglages de groupe.
- Suppression du composant `IntensityControl` (slider) sur la page d’accueil ; conservation de `SessionSummary` (exercices sélectionnés, repos, durée estimée).
- Affichage et calculs de séance basés sur les valeurs effectives brutes (sans multiplicateur) : `intensity` fixé à 1,0 ou paramètre retiré de `estimateSessionDuration`, `buildSessionSteps`, encodage URL.
- Mise à jour des tests et du `Dockerfile` qui copiait `default-seed.json`.
- Delta specs : retrait de la capacité seed ; retrait de la capacité intensité globale ; adaptation accueil / estimation / sélection.

## Capabilities

### New Capabilities

_(aucune)_

### Modified Capabilities

- `default-list-seed` : capacité entièrement retirée (fichier seed + API seed).
- `intensity-scaffolds-duration-reps` : capacité entièrement retirée (plus de scaling global).
- `home-page-exercise-management` : plus de slider ni de valeurs scalées à l’écran.
- `homepage-session-time-estimate` : formule sans multiplicateur d’intensité.
- `session-exercise-selection` : steps encodés avec valeurs effectives non scalées.
- `list-system-testing` : scénarios liés au seed explicite retirés.

### Impact

- `app/exercises/lists.ts`, `lists-actions.ts`, `default-seed.json`, `Dockerfile`
- `app/page.tsx`, `app/session-utils.ts`
- `app/group-settings/page.tsx` (bouton Réinitialiser)
- `app/__tests__/entities/exercise-lists/initialization-migration.test.ts`
- Specs OpenSpec listées ci-dessus ; skill / docs mentionnant `default-seed.json` si présents
