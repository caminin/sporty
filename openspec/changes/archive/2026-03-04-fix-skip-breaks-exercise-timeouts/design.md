## Context

Dans `app/timer/page.tsx`, deux effets gèrent le temps :

1. **Effet d’initialisation** (l.83–93) : met à jour `timeLeft` quand `currentStep` change
2. **Effet de countdown** (l.178–203) : lance un `setInterval` qui décrémente `timeLeft` et appelle `advanceStep` à 0

Quand l’utilisateur appuie sur « Passer », `advanceStep()` met à jour `currentStepIndex` et `sessionState`. Les deux effets s’exécutent dans le même cycle de commit. L’effet d’init appelle `setTimeLeft(newDuration)`, mais React n’a pas encore appliqué cette mise à jour quand l’effet de countdown s’exécute. Celui-ci lit donc l’ancien `timeLeft` et démarre un intervalle avec une valeur obsolète.

## Goals / Non-Goals

**Goals :**
- Garantir que le countdown du step suivant démarre toujours avec la durée correcte après un skip
- Ajouter des tests qui reproduisent et valident ce comportement

**Non-Goals :**
- Refactorer toute la logique du timer
- Modifier le comportement du bouton « Passer » pendant la préparation (déjà correct)

## Decisions

### 1. Détection de la transition de step

**Choix :** Utiliser une ref `lastStepIndexRef` pour détecter quand on vient de changer de step. Si `currentStepIndex !== lastStepIndexRef.current`, on considère qu’on est en transition et on ne lance pas l’intervalle. On met à jour la ref après la transition.

**Alternatives :**
- Synchroniser `timeLeft` dans `advanceStep` : dupliquerait la logique et compliquerait le flux
- Utiliser `flushSync` : forcer un rendu synchrone est risqué et peu idiomatique en React

**Rationale :** Simple, sans effet de bord, et évite la race condition en attendant le prochain rendu où `timeLeft` sera correct.

### 2. Ordre des effets

**Choix :** L’effet de countdown vérifie d’abord `currentStepIndex === lastStepIndexRef.current`. Si non, on met à jour la ref et on retourne sans créer l’intervalle. Au rendu suivant, `timeLeft` aura été mis à jour par l’effet d’init, et la ref sera alignée.

**Rationale :** Un seul cycle de rendu supplémentaire suffit pour que `timeLeft` soit cohérent avec `currentStep`.

### 3. Tests

**Choix :** Tests unitaires / intégration avec `@testing-library/react` et `jest.useFakeTimers()` pour simuler le passage du temps et vérifier que le countdown du step suivant démarre à la bonne valeur après un skip.

**Rationale :** Reproductible, rapide, et couvre le scénario exact du bug.

## Risks / Trade-offs

- **[Ref non synchronisée]** → S’assurer de mettre à jour `lastStepIndexRef` dans tous les chemins (skip, fin automatique, replay)
- **[Tests avec fake timers]** → Bien nettoyer les timers entre les tests pour éviter les fuites
