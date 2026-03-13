## Context

Le timer (`app/timer/page.tsx`) utilise un useEffect pour le countdown des steps time-based. Une logique "skip one frame" existe : quand `currentStepIndex !== lastStepIndexRef.current`, l'effet retourne sans créer l'intervalle, pour laisser l'effet d'init (`[currentStep]`) mettre à jour `timeLeft` avant de démarrer le décompte. Au replay, `currentStepIndex` passe du dernier index à 0, donc on entre dans ce branch, on met à jour `lastStepIndexRef`, on return — mais aucune mise à jour d'état n'est faite, donc l'effet ne se ré-exécute pas et l'intervalle n'est jamais créé.

## Goals / Non-Goals

**Goals :**
- Corriger le bug pour que le premier timer démarre correctement après un clic sur "Refaire une boucle".
- Conserver la logique "skip one frame" pour les transitions normales (avancement d'un step à l'autre) afin d'éviter les valeurs stale de `timeLeft`.

**Non-Goals :**
- Refactorer l'architecture du timer.
- Modifier le flux de préparation ou l'écran de fin.

## Decisions

**Décision : synchroniser `timeLeft` lors du return early pour forcer un re-render**

Lorsqu'on détecte une transition d'étape (`currentStepIndex !== lastStepIndexRef.current`), au lieu de simplement retourner, on appelle `setTimeLeft` avec la durée du step courant (work/time ou rest). Cela provoque un re-render, l'effet se ré-exécute, et cette fois `currentStepIndex === lastStepIndexRef.current`, donc l'intervalle est créé.

Alternatives considérées :
- **Remonter `lastStepIndexRef` dans les deps** : complexe, risque de boucles.
- **Utiliser un compteur "reset" incrémenté au replay** : ajoute de l'état superflu.
- **Supprimer le "skip one frame"** : risquerait d'utiliser un `timeLeft` stale lors des transitions normales (avancement via `advanceStep`).

## Risks / Trade-offs

- **[Risque]** Duplication de la logique d'init de `timeLeft` (déjà dans l'effet `[currentStep]`) → **Mitigation** : on réutilise la même formule (work/time → duration, rest → duration) dans le branch de transition. Si la structure des steps change, les deux endroits devront être mis à jour.
- **[Trade-off]** On fait un `setTimeLeft` supplémentaire lors de chaque transition d'étape → impact négligeable (un seul re-render de plus).
