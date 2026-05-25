## Context

Le modèle actuel (`WorkoutConfig`) stocke des `Exercise[]` complets dans chaque `Group`. Les listes (`ExerciseList` dans `exercise-lists/`) encapsulent une config ; l’export copie uniquement `WorkoutConfig` ; l’import crée une liste sans logique de fusion catalogue. La page `group-settings` permet de saisir nom/type/valeur à l’ajout dans un groupe (`addExerciseToCustomGroup`). La séance (accueil, timer, `estimateSessionDuration`) lit `group.exercises` et sélectionne par `ex.id`.

## Goals / Non-Goals

**Goals:**

- Un catalogue `exercises` par liste d’entraînement, source de vérité pour nom, type et valeur par défaut.
- Des groupes qui ne contiennent que des références vers le catalogue, avec surcharge optionnelle de `value`.
- Résolution centralisée (`resolveGroupExercise`) pour UI, export, séance et intensité.
- Import/export avec fusion catalogue + groupes, **sans** support des anciens formats à l’exécution.
- Fichiers versionnés (`exercice_list`, seed) convertis une fois au nouveau schéma (hors code de migration).
- UI alignée : CRUD catalogue dans la gestion des listes ; ajout au groupe via picker, pas de création inline.

**Non-Goals:**

- Catalogue unique partagé entre toutes les listes de l’application (hors scope : le catalogue reste **par liste**).
- Tags, catégories, médias ou variantes d’exercices (nom différent selon le groupe).
- Synchronisation multi-utilisateur ou versioning concurrent.

## Decisions

### 1. Structure de données

```typescript
interface ExerciseDefinition {
  id: string;
  name: string;
  type: ExerciseType;
  value: number; // défaut catalogue
}

interface GroupExerciseRef {
  refId: string;      // id unique dans le groupe (sélection séance)
  exerciseId: string; // clé dans catalog.exercises
  value?: number;     // surcharge optionnelle
}

interface Group {
  id: string;
  name: string;
  icon: string;
  color: GroupColorKey;
  createdAt: string;
  exercises: GroupExerciseRef[]; // renommé sémantiquement = refs
}

interface WorkoutConfig {
  globalRestTime: number;
  exercises: Record<string, ExerciseDefinition>;
  groups: Record<string, Group>;
}
```

**Rationale** : séparation claire catalogue / placement. `refId` évite les collisions de sélection quand le même `exerciseId` apparaît deux fois dans un groupe avec des surcharges différentes.

**Alternative rejetée** : références uniquement par `exerciseId` sans `refId` → impossible de distinguer deux placements du même exercice.

### 2. Résolution de la valeur effective

Fonction utilitaire partagée :

```typescript
function getEffectiveValue(def: ExerciseDefinition, ref: GroupExerciseRef): number {
  return ref.value ?? def.value;
}
```

Pour l’affichage séance / intensité : construire un `ResolvedExercise` `{ refId, exerciseId, name, type, value }` à partir du catalogue + ref.

**Rationale** : un seul point pour éviter les divergences UI / timer / estimation.

### 3. Pas de compatibilité legacy (décision explicite)

- **Chargement / import** : validation stricte du format catalogue + références. JSON ou listes stockées sans `exercises` ou avec exercices embarqués dans les groupes → **erreur** (message clair), pas de conversion automatique.
- **`migrateWorkoutConfig`** : supprimer ou réduire à une no-op / passe-plat qui ne convertit plus l’ancien format ; les tests legacy migration sont retirés ou remplacés par des tests de rejet.
- **Données repo** : `default-seed.json` et `exercice_list/*.json` sont édités manuellement (ou via script one-shot hors app) au nouveau format avant déploiement — pas de migration au runtime.
- **localStorage** (`sporty_session_selection`) : pas de migration des ids ; sélection invalide ignorée (comportement déjà prévu pour ids stale).

**Rationale** : périmètre réduit, code plus simple, un seul contrat de données.

### 4. Fusion à l’import

Entrée : JSON importé (catalogue + groupes) + liste cible existante (optionnelle ; création si nouvelle liste).

**Exercices (clé = `exerciseId`)** :

| Situation | Action |
|-----------|--------|
| Id inconnu localement | Ajouter la définition importée |
| Id existant, contenu identique | Ne rien changer |
| Id existant, métadonnées différentes (nom/type/valeur défaut) | Mettre à jour la définition catalogue avec les valeurs importées (import gagne sur le catalogue) ; les `value` de surcharge dans les groupes locaux restent inchangées |
| Référence groupe pointe vers un `exerciseId` supprimé du catalogue après merge | Marquer orphelin → retirer la ref à la validation ou refuser l’import avec message explicite |

**Groupes (clé = `group.id` ou `group.name` selon convention actuelle — privilégier `group.id`)** :

| Situation | Action |
|-----------|--------|
| Groupe id inconnu | Ajouter le groupe et ses refs (refs dont `exerciseId` existe dans le catalogue fusionné) |
| Groupe id existant | Fusionner les refs : ajouter les refs importées dont `refId` n’existe pas localement ; pour `refId` collision, l’import écrase la surcharge `value` |
| Nom de groupe affiché en doublon | Renommage non automatique ; erreur ou suffixe `(import)` — **choix** : suffixe `(import)` sur le `name` si collision de clé Record |

**Rationale** : aligné sur la demande « fusion » et sur le changement archivé `fusionne-groupe-et-groupe-personnalises`, étendu au catalogue.

### 5. Export

`exportWorkoutConfigToJson` sérialise `{ globalRestTime, exercises, groups }`. Import et chargement exigent ce shape.

### 6. UI group-settings

**Onglet « Gestion des listes »** :

- Section « Catalogue d’exercices » : liste, créer (nom, type, valeur défaut), modifier, supprimer.
- Suppression catalogue : interdite si au moins une ref groupe l’utilise (message + liste des groupes concernés).

**Onglet « Groupes »** :

- Par groupe : bouton « Ajouter depuis le catalogue » → modal/liste des exercices pas encore dans le groupe (ou tous avec indicateur déjà présent).
- Après ajout : champ optionnel « Durée / répétitions » (vide = défaut catalogue).
- Édition inline de la surcharge uniquement ; nom/type modifiables uniquement dans le catalogue.

### 7. Séance et sélection

- `selectedIds` sur l’accueil : ensemble de `refId` (pas `exerciseId`).
- `buildSessionSteps` / `estimateSessionDuration` : consomment `ResolvedExercise[]`.
- Intensité : multiplie `value` effective (comportement inchangé conceptuellement).

### 8. Fichiers `exercice_list/` et seed

Réécrire tous les JSON versionnés (`exercice_list/*.json`, `default-seed.json`) au nouveau format (one-shot, pas de code de migration dans l’app).

### 9. Consommateurs et outillage (inventaire)

Tout code qui lit `group.exercises` comme `Exercise[]` doit passer par la résolution ou manipuler explicitement des `GroupExerciseRef`.

| Zone | Fichiers | Action |
|------|----------|--------|
| Skill agent | `.cursor/skills/create-exercise-list/SKILL.md` | Nouveau schéma : section `exercises` + `groups[].exercises` en refs ; exemples ; règles de validation et génération d’IDs (`ex-*`, `ref-*` ou réutilisation `exerciseId` comme `refId` à la création) |
| Helpers tests | `exercise-lists-helpers.ts` | `createTestConfig` / `createCustomTestConfig` produisent catalogue + refs ; helper `createTestConfigWithCatalog` pour cas avancés |
| Tests listes | `app/__tests__/entities/exercise-lists/*` | Fixtures et assertions sur `config.exercises` + refs |
| Tests validation | `migration.test.ts` renommé/supprimé | Rejet format invalide ; plus de tests legacy → v2 |
| Tests groupes | `custom-groups/actions.test.ts` | `addExerciseToGroup` → ref depuis catalogue |
| Session | `session-utils.ts`, `session-utils.test.ts`, `page.tsx`, `timer/page.tsx` | `refId`, valeur effective |
| Composants | `ExerciseListSelector`, previews timer | Aucun changement structurel attendu si données résolues en amont |
| Import manuel | `loadManualListConfig`, specs `manual-list-import-folder` | Même validation stricte que JSON collé |
| Docs tests | `app/__tests__/README.md`, `workouts/README.md` | Documenter le format v2 des helpers |

**Règle** : lors de l’apply, supprimer les chemins `migrateWorkoutConfig` legacy et grep les consommateurs du format embarqué.

## Risks / Trade-offs

**[Risk] Anciens JSON / listes stockées deviennent illisibles** → Accepté : réécrire les fichiers repo ; listes perso invalides → erreur ou re-import manuel.

**[Risk] Import écrase des définitions catalogue voulues localement** → Mitigation : documenter « import gagne » ; option future « fusion conservative » hors scope.

**[Risk] Références orphelines après suppression catalogue** → Mitigation : garde-fou UI + validation à la sauvegarde.

**[Risk] Duplication de noms dans le catalogue (ids différents)** → Mitigation : autorisé ; l’utilisateur gère ; pas de dédup par nom à l’import (trop heuristique).

**[Risk] Tests volumineux à mettre à jour** → Mitigation : helpers `createTestConfigWithCatalog` dans test-helpers.

## Déploiement (sans migration runtime)

1. Types + validation stricte (`validateCatalog`, `validateGroup` refs).
2. Actions serveur + suppression logique legacy dans `workout-config.ts` / chargement listes.
3. Réécrire `default-seed.json`, `exercice_list/*.json`, skill `create-exercise-list`.
4. Helpers de tests + UI + session.
5. Import/export + fusion ; tests de rejet format invalide.

## Open Questions

- Faut-il autoriser le même `exerciseId` deux fois dans un groupe ? **Proposition** : oui, via `refId` distincts (utile pour intervalles différents).
- Import dans une liste existante : fusion ou remplacement total ? **Proposition** : fusion par défaut pour import admin ; création nouvelle liste = copie complète sans fusion cible.
