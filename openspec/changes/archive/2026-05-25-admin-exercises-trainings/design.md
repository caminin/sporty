## Context

Aujourd’hui chaque « liste » (`ExerciseList`) embarque un `WorkoutConfig` complet : catalogue `exercises` + `groups` (groupes de séance nommés). L’admin a deux onglets (**Liste d’exercices** / **Listes de groupes**) avec sélecteur de liste sur les deux. Les fichiers `exercice_list/global.json` et `dynamisme-jambes-mollets-core.json` dupliquent le catalogue. Le seed `default-seed.json` a été retiré ; il n’y a pas de reset vers des données build.

L’utilisateur veut : catalogue **global** ; **entraînements** = compositions d’exercices affichées par **groupe musculaire** ; deux onglets admin ; assets versionnés dans l’image Docker + bouton **Réinitialiser**.

## Goals / Non-Goals

**Goals:**

- Catalogue unique persisté (`catalog.json` ou store dédié), CRUD onglet **Exercices** sans notion de liste.
- Entraînements (`Training` / ex-`ExerciseList`) : métadonnées + `globalRestTime` + liste plate `exerciseRefs[]` ; admin onglet **Entraînements** groupé par `muscleGroup` (lecture catalogue).
- Deux entraînements seed : `global`, `dynamisme-jambes-mollets-core`.
- Fichiers repo : `exercice_list/catalog.json` + `exercice_list/entrainement-*.json`.
- Build Docker : copier `exercice_list/` dans l’image (ex. `public/bundled-exercice-list/` ou `bundled/exercice_list/`).
- Reset admin : recharger catalogue + les deux entraînements depuis le bundle build (écrase données runtime).
- Libellés UI : Exercices / Entraînements ; « liste » → « entraînement » côté utilisateur.
- Séance : résolution via catalogue global + refs de l’entraînement actif ; libellé de « groupe » en séance = `muscleGroup` (libellé français existant).

**Non-Goals:**

- Rétrocompatibilité : pas de lecture ni conversion des anciens JSON (`global.json`, `WorkoutConfig` avec `groups`, import combiné, etc.) — uniquement le nouveau format.
- Création de groupes de séance nommés dans l’UI.
- Plus de trois onglets ou onglet Import/Export dédié.
- Scan automatique de `manual-lists/` au boot (inchangé).

## Decisions

### 1. Stockage : catalogue global + entraînements légers

**Choix** : `DATA_DIR/catalog.json` pour `Record<string, ExerciseDefinition>` ; `DATA_DIR/exercise-lists/{trainingId}.json` pour `{ id, name, globalRestTime, exerciseRefs, createdAt, updatedAt }` sans `exercises`.

**Alternatives** : garder catalogue dans chaque liste — rejeté (duplication, confusion admin).

**API** : `getGlobalCatalog()`, `saveGlobalCatalog()`, `getTraining(id)`, `listTrainings()`, etc. Les actions serveur actuelles sur `WorkoutConfig` sont scindées.

### 2. Suppression de `WorkoutConfig.groups` au niveau entraînement

**Choix** : `exerciseRefs: GroupExerciseRef[]` ordonnée ; admin affiche par sections `muscleGroup` (dérivé du catalogue). Import entraînement = JSON `{ globalRestTime?, exerciseRefs }` ou `{ exerciseRefs }` avec validation `exerciseId` ∈ catalogue.

**Séance** : `buildSessionSteps` / sélection homepage utilisent `exerciseRefs` dans l’ordre du tableau ; champ `group` des steps = libellé `muscleGroup` (ex. `jambes`). L’algorithme d’entrelacement existant par nom de groupe de séance est remplacé par entrelacement par `muscleGroup` (même logique, clé = muscle group).

**Alternatives** : conserver `groups` en interne — rejeté (terminologie et modèle utilisateur).

### 3. Fichiers `exercice_list/`

```
exercice_list/
  catalog.json              # { exercises: { ... } }
  entrainement-global.json  # { name, globalRestTime, exerciseRefs: [...] }
  entrainement-dynamisme-jambes-mollets-core.json
```

Identifiants stables : `training_global`, `training_dynamisme` (ou dérivés du nom de fichier — à figer en implémentation).

### 4. Bundle build + reset

**Choix** :

- Au `npm run build` : copier `exercice_list/` vers `public/bundled-exercice-list/` (ou script dédié).
- `Dockerfile` : `COPY public/bundled-exercice-list` (ou copie directe `exercice_list` dans l’image runner).
- `resetToBundledDefaults()` (server action) : lit les JSON du bundle, écrit `catalog.json` + recrée/remplace les deux fichiers entraînement.
- Bouton **Réinitialiser** sur l’onglet **Entraînements** (confirmation modale).

**Alternatives** : seed TypeScript embarqué — rejeté (l’utilisateur veut les fichiers JSON versionnés).

### 5. Admin UI

| Onglet | Contenu |
|--------|---------|
| **Exercices** | CRUD catalogue, sections muscleGroup, import/export catalogue seul |
| **Entraînements** | Liste entraînements, sélecteur actif, repos global, refs par muscleGroup, import/export entraînement, reset bundle |

Renommer composants : `CatalogTab` → `ExercisesTab`, `GroupsTab` → `TrainingsTab`. Retirer `ListSelector` de l’onglet Exercices.

### 6. Import manuel dossier

Un fichier dans `manual-lists/` doit être catalogue seul (`exercises`) ou entraînement seul (`exerciseRefs`). Tout autre schéma est rejeté avec erreur explicite — pas de conversion.

### 7. Contexte React / homepage

`ExerciseListContext` → renommer en `TrainingContext` (ou garder le nom technique mais libellés « entraînement »). `selectedListId` → `selectedTrainingId`.

## Risks / Trade-offs

**[Perte des groupes de séance nommés]** → Ordre = `exerciseRefs` + entrelacement par `muscleGroup` ; les deux entraînements bundle sont réécrits à la main au nouveau format.

**[Catalogue global : suppression d’un exo référencé]** → Bloquer suppression si `exerciseId` présent dans au moins un entraînement (message listant les entraînements).

**[Reset destructif]** → Confirmation obligatoire ; n’affecte pas les fichiers git, seulement `DATA_DIR`.

**[Volume Docker]** → Négligeable (quelques Ko JSON).

## Implémentation (sans rétrocompat)

1. Remplacer `exercice_list/` par `catalog.json` + deux `entrainement-*.json` (contenu réécrit, pas de conversion depuis l’ancien format).
2. Supprimer le code et les types liés à `WorkoutConfig.groups`, listes avec catalogue embarqué, parsers legacy.
3. Brancher persistance, admin, homepage, séance, build bundle, reset.
4. Mettre à jour tests et skill sur le seul nouveau schéma.

## Open Questions

- Faut-il permettre **plus de deux** entraînements créés en UI (hors bundle) ? → **Oui** ; seuls deux sont restaurés par **Réinitialiser**.
