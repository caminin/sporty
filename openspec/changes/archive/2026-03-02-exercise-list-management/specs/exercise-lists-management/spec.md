## ADDED Requirements

### Requirement: Exercise Lists Administration Access
Le système DOIT protéger l'accès à la gestion des listes d'exercices par un mot de passe admin. Le mot de passe correct est "sporty".

#### Scenario: Admin authentication prompt
- **WHEN** l'utilisateur accède à la section "Gestion des listes" dans les paramètres
- **THEN** le système demande un mot de passe avant d'afficher l'interface d'administration

#### Scenario: Successful admin authentication
- **WHEN** l'utilisateur saisit le mot de passe "sporty"
- **THEN** l'interface de gestion des listes devient accessible
- **THEN** l'authentification est mémorisée pendant la session

#### Scenario: Failed admin authentication
- **WHEN** l'utilisateur saisit un mot de passe incorrect
- **THEN** un message d'erreur est affiché
- **THEN** l'accès à la gestion reste refusé

### Requirement: Exercise Lists CRUD Operations
Le système DOIT permettre de créer, lire, mettre à jour et supprimer des listes d'exercices une fois authentifié.

#### Scenario: Create new exercise list
- **WHEN** l'utilisateur authentifié clique sur "Créer une liste"
- **THEN** un formulaire permet de saisir nom et description
- **THEN** une nouvelle liste vide est créée avec un identifiant unique

#### Scenario: Load existing exercise list
- **WHEN** l'utilisateur sélectionne une liste dans le menu déroulant
- **THEN** les exercices de cette liste sont chargés et affichés
- **THEN** la liste devient la liste active pour les séances

#### Scenario: Update exercise list
- **WHEN** l'utilisateur modifie les exercices d'une liste chargée
- **THEN** les modifications sont automatiquement sauvegardées
- **THEN** un indicateur visuel confirme la sauvegarde

#### Scenario: Delete exercise list
- **WHEN** l'utilisateur supprime une liste (sauf la liste par défaut)
- **THEN** une confirmation est demandée
- **THEN** la liste et son fichier sont supprimés du serveur