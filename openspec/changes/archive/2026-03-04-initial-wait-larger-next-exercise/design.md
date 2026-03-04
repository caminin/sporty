## Context

Actuellement, la phase de préparation (5 secondes) s'affiche avant chaque exercice de travail sauf le premier. L'utilisateur souhaite l'inverse : une attente uniquement au tout début de la séance pour se préparer, puis un flux continu sans interruption entre les exercices. Par ailleurs, le composant `NextExercisePreview` utilise des tailles de police modestes (`text-lg` pour le nom) qui le rendent peu visible pendant l'exercice.

## Goals / Non-Goals

**Goals:**
- Afficher l'écran de transition avec compte à rebours uniquement avant le premier exercice de la séance
- Supprimer la phase de préparation entre les exercices suivants
- Agrandir l'affichage du prochain exercice (nom et groupe) pour une meilleure lisibilité

**Non-Goals:**
- Modifier la durée du compte à rebours (reste 5 secondes)
- Changer le composant ExerciseTransitionDisplay lui-même
- Ajouter des options de personnalisation

## Decisions

**Condition d'affichage de la préparation :**
Inverser la logique dans `advanceStep` : afficher "preparing" uniquement quand `workStepsBeforeNext === 0` (c'est le premier exercice). Pour les exercices suivants, passer directement en "running".

**État initial de la session :**
Si le premier step de la séance est un exercice de travail, initialiser `sessionState` à "preparing" au lieu de "running" pour afficher l'écran de transition dès le chargement. Si le premier step est un repos, garder "running" ; quand le repos se termine et qu'on avance vers le premier exercice, `workStepsBeforeNext === 0` déclenchera "preparing".

**Taille du NextExercisePreview :**
Augmenter les tailles de police : nom de l'exercice de `text-lg` à `text-2xl` ou `text-3xl`, label "Suivant" et groupe proportionnellement. Conserver le conteneur et le style visuel existant.

## Risks / Trade-offs

- **Replay** : `handleReplay` remet `sessionState` à "running". Si le premier step est work, il faudra remettre en "preparing" pour cohérence. [Risk] → Vérifier et adapter handleReplay si nécessaire.
- **Lisibilité sur petits écrans** : Un NextExercisePreview plus grand peut réduire l'espace pour le timer. [Risk] → Tester sur mobile ; `text-2xl` ou `text-3xl` reste raisonnable.
