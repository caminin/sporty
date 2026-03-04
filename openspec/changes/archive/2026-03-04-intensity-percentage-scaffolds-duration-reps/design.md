## Context

L'intensité globale (slider 0.5x–2x) existe dans `IntensityControl` mais est un état local isolé. `estimateSessionDuration`, `buildSessionSteps` et `encodeSession` n'en tiennent pas compte. La session encodée dans l'URL contient des steps avec les valeurs brutes des exercices. Le timer décode ces steps et les exécute tels quels.

## Goals / Non-Goals

**Goals:**
- Appliquer le multiplicateur d'intensité aux durées (type time) et aux reps (type reps)
- Afficher les valeurs scalées sur la page d'accueil (exercices + durée estimée)
- Exécuter les valeurs scalées dans le timer

**Non-Goals:**
- Modifier le temps de repos entre exercices (globalRestTime reste inchangé)
- Modifier le format d'encodage des steps (structure inchangée, seules les valeurs scalées sont encodées)

## Decisions

### 1. Scaling au moment du lancement (steps pré-scalés)

**Choix:** Les steps encodés dans l'URL contiennent déjà les valeurs scalées (duration × intensity, reps × intensity). Le timer n'a pas besoin de connaître l'intensité.

**Alternatives:** Passer l'intensité en paramètre d'URL séparé (`?intensity=1.2`) et scaler côté timer. Rejeté car plus complexe et double source de vérité.

### 2. Arrondi des valeurs scalées

**Choix:** `Math.round(value * intensity)` pour reps et durée. Évite les répétitions fractionnaires.

### 3. Remontée de l'état d'intensité

**Choix:** `IntensityControl` remonte sa valeur via `onIntensityChange` au parent `BadmintonSessionPage`. L'intensité est stockée dans le state du parent et passe à `SessionSummary`, `ExerciseGroupBlock`, `estimateSessionDuration`, et `FloatingActionButton`.

**Alternatives:** Context React. Rejeté pour garder la simplicité (state local suffisant selon le design existant).

### 4. API des fonctions utilitaires

**Choix:**
- `estimateSessionDuration(config, selectedIds, intensity)` — ajout du paramètre optionnel `intensity` (défaut 1.0)
- `buildSessionSteps(config, selectedIds, intensity)` — ajout du paramètre optionnel `intensity` (défaut 1.0)
- `FloatingActionButton` reçoit `intensity` dans ses props et passe à `buildSessionSteps` puis `encodeSession`

## Risks / Trade-offs

- **[Arrondi]** Reps à 0.5x sur un exercice de 10 reps → 5 reps. Pas de limite minimale (ex. 1 rep).

- **[Compatibilité]** Les anciennes URLs de session (sans scaling) restent valides : elles correspondent à intensity=1.0.
