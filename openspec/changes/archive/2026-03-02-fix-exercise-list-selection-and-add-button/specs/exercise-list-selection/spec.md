## ADDED Requirements

### Requirement: Indicateur visuel de sélection de liste
Le système DOIT afficher un indicateur visuel clair pour montrer quelle liste d'exercices est actuellement sélectionnée dans l'interface de gestion des listes.

#### Scenario: Bordure verte pour la liste sélectionnée
- **WHEN** l'utilisateur visualise l'interface de gestion des listes
- **THEN** la liste actuellement sélectionnée doit avoir une bordure de couleur verte (#13ec5b)
- **AND** les autres listes doivent avoir une bordure neutre

#### Scenario: Fond plus sombre pour la liste sélectionnée
- **WHEN** l'utilisateur visualise l'interface de gestion des listes
- **THEN** la liste actuellement sélectionnée doit avoir un fond légèrement plus sombre
- **AND** les autres listes doivent avoir un fond neutre

#### Scenario: Texte d'indication de liste active
- **WHEN** l'utilisateur visualise l'interface de gestion des listes
- **THEN** la liste actuellement sélectionnée doit afficher le texte "Liste active" en vert
- **AND** les autres listes ne doivent pas afficher ce texte

### Requirement: Synchronisation avec le contexte global
L'indicateur visuel DOIT refléter l'état réel de sélection stocké dans le contexte global de l'application.

#### Scenario: Changement immédiat de l'indicateur
- **WHEN** l'utilisateur clique sur une nouvelle liste dans l'interface de gestion
- **THEN** l'indicateur visuel doit changer immédiatement pour la nouvelle liste sélectionnée
- **AND** l'ancienne liste doit perdre son indicateur de sélection

#### Scenario: Persistance de l'indicateur après rechargement
- **WHEN** l'utilisateur recharge la page après avoir changé de liste
- **THEN** l'indicateur visuel doit montrer la même liste que celle sauvegardée dans le localStorage