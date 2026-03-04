## MODIFIED Requirements

### Requirement: Réception de la séquence dynamique d'exercices
Le système DOIT lire le paramètre URL `session` (JSON encodé en base64) et construire la liste des steps à exécuter. Les steps encodés contiennent les valeurs (duration, reps) déjà scalées par l'intensité sélectionnée au lancement. Si le paramètre est absent ou invalide, le timer MUST afficher un message d'erreur et proposer un retour à l'accueil.

#### Scenario: Paramètre session valide
- **WHEN** l'utilisateur arrive sur `/timer?session=<base64json>`
- **THEN** le timer charge la séquence et commence le premier step automatiquement

#### Scenario: Paramètre session absent ou invalide
- **WHEN** l'utilisateur arrive sur `/timer` sans paramètre `session` valide
- **THEN** un message d'erreur est affiché avec un bouton de retour à l'accueil

#### Scenario: Steps contain scaled values
- **WHEN** la session a été lancée avec une intensité de 1.5
- **AND** un exercice de base avait 10 reps ou 60s
- **THEN** le step reçu par le timer contient 15 reps ou 90s (valeurs scalées)
