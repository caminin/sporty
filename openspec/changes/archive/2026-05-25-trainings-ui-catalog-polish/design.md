## Context

Sporty utilise un catalogue global (`catalog.json`) et des entraînements (`entrainement-*.json`) avec `exerciseRefs` optionnellement surchargés (`value`). L’UI admin existe (onglets Exercices / Entraînements) et `updateTrainingExerciseRef` côté serveur, mais l’override n’est pas éditable. Sur l’accueil, `ExerciseGroupBlock` applique `GROUP_COLOR_STYLES` seulement si `color` est passé — les sections musculaires ne le sont pas, d’où des en-têtes blancs (`text-slate-900 dark:text-white`) sur fond peu contrasté. Le catalogue embarqué contient des doublons sémantiques (Burpees, Mountain climbers, gainage) et trop d’entrées en `muscleGroup: "jambes"`. Les deux entraînements par défaut portent des noms techniques (« Global », « Dynamisme jambes mollets core »).

## Goals / Non-Goals

**Goals:**

- Lisibilité : titres d’exercices visibles dans l’admin catalogue ; sélecteur d’entraînement lisible sur l’accueil si besoin.
- Couleurs distinctes par groupe musculaire sur l’accueil.
- Édition de la valeur effective par référence dans Entraînements (override + reset au défaut catalogue).
- Catalogue nettoyé, reclassement jambes/mollets uniquement, curls bras ajoutés.
- Suppression définitive des clés `fessiers` et `dos` (code + specs + skill).
- Entraînements embarqués renommés **Jambes** / **Haut du corps** avec listes d’exercices cohérentes.
- Bundle et reset alignés.

**Non-Goals:**

- Réintroduction de `fessiers` ou `dos`.
- Migration automatique des données utilisateur hors reset (l’utilisateur peut réinitialiser depuis le bundle).
- Refonte du sélecteur d’entraînement (dropdown) au-delà de la lisibilité.

## Decisions

### 1. Mapping couleur fixe par `MuscleGroupKey`

Ajouter `MUSCLE_GROUP_COLORS: Record<MuscleGroupKey, GroupColorKey>` dans `muscle-groups.ts` (ou module dédié) et passer `color` à `ExerciseGroupBlock` depuis `page.tsx` via `meta.key`. Réutilise `GROUP_COLOR_STYLES` existant — pas de nouvelle palette Tailwind ad hoc.

**Alternative rejetée :** teinter uniquement le titre en `text-*` sans fond — moins lisible en dark mode.

### 2. Override valeur dans Entraînements

Pour chaque ligne de ref : champ numérique lié à `resolved.value`, `onBlur` → `updateTrainingExerciseRef(trainingId, refId, value)`. Indicateur visuel si `ref.value` est défini (ex. astérisque ou libellé « personnalisé »). Bouton « Défaut catalogue » → `updateTrainingExerciseRef(..., null)` pour supprimer l’override.

**Alternative rejetée :** éditer le catalogue depuis Entraînements — mélange les responsabilités.

### 3. Dédoublonnage catalogue

Conserver **un seul id canonique** par exercice logique ; supprimer les entrées redondantes (`ce-5` vs `ex-dynamisme-01` pour Mountain climbers, etc.). Mettre à jour les `exerciseRefs` des entraînements pour pointer vers les ids conservés. Documenter la table de fusion dans `tasks.md`.

### 4. Reclassement « Jambes »

Règles de reclassement (exemples) :

| Exercice (logique) | Ancien | Nouveau |
|-------------------|--------|---------|
| Calf raises, pogos | jambes/mollets mélangé | `mollets` |
| Fentes, squats sautés | `jambes` | reste `jambes` (sauf mollets déjà isolés) |
| Shadow badminton, fast feet | `jambes` | reste `jambes` (dynamisme) |
| Core / gainage | `jambes` ou doublon | `abdos` |

### 4b. Suppression `fessiers` et `dos`

Retirer de `muscle-groups.ts` : type `MuscleGroupKey`, `MUSCLE_GROUP_KEYS`, `MUSCLE_GROUPS`, et toute entrée dans `MUSCLE_GROUP_COLORS`. Mettre à jour le skill `create-exercise-list`. À l’import / normalisation catalogue : `muscleGroup` `fessiers` ou `dos` → `autre`.

Clés autorisées : `jambes`, `mollets`, `epaules`, `bras`, `abdos`, `pecs`, `autre`.

**Autre :** `DEFAULT_MUSCLE_GROUP` ; section UI uniquement si au moins un exo catalogue utilise cette clé.

### 5. Entraînements embarqués

| Fichier (slug stable) | Nom affiché | Contenu cible |
|----------------------|-------------|---------------|
| `entrainement-global.json` (id stable) | **Haut du corps** | Pecs, bras (incl. curls), abdos — pas de jambes / dynamisme |
| `entrainement-dynamisme-jambes-mollets-core.json` | **Jambes** | Dynamisme + mollets ; core minimal optionnel en abdos |

Renommer uniquement le champ `name` dans JSON + métadonnées reset ; **ne pas** changer les ids de fichier persistés pour éviter de casser les sélections stockées (sauf migration documentée si ids de training changent).

### 6. Nouveaux exercices bras

Ajouter au catalogue :

- **Curl haltères** — `reps`, `muscleGroup: "bras"`
- **Curl Zottman haltères** — nom français pour le curl torsadé haltères — `reps`, `muscleGroup: "bras"`

Les inclure dans **Haut du corps** après dédoublonnage.

### 7. UI liste exercices (CatalogTab)

Remplacer `truncate` sur le nom par `break-words` / `min-w-0` avec layout qui laisse la colonne nom prendre l’espace (`flex-1` sans `truncate`, ou grille `1fr auto auto`). Augmenter la largeur utile sur `sm+` (inputs en ligne secondaire).

## Risks / Trade-offs

- **[Risk] Reset écrase les personnalisations utilisateur** → Mitigation : confirmation existante ; libellé reset mis à jour avec nouveaux noms.
- **[Risk] Fusion d’ids casse refs locales** → Mitigation : script de migration dans les JSON bundle + tests import ; reset restaure l’état cohérent.
- **[Risk] Utilisateurs avec anciens noms en cache** → Mitigation : `name` relu depuis le fichier à chaque load ; pas de cache du libellé côté client durable.

## Migration Plan

1. Éditer `exercice_list/catalog.json` (fusion ids, reclassement, curls).
2. Mettre à jour les deux `entrainement-*.json` (noms, refs).
3. `npm run build` (copie bundle).
4. Déployer ; admin peut **Réinitialiser** pour aligner les instances existantes.
5. Tests unitaires catalogue / trainings / homepage couleurs.

## Open Questions

- Faut-il renommer les fichiers `entrainement-global.json` → `entrainement-haut-du-corps.json` ? **Recommandation :** garder les slugs de fichier pour stabilité des ids persistés ; seul `name` change.
- Contenu exact de **Jambes** vs **Haut du corps** : valider avec l’utilisateur à l’apply si besoin ; proposition ci-dessus comme défaut dans tasks.
