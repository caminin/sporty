## MODIFIED Requirements

### Requirement: Synchronisation avec la sélection globale
L'interface de gestion DOIT toujours travailler sur la liste sélectionnée globalement dans l'application.

#### Scenario: Changement de liste globale
- **WHEN** l'utilisateur change la liste sélectionnée dans l'interface principale
- **THEN** l'interface de gestion affiche automatiquement les exercices de la nouvelle liste sélectionnée
- **AND** toutes les opérations utilisent la nouvelle liste active

#### Scenario: Changement de liste dans l'interface de gestion
- **WHEN** l'utilisateur change la liste sélectionnée dans l'interface de gestion des listes
- **THEN** le contexte global de l'application est mis à jour avec la nouvelle liste sélectionnée
- **AND** tous les autres composants utilisant le contexte voient immédiatement le changement