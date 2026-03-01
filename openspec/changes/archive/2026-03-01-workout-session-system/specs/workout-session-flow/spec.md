## ADDED Requirements

### Requirement: Lancement de la séance depuis la page d'accueil
Le système DOIT permettre à l'utilisateur de lancer la séance en appuyant sur le bouton "Lancer la séance". La séquence d'exercices (filtrée des groupes vides) DOIT être encodée et transmise au composant timer via les paramètres d'URL. Les groupes ne contenant aucun exercice MUST être ignorés.

#### Scenario: Lancement avec des exercices configurés
- **WHEN** l'utilisateur appuie sur le bouton "Lancer la séance" et qu'au moins un groupe contient des exercices
- **THEN** l'application navigue vers `/timer` avec la séquence d'exercices encodée en paramètre URL `session`

#### Scenario: Lancement avec tous les groupes vides
- **WHEN** l'utilisateur appuie sur "Lancer la séance" et aucun groupe ne contient d'exercices
- **THEN** une indication visuelle (toast ou alert) indique à l'utilisateur qu'il n'y a aucun exercice à lancer

### Requirement: Construction de la séquence de session
Le système DOIT construire une séquence de steps de type `[work, rest, work, rest, ..., work]` à partir des exercices de chaque groupe, dans l'ordre des groupes définis. Le dernier step de la séquence MUST être un step de type `work` (pas de repos final).

#### Scenario: Séquence correctement construite
- **WHEN** la config contient N exercices au total (tous groupes confondus)
- **THEN** la séquence générée contient N steps de type `work` et N-1 steps de type `rest`

### Requirement: Fin de boucle — proposition de relancer
Le système DOIT afficher un écran de fin lorsque tous les steps de la séquence ont été complétés. Cet écran DOIT présenter deux options : **Oui, refaire** (relancer la séquence depuis le début) et **Terminer** (retourner à la page d'accueil).

#### Scenario: Fin de séance — l'utilisateur choisit de refaire
- **WHEN** le dernier step est terminé et l'utilisateur appuie sur "Oui, refaire"
- **THEN** la séquence repart depuis le premier step (index 0) sans rechargement de page

#### Scenario: Fin de séance — l'utilisateur choisit de terminer
- **WHEN** le dernier step est terminé et l'utilisateur appuie sur "Terminer"
- **THEN** l'application navigue vers la page d'accueil (`/`)
