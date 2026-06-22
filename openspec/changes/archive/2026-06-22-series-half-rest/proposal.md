## Why

Aujourd'hui, la pause entre deux séries du même exercice est identique à celle entre deux exercices différents (`globalRestTime`). C'est trop long entre séries consécutives du même mouvement : l'utilisateur perd du temps sans bénéfice récupérationnel équivalent. Un repos plus court entre séries (moitié du temps inter-exercices) rend les blocs multi-séries plus fluides tout en gardant une vraie pause entre changements d'exercice.

L'indicateur visuel de série (style `1/3`) est déjà couvert par le changement `timer-series-indicator` ; ce changement porte uniquement sur la **durée** des repos inter-séries.

## What Changes

- Repos **entre deux séries du même exercice** : durée = `globalRestTime / 2` (arrondi à l'entier le plus proche, minimum 1 seconde).
- Repos **entre le dernier work step d'un exercice et le premier du suivant** : durée inchangée = `globalRestTime` complet.
- Mise à jour de `buildSessionSteps` pour appliquer la bonne durée selon le contexte (intra-série vs inter-exercice).
- Mise à jour de `estimateSessionDuration` pour refléter la formule différenciée.
- Tests unitaires session et estimation mis à jour.

## Capabilities

### New Capabilities

_Aucune._

### Modified Capabilities

- `exercise-series` : exigence de repos inter-séries — moitié de `globalRestTime` au lieu du temps complet.
- `workout-session-flow` : alignement sur la même règle de repos différencié à la construction des steps.
- `homepage-session-time-estimate` : formule d'estimation tenant compte des repos courts inter-séries et des repos complets inter-exercices.

## Impact

- `app/session-utils.ts` : `buildSessionSteps`, `estimateSessionDuration`, éventuel helper `seriesRestDuration(globalRestTime)`.
- `app/session-utils.test.ts` : scénarios repos demi / repos complet.
- Specs OpenSpec : `exercise-series`, `workout-session-flow`, `homepage-session-time-estimate`.
- Pas d'impact admin, catalogue, ni encodage URL de session (les steps `rest` portent déjà une `duration` explicite).
