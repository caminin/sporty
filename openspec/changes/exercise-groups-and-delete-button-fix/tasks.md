## 1. Rendu des groupes en Entraînements

- [x] 1.1 Identifier et isoler la source canonique des `MuscleGroupKey` utilisée pour construire les sections de l'onglet Entraînements.
- [x] 1.2 Modifier le rendu de l'onglet Entraînements pour afficher toutes les sections de groupes autorisés, y compris quand elles sont vides.
- [x] 1.3 Ajouter un état vide par section qui conserve le contrôle d'ajout d'exercice dans le groupe concerné.

## 2. Ajout d'exercice dans groupe vide

- [x] 2.1 Vérifier que le sélecteur d'ajout est bien filtré par `muscleGroup` même sans exercice existant dans la section.
- [x] 2.2 Corriger le flux d'ajout si nécessaire pour permettre l'ajout du premier exercice dans un groupe vide.
- [x] 2.3 Valider que l'exercice ajouté apparaît immédiatement dans la section du groupe après persistence.

## 3. Correction du bouton de suppression catalogue

- [x] 3.1 Tracer le chemin UI -> action de suppression pour confirmer que le bouton transmet l'`exerciseId` exact de la ligne ciblée.
- [x] 3.2 Corriger le binding/handler de suppression et la mise à jour d'état UI post-suppression.
- [x] 3.3 Vérifier que le blocage de suppression d'un exercice référencé reste inchangé et correctement affiché.

## 4. Couverture de tests

- [x] 4.1 Ajouter ou adapter des tests de rendu Entraînements pour garantir la présence des sections de groupes vides.
- [x] 4.2 Ajouter ou adapter des tests d'ajout d'exercice dans un groupe initialement vide.
- [x] 4.3 Ajouter ou adapter des tests de suppression catalogue (cas succès non référencé, cas bloqué référencé, ciblage correct de la ligne).
