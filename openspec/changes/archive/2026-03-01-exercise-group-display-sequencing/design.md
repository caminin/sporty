## Context

L'application sporty permet aux utilisateurs de créer des séances d'entraînement composées d'exercices organisés par groupes musculaires. Actuellement, pendant la séance, l'utilisateur ne voit que le nom de l'exercice en cours et le temps restant, sans indication du groupe musculaire travaillé ni aperçu du prochain exercice. De plus, la séquence des exercices suit simplement l'ordre des groupes dans le fichier de configuration, ce qui peut aboutir à des séquences où le même groupe musculaire est sollicité consécutivement.

## Goals / Non-Goals

**Goals:**
- Afficher clairement le groupe musculaire de l'exercice en cours dans l'interface timer
- Montrer un aperçu compact du prochain exercice pour améliorer la préparation mentale
- Optimiser la séquence des exercices pour maximiser l'alternance entre groupes musculaires différents
- Maintenir la compatibilité avec la structure de données existante

**Non-Goals:**
- Modifier la structure des données d'exercice ou de configuration
- Ajouter des fonctionnalités de personnalisation avancées de séquence
- Changer l'interface utilisateur de configuration des séances

## Decisions

**Affichage du groupe musculaire :**
Utiliser un badge discret en haut de l'écran timer, sous le nom de l'exercice, avec un style visuel distinctif (couleur de fond légère, police plus petite). Le groupe sera extrait du champ `group` déjà présent dans `SessionStep`.

**Aperçu du prochain exercice :**
Afficher en bas de l'écran un élément compact montrant "Suivant: [nom de l'exercice]" avec le groupe en plus petite taille. Cet aperçu sera visible uniquement pendant les phases de repos et de travail, masqué pendant les transitions.

**Algorithme de séquençage optimisé :**
Implémenter un algorithme glouton qui :
1. Commence par un exercice de chaque groupe pour établir une base
2. À chaque étape, sélectionne l'exercice du groupe le plus éloigné dans la séquence actuelle
3. Utilise une métrique de "distance" basée sur le nombre d'exercices depuis le dernier du même groupe

Cette approche garantit une alternance maximale sans complexité algorithmique excessive.

**Structure des composants :**
- `CurrentExerciseDisplay` : composant pour afficher l'exercice actuel avec son groupe
- `NextExercisePreview` : composant pour l'aperçu du prochain exercice
- `OptimizedSequencer` : utilitaire pour réorganiser la séquence d'exercices

## Risks / Trade-offs

**Performance :** L'algorithme de séquençage optimisé ajoute une complexité O(n²) dans le pire cas, mais avec des séances typiques de 10-20 exercices, l'impact est négligeable.

**Prédictibilité :** Les utilisateurs habitués à l'ordre séquentiel des groupes pourraient être surpris par le nouvel ordre. → Mitigation : ajouter une option pour revenir à l'ordre original si demandé.

**Complexité visuelle :** L'ajout d'informations à l'écran timer pourrait distraire. → Mitigation : design minimaliste et discret, test utilisateur pour valider l'UX.