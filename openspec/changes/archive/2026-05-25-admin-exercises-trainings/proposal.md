## Why

L’admin mélange encore **catalogue**, **listes** et **groupes de séance** dans une même notion de « liste active », alors que le catalogue est désormais **global** et les entraînements ne sont que des compositions d’exercices. La terminologie (« liste », « groupes », onglets catalogue/groupes) ne correspond plus au modèle mental : un exercice appartient au catalogue partagé ; un **entraînement** choisit quels exercices inclure, affichés par **groupe musculaire**. Les fichiers `exercice_list/*.json` dupliquent le catalogue dans chaque fichier, et il n’existe plus de reset fiable vers des données versionnées embarquées dans l’image de build.

## What Changes

- **BREAKING** : la page admin (`/group-settings`) n’expose plus que **deux onglets** — **Exercices** et **Entraînements** — avec libellés et périmètres alignés sur le nouveau vocabulaire.
- **Onglet Exercices** : CRUD du **catalogue global** (nom, type, valeur, `muscleGroup`) ; affichage par groupe musculaire ; import/export catalogue ; **aucun** sélecteur de liste, suppression de liste, ni notion d’« liste active » dans cet onglet.
- **Onglet Entraînements** : liste des **entraînements** (ex-listes) ; création, suppression, sélection de l’entraînement actif ; temps de repos global ; gestion des exercices de l’entraînement (ajout/retrait via références catalogue) **affichés et organisés par groupe musculaire** ; import/export JSON d’un entraînement ; bouton **Réinitialiser** qui restaure catalogue + entraînements depuis les fichiers embarqués au build.
- **BREAKING** : restructuration `exercice_list/` — un fichier **catalogue** partagé (`catalog.json` ou équivalent) + **deux fichiers entraînement** (`global`, `dynamisme-jambes-mollets-core`) sans duplication du catalogue dans chaque entraînement.
- **BREAKING** : un entraînement ne porte plus de **groupes de séance** nommés (*Cardio*, *Explosivité*) ; il contient une **liste plate de références** (`exerciseId` / `refId`) ; l’UI et la séance résolvent le groupe musculaire via le catalogue.
- **Build** : les fichiers `exercice_list/` (catalogue + entraînements) sont **copiés dans l’image Docker** au build ; le reset admin et l’initialisation d’un volume vide s’appuient sur ces assets.
- Renommage UI et code : « liste » → « entraînement », « liste d’exercices » → « Exercices », « listes de groupes » → « Entraînements » (libellés français cohérents).
- **Pas de rétrocompat** : suppression directe de l’ancien modèle (listes avec catalogue embarqué, `groups`, anciens fichiers `exercice_list/*.json`) — pas de migration ni conversion runtime.
- Mise à jour des tests, du skill `create-exercise-list`, du `Dockerfile` et des specs impactées.

## Capabilities

### New Capabilities

- `global-exercise-catalog` : stockage et API d’un catalogue d’exercices **unique** (hors entraînement), CRUD admin, import/export catalogue seul.
- `workout-trainings` : entité **entraînement** (ex-liste) avec références catalogue, repos global, affichage admin par `muscleGroup`, CRUD entraînements.
- `bundled-trainings-reset` : assets `exercice_list/` embarqués au build ; action **Réinitialiser** qui recharge catalogue + les deux entraînements par défaut.

### Modified Capabilities

- `group-settings` : deux onglets Exercices / Entraînements ; catalogue global sans sélecteur de liste ; reset vers bundles build.
- `exercise-catalog` : catalogue global (plus lié à une liste).
- `exercise-muscle-group-catalog` : inchangé sur le schéma ; périmètre admin = onglet Exercices uniquement.
- `catalog-export-import-merge` : import/export catalogue global ; import/export entraînement (références + `globalRestTime`, sans `exercises` embarqués).
- `json-import-list` : création d’entraînement via import ; formats séparés catalogue vs entraînement.
- `exercise-list-tooling` : skill et templates `exercice_list/` (catalogue + 2 entraînements).
- `list-system-testing` : scénarios catalogue global, entraînements, reset bundle.
- `manual-list-import-folder` : import fichier entraînement (sans catalogue dupliqué) + import catalogue si applicable.
- `group-exercise-references` : références au niveau entraînement (plus dans un groupe de séance nommé).
- `session-exercise-selection` : sélection basée sur l’entraînement actif et le catalogue global.
- `home-page-exercise-management` : libellés entraînement ; pas de catalogue par liste.
- `workout-session-flow` : séquençage sans groupes de séance nommés (ordre par sections musculaires ou ordre des références — précisé en design).
- `default-list-seed` : remplacé conceptuellement par reset depuis bundles build (delta spec : retirer « seed supprimé », documenter reset bundle).

## Impact

- `app/group-settings/page.tsx`, `CatalogTab.tsx`, `GroupsTab.tsx` (renommage / refonte → `ExercisesTab`, `TrainingsTab`)
- `app/exercises/types.ts`, `workout-config.ts`, `actions.ts`, `lists.ts`, `lists-actions.ts`
- `exercice_list/` : `catalog.json` + `entrainement-global.json` + `entrainement-dynamisme-jambes-mollets-core.json` (noms finaux en design)
- `Dockerfile`, `docker-entrypoint.sh` (copie assets build)
- `app/session-utils.ts`, `app/page.tsx`, contextes liste/entraînement
- Tests : `app/__tests__/entities/exercise-lists/`, `app/exercises/__tests__/`
- `.cursor/skills/create-exercise-list/SKILL.md`
- Specs OpenSpec listées ci-dessus
