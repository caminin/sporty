## 1. Domaine — parse, export, validation

- [x] 1.1 Ajouter `exportCatalogToJson` et `exportGroupsToJson` dans `workout-config.ts`
- [x] 1.2 Ajouter `parseCatalogJson` et `parseGroupsJson` avec messages d'erreur en français
- [x] 1.3 Ajouter `collectOrphanGroupReferences(config)` retournant les paires (groupe, exerciseId)
- [x] 1.4 Modifier `mergeImportedConfig` ou extraire `mergeImportedGroups` : échec explicite si référence orpheline (plus de filtrage silencieux)
- [x] 1.5 Implémenter `applyCatalogImport(local, imported, replaceAll)` avec validation post-replace des refs de groupes

## 2. Actions serveur

- [x] 2.1 Ajouter `importCatalogFromJson` dans `lists-actions.ts` (création liste + merge/replace sur listId)
- [x] 2.2 Ajouter `importGroupsFromJson` dans `lists-actions.ts` (liste active obligatoire)
- [x] 2.3 Conserver `importListFromJson` pour `importListFromManualFolder` uniquement ; retirer son usage UI
- [x] 2.4 Exposer les erreurs de validation (refs orphelines, format) en messages lisibles côté client

## 3. UI admin — deux onglets

- [x] 3.1 Supprimer l'onglet I/O et `ImportExportTab.tsx` dans `page.tsx`
- [x] 3.2 Créer composant partagé `JsonImportExportPanel` (collage, fichier, export clipboard, erreur inline)
- [x] 3.3 Intégrer import/export catalogue dans `CatalogTab` (création liste si vide, confirm replaceAll)
- [x] 3.4 Intégrer import/export groupes dans `GroupsTab` (désactivé sans liste / catalogue vide)
- [x] 3.5 Retirer `onGoToImport` et les boutons « Aller à Import / Export » des deux onglets

## 4. Tests

- [x] 4.1 Tests unitaires `workout-config` : export/parse séparés, rejet refs orphelines, replaceAll
- [x] 4.2 Tests `lists-actions` : import catalogue (nouvelle liste + merge + replace), import groupes (succès + échec)
- [x] 4.3 Mettre à jour les tests d'intégration listes si des scénarios utilisent l'ancien flux UI/export combiné

## 5. Documentation

- [x] 5.1 Mettre à jour `.cursor/skills/create-exercise-list/SKILL.md` (deux formats JSON catalogue / groupes)
- [x] 5.2 Vérifier que les fichiers `exercice_list/*.json` restent compatibles import manuel dossier (fichier complet)
