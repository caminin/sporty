## Context

Le système de listes initialise aujourd’hui automatiquement une liste `default` via `ensureDefaultList()` et certaines fonctions métiers prennent encore `default` en identifiant de repli (`getWorkoutConfig`, `addExercise`, `saveWorkoutConfigForList`, etc.).

L’objectif est d’éliminer cette hiérarchie implicite et de faire fonctionner toutes les listes de manière identique : aucun comportement spécial pour la première, la liste courante ou la liste `default`.

## Goals / Non-Goals

**Goals:**
- Supprimer la création automatique d’une liste par défaut au démarrage.
- Supprimer la suppression des opérations qui imposent une liste privilégiée.
- Rendre explicite l’import de listes locales en supprimant toute logique d’auto-scan des répertoires.
- Conserver un dossier local stable (`manual-lists`) servant à la préparation/manipulation des fichiers à importer.
- Garantir que les opérations CRUD et exercices restent valides quel que soit l’`listId` fourni.

**Non-Goals:**
- Changer le format JSON des configurations de liste.
- Changer les règles de validation métier des exercices/groupe (garde actuelle).
- Introduire une nouvelle logique multi-tenant ou de gestion d’utilisateurs côté listes.

## Decisions

- **Décision 1: retirer l’usage implicite de `default` au niveau du stockage et des actions.**
  - Raisonnement: centraliser un identifiant magique réduit les surprises et maintient les invariants de permissions.
  - Alternative: conserver `default` comme alias technique caché.
  - Rejeté: maintenir une incohérence avec l’objectif utilisateur “toutes les listes se valent”.

- **Décision 2: passer d’un scan automatique à un flux import explicite.**
  - Raisonnement: évite des effets de bord lors de dépôts manuels, réduit les modifications non intentionnelles en production et améliore la traçabilité.
  - Alternative: maintenir une découverte auto au boot puis filtrage.
  - Rejeté: trop d’automatisme, contraire au besoin explicite.

- **Décision 3: conserver le seed sous forme de template réutilisable, mais uniquement déclenché par action explicite.**
  - Raisonnement: on préserve l’utilité du seed pour (ré)initialisation volontaire sans réactiver la logique implicite de liste par défaut.
  - Alternative: supprimer complètement le seed.
  - Rejeté: perte d’utilité pour réinstaller rapidement une structure connue si souhaitée.

## Risks / Trade-offs

- [Risque] Régression côté UI si des appels existants passent toujours `listId` par défaut à `'default'`.
  - Mitigation: mettre à jour les usages existants pour exiger un `listId` explicite et ajouter des cas d’erreur clairs si absent.
- [Risque] Import manuel moins pratique si aucun outil de listing n’est exposé.
  - Mitigation: fournir dans la doc API/UI une action d’import “par dossier” et un message d’erreur guidant le chemin attendu.
- [Risque] Perte de repère utilisateur pendant la transition (plus de liste “préremplie” au premier lancement).
  - Mitigation: afficher un guide de création/import au premier démarrage et documenter l’état vide attendu.

## Migration Plan

1. Supprimer la création automatique de la liste par défaut (`ensureDefaultList` appelée à l’initialisation).
2. Mettre à jour les fonctions d’actions pour ne plus supposer `default` comme repli.
3. Ajouter une opération explicite d’import depuis `manual-lists` (ou via import JSON), sans scan de ce dossier au démarrage.
4. Adapter la suite de tests d’initialisation et de comportement pour valider l’absence de logique implicite.
5. Plan de rollback: réactiver temporairement l’ancien comportement via flag de configuration côté serveur si nécessaire.

## Open Questions

- Le répertoire `manual-lists` doit-il être configurable via variable d’environnement (ex. `MANUAL_LISTS_DIR`) ou fixé à `DATA_DIR/manual-lists`?
- L’action d’import explicite doit-elle accepter un `listId` existant (override) ou créer systématiquement une nouvelle liste?

