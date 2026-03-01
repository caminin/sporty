## 1. Création de la structure de base

- [x] 1.1 Créer la page principale dans `app/badminton/page.tsx`
- [x] 1.2 Copier les styles de base globaux si nécessaires dans `tailwind.config.ts` (ou équivalent global) et vérifier que les couleurs "primary" (#13ec5b) ou "background-dark" (#0a0f0d) sont définies

## 2. Découpage en composants

- [x] 2.1 Créer le composant `Header` et l'intégrer avec la barre du haut
- [x] 2.2 Créer le composant `IntensityControl` incluant le slider
- [x] 2.3 Créer le composant `SessionSummary` pour afficher Durée, Repos, Difficulté
- [x] 2.4 Créer le composant `ExerciseBlockItem` (qui représente une ligne de la liste d'exercices)
- [x] 2.5 Créer le composant `FloatingActionButton` pour le bouton "Lancer la séance" en bas

## 3. Assemblage de la page

- [x] 3.1 Intégrer les composants dans la page principale `app/badminton/page.tsx`
- [x] 3.2 Construire la liste des blocs d'exercices avec les données du HTML original et les rendre via une boucle
- [x] 3.3 Vérifier le comportement responsive et la compatibilité du mode sombre (dark mode)

## 4. Finalisation

- [x] 4.1 Retirer le code mort et les imports inutilisés
- [x] 4.2 Vérifier qu'il n'y a pas d'erreurs d'attributs HTML en jsx (ex: `class` -> `className`, champs de formulaire, etc)
- [x] 4.3 Tester visuellement la page pour s'assurer qu'elle correspond parfaitement au fichier statique HTML
