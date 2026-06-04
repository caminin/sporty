## 1. Fichiers `exercice_list/` (nouveau format uniquement)

- [x] 1.1 Rédiger `exercice_list/catalog.json` (catalogue global complet)
- [x] 1.2 Rédiger `exercice_list/entrainement-global.json` (`exerciseRefs`, `globalRestTime`)
- [x] 1.3 Rédiger `exercice_list/entrainement-dynamisme-jambes-mollets-core.json`
- [x] 1.4 Supprimer `exercice_list/global.json` et `dynamisme-jambes-mollets-core.json`

## 2. Modèle et persistance serveur

- [x] 2.1 Types `GlobalCatalog`, `Training` (`exerciseRefs[]`) — retirer `WorkoutConfig.groups` et catalogue par liste
- [x] 2.2 Persistance `DATA_DIR/catalog.json`
- [x] 2.3 `lists.ts` : entraînements sans `exercises` ni `groups` ; résolution via catalogue global
- [x] 2.4 Actions serveur catalogue / entraînement ; supprimer parsers et chemins legacy
- [x] 2.5 `resetToBundledDefaults()` depuis le bundle build
- [x] 2.6 Import admin : uniquement JSON catalogue ou entraînement (erreur sinon)

## 3. Build et Docker

- [x] 3.1 Copier `exercice_list/` vers `public/bundled-exercice-list/` au build
- [x] 3.2 `Dockerfile` / `docker-entrypoint.sh` : bundle + init volume vide

## 4. Admin UI

- [x] 4.1 Onglets **Exercices** / **Entraînements** (`page.tsx`)
- [x] 4.2 `ExercisesTab` : catalogue global, sans sélecteur d’entraînement
- [x] 4.3 `TrainingsTab` : entraînements, refs par `muscleGroup`, import/export, **Réinitialiser**
- [x] 4.4 Import/export séparés (catalogue vs entraînement)

## 5. Application et séance

- [x] 5.1 Contexte et homepage : terminologie entraînement + catalogue global
- [x] 5.2 `session-utils.ts` : `exerciseRefs` + entrelacement `muscleGroup`
- [x] 5.3 Estimation durée et sélection exercices

## 6. Tests et documentation

- [x] 6.1 Tests sur nouveau schéma uniquement (pas de fixtures legacy)
- [x] 6.2 Mettre à jour `create-exercise-list` SKILL.md
- [x] 6.3 Archiver le change `admin-three-tabs` s’il est encore ouvert
