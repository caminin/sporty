## 1. Simplification du formulaire d'import

- [x] 1.1 Identifier dans `app/group-settings/page.tsx` (et composants lies) le controle correspondant au bouton "fichier manuel".
- [x] 1.2 Supprimer ce controle de l'UI tout en conservant les champs "nom de liste", "JSON", le bouton de selection de fichier et l'action d'import.
- [x] 1.3 Verifier que les handlers d'import existants restent connectes au flux principal sans regressions.

## 2. Verification et stabilisation

- [x] 2.1 Mettre a jour les tests UI/integration affectes par la suppression du bouton.
- [x] 2.2 Executer les tests cibles autour de la gestion des listes/import JSON.
- [ ] 2.3 Effectuer une verification manuelle rapide du parcours admin: saisir nom, coller JSON, selectionner un fichier, importer.
