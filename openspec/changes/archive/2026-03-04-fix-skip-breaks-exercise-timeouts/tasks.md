## 1. Correction de la race condition

- [x] 1.1 Ajouter une ref `lastStepIndexRef` pour suivre le step courant du countdown
- [x] 1.2 Dans l'effet de countdown (l.178–203), ajouter une garde : si `currentStepIndex !== lastStepIndexRef.current`, mettre à jour la ref, ne pas créer l'intervalle, et retourner
- [x] 1.3 Mettre à jour `lastStepIndexRef.current = currentStepIndex` quand on lance l'intervalle (après la garde de transition)

## 2. Tests du comportement skip → prochain step

- [x] 2.1 Ajouter `@testing-library/react`, `@testing-library/jest-dom` et `jest-environment-jsdom` si absents
- [x] 2.2 Créer `app/timer/__tests__/skip-preserves-next-step-timer.test.tsx` avec `jest.useFakeTimers()`
- [x] 2.3 Test : skip d'un work (45s) vers un rest (30s) → le countdown affiché doit être 30
- [x] 2.4 Test : skip d'un rest (30s) vers un work (45s) → le countdown affiché doit être 45
- [x] 2.5 Test : skip pendant la préparation → l'exercice suivant démarre avec sa durée correcte
