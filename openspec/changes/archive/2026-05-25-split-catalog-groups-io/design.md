## Context

La page `/group-settings` expose aujourd’hui trois onglets dont le troisième centralise import/export d’un `WorkoutConfig` complet (`exercises` + `groups` + `globalRestTime`) via `exportWorkoutConfigToJson` et `importListFromJson`. Les onglets catalogue et groupes redirigent vers cet onglet pour créer une liste ou importer des données.

Le merge actuel (`mergeImportedConfig`) ignore silencieusement les références dont `exerciseId` est absent du catalogue fusionné. L’utilisateur souhaite des flux séparés, une validation stricte à l’import groupes, et une confirmation avant remplacement total du catalogue.

## Goals / Non-Goals

**Goals:**

- Deux onglets admin uniquement, chacun avec ses propres actions import/export JSON.
- Formats JSON distincts et validés : catalogue vs groupes.
- Import catalogue sur liste existante : choix utilisateur « tout remplacer » vs fusion par id.
- Import groupes : échec explicite si une référence pointe vers un `exerciseId` absent du catalogue de la liste active.
- Création de nouvelle liste uniquement via import catalogue (nom + JSON).
- Messages d’erreur en français, affichés dans l’onglet concerné.

**Non-Goals:**

- Changer le modèle runtime `WorkoutConfig` (toujours un objet unique en persistance).
- Réintroduire la création de groupes de séance depuis l’UI.
- Modifier le flux session / page d’accueil hors résolution catalogue + références.
- Support du format legacy embarqué (toujours rejeté).

## Decisions

### 1. Formats JSON exportés

**Catalogue** (`exportCatalogToJson`):

```json
{
  "exercises": { "id": { "id", "name", "type", "value", "muscleGroup" } },
  "globalRestTime": 30
}
```

`globalRestTime` est optionnel à l’import ; s’il est présent sur une liste existante, il met à jour la valeur locale.

**Groupes** (`exportGroupsToJson`):

```json
{
  "groups": { "key": { "id", "name", "icon", "color", "createdAt", "exercises": [{ "refId", "exerciseId", "value?" }] } },
  "globalRestTime": 30
}
```

Alternative rejetée : conserver un seul fichier combiné — ne répond pas au besoin d’échanges ciblés.

### 2. Actions serveur

| Action | Entrée | Comportement |
|--------|--------|--------------|
| `importCatalogFromJson` | json, listName?, listId?, replaceAll, password | Sans `listId` : crée une liste (nom requis). Avec `listId` : merge ou replace catalogue |
| `importGroupsFromJson` | json, listId, password | Merge groupes sur liste existante ; validation stricte références |
| `exportCatalogToJson` / `exportGroupsToJson` | config | Sérialisation partielle |

`importListFromJson` reste en interne pour `importListFromManualFolder` (fichier complet `exercice_list/`) mais n’est plus exposé dans l’UI admin.

### 3. Remplacement catalogue (`replaceAll`)

- **WHEN** `replaceAll === true` : vider `config.exercises`, puis appliquer le catalogue importé ; les références de groupes dont `exerciseId` n’existe plus **échouent** avec message listant groupe + id (pas de suppression silencieuse des refs).
- **WHEN** `replaceAll === false` : fusion par `exerciseId` (importé remplace définition locale) ; refs existantes conservées.

Confirmation UI : `confirm()` avant appel serveur — « Supprimer tous les exercices actuels avant import ? »

### 4. Validation import groupes

Réutiliser `validateGroupRef` mais **ne plus ignorer** les refs invalides : collecter toutes les erreurs `(groupName, exerciseId)` et retourner un message unique du type :

> Le groupe « Explosivité jambes » référence l'exercice « xyz » qui n'existe pas dans le catalogue.

Alternative rejetée : filtrer les refs invalides — comportement actuel de `mergeImportedConfig`, source de bugs.

### 5. UI

- Supprimer `ImportExportTab.tsx` et l’onglet `io` dans `page.tsx`.
- `CatalogTab` : section Import/Export catalogue en bas (ou en haut si liste vide) ; création liste = nom + import ; plus de `onGoToImport`.
- `GroupsTab` : section Import/Export groupes ; désactivé si aucune liste / catalogue vide.
- Composant partagé optionnel `JsonImportExportPanel` (props : kind, handlers) pour éviter duplication paste/file/button.

### 6. Tests & skill

- Tests unitaires : parse catalogue seul, parse groupes seul, rejet refs orphelines, replaceAll vide catalogue.
- Skill `create-exercise-list` : deux fichiers ou sections (catalogue JSON + groupes JSON) pour les listes versionnées dans `exercice_list/`.

## Risks / Trade-offs

| Risque | Mitigation |
|--------|------------|
| Utilisateurs avec anciens exports combinés | Message « Format catalogue attendu : clé exercises » ; doc skill |
| replaceAll laisse des refs orphelines | Validation post-replace avant persist ; rollback si échec |
| Import groupes sans catalogue | Bouton import groupes disabled + message |
| `importListFromManualFolder` lit encore fichier complet | Conserver parse `WorkoutConfig` complet pour ce chemin uniquement |

## Migration Plan

1. Implémenter parse/export/import séparés + actions serveur.
2. Refondre UI deux onglets.
3. Mettre à jour tests et skill.
4. Supprimer `ImportExportTab.tsx`.
5. Archiver change OpenSpec ; specs principales mises à jour.

Pas de migration données disque : les listes existantes restent `WorkoutConfig` ; seuls les flux d’échange changent.

## Open Questions

_Aucune bloquante — `confirm()` natif pour le choix replaceAll est accepté (cohérent avec suppression de liste)._
