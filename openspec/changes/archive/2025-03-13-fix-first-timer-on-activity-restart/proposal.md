## Why

Quand l'utilisateur clique sur "Oui, refaire !" après une séance terminée, la séance repart depuis le début mais le premier timer (compte à rebours du premier exercice) ne se lance pas. L'écran reste bloqué sur la durée initiale sans décompter. Le bug provient de la logique de transition d'étape dans le useEffect du timer : au replay, `currentStepIndex` passe du dernier index à 0, ce qui déclenche un "return early" sans créer l'intervalle, et aucune mise à jour d'état ne force un second passage.

## What Changes

- Correction du useEffect du countdown dans `app/timer/page.tsx` : lors d'une transition d'étape (détectée via `currentStepIndex !== lastStepIndexRef.current`), synchroniser `timeLeft` avec la durée du step courant avant de retourner, afin de déclencher un re-render et un second passage de l'effet qui créera l'intervalle.
- Ajout d'un scénario de spec pour garantir que le replay relance correctement le premier timer.

## Capabilities

### New Capabilities

- Aucune.

### Modified Capabilities

- `timer-view` : ajout d'un scénario exigeant que le compte à rebours du premier exercice démarre correctement après un clic sur "Refaire une boucle".

## Impact

- `app/timer/page.tsx` : modification du useEffect du countdown (lignes ~187-221) pour initialiser `timeLeft` lors d'une transition d'étape avant le return early.
- `openspec/specs/timer-view/spec.md` : ajout d'un scénario de replay.
