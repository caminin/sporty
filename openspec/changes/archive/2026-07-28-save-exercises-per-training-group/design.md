## Context

Sur `app/page.tsx`, la sélection des exercices cochés pour une séance est persistée dans `localStorage` sous la clé unique `sporty_session_selection` (tableau de `refId`). Les helpers `loadSelection` et `saveSelection` filtrent les IDs valides pour l'entraînement courant, mais **écrasent toujours la même clé globale** à chaque toggle.

Conséquence : si l'utilisateur décoche des exercices dans l'entraînement A, puis passe à l'entraînement B, seuls les `refId` communs aux deux entraînements restent cochés. L'état de A « contamine » B et inversement.

L'identifiant d'entraînement actif (`selectedListId`) est déjà persisté séparément via `ExerciseListContext` (`selectedExerciseListId`).

## Goals / Non-Goals

**Goals:**

- Scoper la persistance de la sélection d'exercices par `selectedListId`.
- Restaurer la sélection correcte à chaque changement d'entraînement.
- Conserver le défaut « tout coché » pour un entraînement sans historique.
- Ignorer l'ancien format tableau sans migration (fallback tout coché, pas de crash).

**Non-Goals:**

- Persister la sélection côté serveur ou dans les fichiers d'entraînement.
- Synchroniser la sélection entre appareils.
- Modifier le format d'encodage de session (`encodeSession`) ou le timer.
- Gérer un historique multi-jours / reset automatique par date.

## Decisions

### 1. Structure `localStorage` : objet indexé par entraînement

Remplacer le tableau plat par un objet JSON :

```json
{
  "training-id-a": ["ref-1", "ref-2"],
  "training-id-b": ["ref-3"]
}
```

Clé conservée : `sporty_session_selection` (évite une nouvelle clé orpheline).

**Rationale :** Une seule entrée `localStorage`, lecture/écriture O(1) par entraînement, extensible si de nouveaux entraînements sont ajoutés.

**Alternative rejetée :** Clé par entraînement (`sporty_session_selection:<id>`) — multiplication des clés, nettoyage plus difficile.

### 2. Signature des helpers

```ts
function loadSelection(listId: string, view: WorkoutView): Set<string>
function saveSelection(listId: string, selectedIds: Set<string>, view: WorkoutView): void
```

`loadWorkoutView` passera `selectedListId` à `loadSelection`. `handleToggle` passera `selectedListId` à `saveSelection`.

### 3. Ancien format ignoré

Si `JSON.parse` renvoie un tableau (ancien format) ou une structure invalide, traiter comme « aucune sauvegarde » → tout coché. Pas de migration.

### 4. Emplacement du code

Garder les helpers dans `app/page.tsx` pour l'instant (changement localisé, pas de nouvelle abstraction tant que le besoin n'est pas partagé ailleurs).

**Alternative rejetée :** Extraire dans `app/session-selection-storage.ts` — acceptable en follow-up si des tests unitaires purs sont souhaités ; pour ce change, un helper testable via tests composant ou extraction minimale suffit.

## Risks / Trade-offs

- **[Perte de l'ancienne sélection globale]** → Accepté ; l'utilisateur repart sur « tout coché » une fois.
- **[Croissance de l'objet localStorage]** → Négligeable (quelques entraînements × dizaines de refIds).
- **[refId supprimé d'un entraînement]** → Filtrage existant (`filter id => allIds.has(id)`) reste en place à la lecture et à l'écriture.

## Migration Plan

1. Déployer le nouveau format de lecture/écriture.
2. Aucun rollback serveur.

## Open Questions

- Aucune.
