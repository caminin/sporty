## MODIFIED Requirements

### Requirement: Construction de la séquence de session
Le système DOIT construire une séquence de steps `[work, rest, work, rest, ..., work]` à partir des placements sélectionnés, résolus via le catalogue (valeur effective), en utilisant l'algorithme d'alternance entre groupes. Le dernier step MUST être de type `work`.

#### Scenario: Séquence correctement construite
- **WHEN** la config contient N placements sélectionnés au total
- **THEN** la séquence générée contient N steps `work` et N-1 steps `rest`
- **THEN** chaque step `work` utilise la valeur effective (override ou défaut catalogue) pour durée ou répétitions

#### Scenario: Alternance maximale des groupes musculaires
- **WHEN** la config contient des placements de plusieurs groupes
- **THEN** la séquence maximise l'alternance entre groupes différents
