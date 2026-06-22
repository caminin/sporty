## 1. Modèle et génération de séance

- [x] 1.1 Ajouter `seriesIndex?` et `seriesTotal?` sur les steps `work` dans `types.ts`
- [x] 1.2 Renseigner ces champs dans `buildSessionSteps` quand `series >= 2`
- [x] 1.3 Tests `session-utils` : métadonnées série sur steps expandés et encodage/décodage

## 2. Composants UI

- [x] 2.1 Créer `SeriesProgressBadge` (affichage `Série X/Y` / compact `X/Y`)
- [x] 2.2 Intégrer le badge dans `timer/page.tsx` (work + header)
- [x] 2.3 Libellé repos contextualisé entre séries du même exercice
- [x] 2.4 Étendre `NextExercisePreview` pour la série suivante du même exercice
- [x] 2.5 Afficher la série sur `ExerciseTransitionDisplay` (préparation premier exercice)

## 3. Mise en page

- [x] 3.1 Ajuster hiérarchie titre / badge groupe / badge série / chrono pour mobile
- [x] 3.2 Vérifier lisibilité avec exercices longs et 3+ séries

## 4. Vérification

- [x] 4.1 Tests timer : badge visible sur step multi-séries, absent sur série unique
- [x] 4.2 Lancer les tests concernés
- [x] 4.3 Vérifier manuellement une séance Pompes × 3 : affichage 1/3 → repos → 2/3 → repos → 3/3
