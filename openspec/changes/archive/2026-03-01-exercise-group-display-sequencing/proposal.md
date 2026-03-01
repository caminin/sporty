## Why

L'utilisateur souhaite améliorer l'expérience du workflow d'entraînement en rendant plus claire la structure de la séance et en optimisant la séquence des exercices. Actuellement, l'application ne montre pas clairement quel groupe musculaire est travaillé ni quel sera le prochain exercice, ce qui peut créer de la confusion lors de l'entraînement. De plus, la séquence des exercices pourrait être optimisée pour éviter de solliciter le même groupe musculaire consécutivement.

## What Changes

- Ajout de l'affichage du groupe musculaire pour l'exercice en cours dans l'interface timer
- Ajout d'un aperçu compact du prochain exercice
- Modification de l'algorithme de construction de séquence pour maximiser l'alternance entre groupes musculaires différents

## Capabilities

### New Capabilities
- `exercise-group-display`: Affichage du groupe musculaire de l'exercice actuel et aperçu du prochain exercice dans l'interface timer
- `optimized-exercise-sequencing`: Algorithme de séquençage des exercices qui maximise l'alternance entre groupes musculaires

### Modified Capabilities
- `workout-session-flow`: Modification de la logique de construction de séquence pour utiliser le nouvel algorithme optimisé

## Impact

- Interface timer : ajout d'éléments visuels pour afficher le groupe et l'aperçu
- Logique de construction de session : modification de l'algorithme de séquençage
- Pas d'impact sur les APIs existantes ou les dépendances externes