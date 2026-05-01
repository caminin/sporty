## Why

La logique actuelle privilégie implicitement une liste "par défaut" et applique une stratégie de découverte automatique des listes, ce qui pousse la première liste créée à occuper un rôle spécial. Cela crée des comportements implicites qui compliquent l'import manuel de listes et rendent la gestion multi-listes moins prévisible.

Je veux revenir à un modèle où aucune liste n’est considérée prioritaire par défaut, et où l’import est explicitement piloté par l’utilisateur depuis un dossier local dédié, sans automatisme de découverte.

## What Changes

- Supprimer le principe de liste par défaut : une liste devient active uniquement par sélection explicite de l’utilisateur, sans logique de "liste spéciale".
- Supprimer le scan automatique des `manual-lists` : le système n’importe plus les fichiers automatiquement au démarrage.
- Ajouter un dossier local unique pour stocker les listes à importer manuellement (chargement explicite uniquement).
- Mettre à jour les règles de parcours, de validation et de sélection des listes pour qu’**toutes** les listes aient le même statut fonctionnel.

## Capabilities

### New Capabilities

- `manual-list-import-folder`: Gestion d’un dossier local de dépôt de listes importées, avec chargement explicite déclenché par l’utilisateur.

### Modified Capabilities

- `default-list-seed`: Suppression de la création/initialisation implicite d’une liste par défaut et adaptation des règles de seed/fallback.
- `list-system-testing`: Ajustement des scénarios de tests pour refléter l’absence de priorité implicite de liste par défaut et le flux d’import manuel.

## Impact

- Comportement de démarrage des listes d’exercices (backend/store).
- Flux d’import/export ou de chargement des fichiers `.json`.
- Logique de sélection et d’activation des listes.
- Tests automatisés liés au système de listes (scénarios de bootstrapping, initialisation automatique, isolation des listes).

