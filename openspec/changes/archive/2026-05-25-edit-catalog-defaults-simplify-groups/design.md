## Context

L’admin `/group-settings` est déjà découpé en trois onglets (catalogue, groupes de séance, import/export). Le catalogue affiche les exercices par `muscleGroup` mais ne permet d’éditer que ce champ après création. L’onglet groupes permet de créer des groupes de séance, de surcharger `value` sur chaque référence, et d’ajouter depuis tout le catalogue. L’import propose aussi un formulaire « nouvelle liste vide ». L’utilisateur configure les listes via JSON dans `exercice_list/` et veut une UI minimale : ajuster les défauts catalogue, composer les groupes existants, importer.

## Goals / Non-Goals

**Goals:**

- Éditer `type` et `value` (durée/reps par défaut) sur chaque ligne du catalogue.
- Afficher les exercices d’un groupe de séance en sous-sections par `muscleGroup` (même ordre `MUSCLE_GROUPS`, tri alphabétique dans chaque section).
- Ajouter un exercice à un groupe uniquement depuis la sous-section du muscle group concerné (picker filtré).
- Retirer création de groupe de séance, surcharge de valeur, et création de liste vide dans l’UI.
- Conserver import/export JSON, repos global, suppression de listes, ajout/retrait de références.

**Non-Goals:**

- Ajouter un champ `muscleGroup` sur l’entité `Group` (session) — le filtrage repose sur la section UI / le `muscleGroup` des entrées catalogue.
- Supprimer `value?` du schéma TypeScript ou du merge import (compatibilité JSON existante).
- Changer le flux séance / page d’accueil au-delà de ce que la résolution catalogue impose déjà.
- Réordonner manuellement les exercices dans un groupe (ordre = ordre des références dans le JSON ; affichage regroupé visuellement).

## Decisions

### 1. Édition catalogue inline

**Choix :** Réutiliser `updateCatalogExercise` avec `onBlur` ou bouton discret sur chaque ligne (type select + input number), comme pour `muscleGroup`.

**Alternative :** Modal d’édition — rejetée (trop lourd pour un champ).

### 2. Affichage groupes par muscle group

**Choix :** Helper client `groupExercisesByMuscleGroup(config, groupName)` qui résout les références puis partitionne par `config.exercises[id].muscleGroup`, en itérant `MUSCLE_GROUPS` pour l’ordre des sections. Sections vides masquées sauf si on veut montrer « Ajouter » — **afficher une section avec bouton d’ajout même vide** pour permettre d’alimenter un muscle group pas encore présent dans le groupe.

**Alternative :** Dupliquer l’ordre des refs JSON — rejetée (utilisateur veut le même rangement que le catalogue).

### 3. Picker filtré par section

**Choix :** Un état picker par `(groupName, muscleGroup)` ou réutiliser `groupPicker` avec clé composite ; options = `config.exercises` où `muscleGroup === sectionKey` et `exerciseId` pas déjà dans le groupe.

**Alternative :** Champ `muscleGroup` sur `Group` — rejetée (config 100 % JSON, pas de nouveau champ obligatoire).

### 4. Fin des surcharges admin

**Choix :** Retirer inputs surcharge et paramètre `override` à l’appel `addExerciseToCustomGroup`. Ne plus appeler `updateGroupExerciseRef` depuis l’UI. La résolution runtime continue d’honorer `value?` si présent dans un JSON importé.

**Alternative :** Supprimer `value?` du modèle — rejetée (casse imports existants sans gain immédiat).

### 5. Pas de création de groupe / liste en UI

**Choix :** Retirer les blocs JSX et actions associées ; messages vides pointent vers Import/Export. Les server actions `createCustomGroup` / `createList` restent utilisables par tests ou scripts si besoin, ou marquées non exposées — pas de suppression serveur sauf si tests inutiles.

## Risks / Trade-offs

- **[Risk] Groupe de séance multi-muscle (ex. « Jambes & mollets »)** → L’UI montre plusieurs sections ; l’utilisateur ajoute dans la bonne section. Pas de ambiguïté si les noms de groupe ne correspondent pas à un seul muscle group.
- **[Risk] JSON avec `value` surchargé** → Affichage admin montre la valeur catalogue résolue ou effective ? **Mitigation :** afficher la valeur effective via `resolveGroupExercises` mais sans édition ; libellé « défaut catalogue » si pas d’override, sinon indiquer que la surcharge vient du JSON (lecture seule) ou ignorer override à l’affichage et montrer catalogue uniquement — spec : affichage = valeur catalogue pour cohérence admin.
- **[Risk] Spec `exercise-group-creation` en français** → Delta REMOVED sur exigences de création UI uniquement.

## Migration Plan

1. Déployer UI + specs.
2. Aucune migration de données : les listes existantes fonctionnent ; surcharges JSON optionnelles inchangées côté runtime.
3. Documenter dans le skill `create-exercise-list` : groupes et listes via JSON, pas via formulaires admin.

## Open Questions

- Faut-il retirer aussi l’édition nom/icône/couleur des groupes de séance en UI, ou seulement la création ? *(Proposition actuelle : conserver édition/suppression de groupes existants ; à confirmer à l’apply si l’utilisateur veut 100 % JSON pour les métadonnées de groupe.)*
