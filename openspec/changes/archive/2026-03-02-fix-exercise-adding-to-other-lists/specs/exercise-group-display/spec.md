## MODIFIED Requirements

### Requirement: Affichage des groupes par liste sélectionnée
L'interface d'affichage des groupes d'exercices DOIT afficher les exercices de la liste actuellement sélectionnée.

#### Scenario: Affichage des exercices de la liste active
- **WHEN** l'utilisateur accède à l'interface d'affichage des groupes
- **THEN** seuls les exercices de la liste actuellement sélectionnée sont affichés
- **AND** l'interface indique quelle liste est active

#### Scenario: Changement de liste active
- **WHEN** l'utilisateur change la liste sélectionnée
- **THEN** l'affichage des groupes se met à jour automatiquement pour montrer les exercices de la nouvelle liste
- **AND** les groupes vides sont masqués si nécessaire

### Requirement: Actions sur les exercices par liste
Toutes les actions sur les exercices (ajout, modification, suppression) DOIVENT être limitées à la liste actuellement sélectionnée.

#### Scenario: Ajout d'exercice dans liste spécifique
- **WHEN** l'utilisateur ajoute un exercice via l'interface d'affichage des groupes
- **THEN** l'exercice est ajouté uniquement à la liste actuellement sélectionnée
- **AND** l'affichage se met à jour immédiatement pour montrer le nouvel exercice

#### Scenario: Modification du temps de repos par liste
- **WHEN** l'utilisateur modifie le temps de repos global
- **THEN** la modification s'applique uniquement à la liste actuellement sélectionnée
- **AND** les autres listes conservent leurs propres paramètres