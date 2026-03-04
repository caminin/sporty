## 1. Session utils – scaling

- [x] 1.1 Ajouter le paramètre `intensity` (défaut 1.0) à `estimateSessionDuration` et appliquer `Math.round(value * intensity)` aux reps et durées
- [x] 1.2 Ajouter le paramètre `intensity` et `selectedIds` à `buildSessionSteps` (ou créer une variante qui filtre par selectedIds et scale), appliquer le scaling aux steps work avant de les pousser

## 2. Page d'accueil – état et flux

- [x] 2.1 Remonter l'état `intensity` de `IntensityControl` au parent via `onIntensityChange`, stocker dans le state de `BadmintonSessionPage`
- [x] 2.2 Passer `intensity` à `SessionSummary` et à `estimateSessionDuration` pour la durée estimée
- [x] 2.3 Passer `intensity` à `ExerciseGroupBlock` et afficher les valeurs scalées (reps ou durée) par exercice
- [x] 2.4 Passer `intensity` à `FloatingActionButton` et l'utiliser dans `buildSessionSteps` + `encodeSession` au lancement

## 3. buildSessionSteps

- [x] 3.1 Ajouter le paramètre optionnel `intensity` (défaut 1.0) à `buildSessionSteps`, appliquer `Math.round(value * intensity)` aux duration et reps des steps work
