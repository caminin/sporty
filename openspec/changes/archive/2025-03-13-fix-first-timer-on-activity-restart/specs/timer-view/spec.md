## ADDED Requirements

### Requirement: Replay relance le premier timer correctement
Lorsque l'utilisateur clique sur "Oui, refaire !" après une séance terminée, le système DOIT relancer la séquence depuis le premier step ET le compte à rebours du premier exercice (si type "time") ou du premier repos DOIT démarrer immédiatement et décompter correctement.

#### Scenario: Premier timer démarre après replay
- **WHEN** la séance est terminée et l'utilisateur clique sur "Oui, refaire !"
- **AND** le premier step est un exercice de type "time" (ex. 45s)
- **THEN** la phase de préparation (5, 4, 3, 2, 1) s'affiche puis le compte à rebours de l'exercice démarre à 45s et décompte chaque seconde

#### Scenario: Premier timer démarre après replay (premier step = repos)
- **WHEN** la séance est terminée et l'utilisateur clique sur "Oui, refaire !"
- **AND** le premier step est un repos (cas théorique)
- **THEN** le compte à rebours du repos démarre immédiatement et décompte correctement
