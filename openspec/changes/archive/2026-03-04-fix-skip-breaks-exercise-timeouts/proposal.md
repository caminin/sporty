## Why

Appuyer sur « Passer » pendant un exercice ou un repos casse la gestion du temps du step suivant. Le countdown du prochain exercice (ou repos) démarre avec une valeur obsolète (celle du step précédent) au lieu de la durée configurée, ce qui fausse l’enchaînement de la séance.

## What Changes

- Correction de la race condition entre l’effet qui initialise `timeLeft` et celui qui lance le countdown
- Le timer du step suivant démarre toujours avec la durée correcte après un skip
- Ajout de tests automatisés pour couvrir ce comportement (skip → prochain step avec countdown correct)

## Capabilities

### New Capabilities

- Aucune

### Modified Capabilities

- `timer-view` : le scénario « User skips the current step » doit garantir que le countdown du step suivant démarre avec la durée correcte

## Impact

- `app/timer/page.tsx` : ajustement des effets `useEffect` (countdown et initialisation de `timeLeft`)
- Nouveaux tests : `app/timer/__tests__/` ou `app/__tests__/timer/` pour le flux skip → prochain step
