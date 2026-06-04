## Why

Dans l'onglet **Entraînements**, il est actuellement impossible d'ajouter un exercice d'un groupe musculaire absent de la liste active, car la section du groupe n'est pas affichée tant qu'elle est vide. En plus, le bouton de suppression d'exercice dans l'admin ne supprime pas réellement l'exercice attendu, ce qui bloque la maintenance du catalogue.

## What Changes

- Afficher toutes les sections de groupes musculaires autorisées dans les listes d'entraînement, y compris quand une section est vide.
- Permettre l'ajout d'exercices depuis une section vide via le sélecteur de groupe correspondant.
- Corriger le flux de suppression d'exercice pour que le bouton **Delete/Supprimer** déclenche bien la suppression effective quand les préconditions sont remplies.
- Conserver les garde-fous existants (blocage de suppression si l'exercice est encore référencé par un entraînement).

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `exercise-muscle-group-catalog`: les sections de groupes côté entraînements ne doivent plus dépendre de la présence préalable d'exercices.
- `group-settings`: l'onglet Entraînements doit toujours exposer tous les groupes pour permettre l'ajout ciblé.
- `exercise-catalog`: l'action de suppression depuis l'onglet Exercices doit fonctionner de bout en bout.

## Impact

- UI admin: `app/group-settings/GroupsTab.tsx`, composants de sélection/affichage de sections, bouton de suppression dans l'onglet Exercices.
- Domaine et actions: `app/exercises/actions.ts`, `app/exercises/lists-actions.ts`, éventuels helpers de résolution de références.
- Tests: scénarios de suppression, affichage des groupes vides et ajout d'exercices depuis groupe vide.
