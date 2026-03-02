## ADDED Requirements

### Requirement: Timer Audio Pattern Sequence
Le système DOIT produire une séquence audio composée de trois tons lors des transitions entre exercices : deux bips légers suivis d'un bip normal.

#### Scenario: Audio pattern playback during step transition
- **WHEN** l'utilisateur passe à l'étape suivante du timer (changement d'exercice ou validation de répétitions)
- **THEN** le système joue immédiatement deux bips légers (600Hz, 0.15s, volume 0.2) espacés de 0.1s
- **THEN** le système joue un bip normal (800Hz, 0.3s, volume 0.3) 0.2s après le deuxième bip léger

#### Scenario: Audio disabled prevents pattern playback
- **WHEN** l'audio est désactivé via le contrôle volume
- **THEN** aucun pattern audio n'est joué lors des transitions

#### Scenario: Audio pattern respects browser audio context
- **WHEN** le navigateur ne supporte pas l'API Web Audio
- **THEN** le système ne produit aucun son et n'affiche pas d'erreur