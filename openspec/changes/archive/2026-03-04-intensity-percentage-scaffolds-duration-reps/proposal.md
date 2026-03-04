## Why

Le curseur d'intensité globale (0.5x à 2x) existe sur la page d'accueil mais n'a aucun effet fonctionnel : il n'impacte ni la durée estimée, ni les reps/durées des exercices pendant la séance. L'utilisateur ajuste l'intensité sans feedback visuel ni impact réel sur son entraînement.

## What Changes

- L'intensité (pourcentage/multiplicateur) applique un coefficient aux **durées** (exercices en temps) et aux **reps** (exercices en répétitions)
- La **durée estimée** sur la page d'accueil reflète les valeurs scalées par l'intensité
- Les **exercices** affichent leurs valeurs scalées (reps ou durée) sur la page d'accueil et dans la vue timer
- L'intensité est transmise à la session (encodée dans l'URL ou appliquée aux steps avant encodage) pour que le timer affiche et exécute les bonnes valeurs

## Capabilities

### New Capabilities

- `intensity-scaffolds-duration-reps`: L'intensité globale multiplie les durées (exercices time) et les reps (exercices reps). Ces valeurs scalées sont utilisées pour l'estimation, l'affichage et l'exécution de la séance.

### Modified Capabilities

- `home-page-exercise-management`: Affichage des valeurs scalées par exercice (reps ou durée) et intégration de l'intensité dans le flux de données (IntensityControl doit alimenter les calculs)
- `homepage-session-time-estimate`: La formule d'estimation inclut le multiplicateur d'intensité
- `timer-view`: Affichage et exécution des durées/reps scalées selon l'intensité
- `session-exercise-selection`: Le lancement de la séance transmet l'intensité (steps pré-scalés ou paramètre d'URL)

## Impact

- `app/page.tsx`: IntensityControl remonté au parent, passage de l'intensité à SessionSummary, ExerciseGroupBlock, estimateSessionDuration, FloatingActionButton
- `app/session-utils.ts`: estimateSessionDuration(intensity), buildSessionSteps(config, selectedIds, intensity) ou équivalent
- `app/timer/page.tsx`: Utilisation des steps déjà scalés (si encodés) ou décodage de l'intensité depuis l'URL
- Types `SessionStep` : inchangés (valeurs déjà scalées dans les steps)
