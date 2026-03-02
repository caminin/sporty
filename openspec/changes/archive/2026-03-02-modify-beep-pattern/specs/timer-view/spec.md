## MODIFIED Requirements

### Requirement: Audio/Volume Controls
Le système DOIT fournir un contrôle audio/basculement du volume dans la zone d'en-tête supérieure droite. Le système DOIT utiliser un pattern audio amélioré composé de deux bips légers suivis d'un bip normal lors des transitions entre exercices.

#### Scenario: User toggles audio
- **WHEN** l'utilisateur clique sur le bouton volume
- **THEN** les commentaires audio pour les ticks du compte à rebours et les changements d'intervalle sont basculés activés/désactivés

#### Scenario: Enhanced audio pattern on transitions
- **WHEN** l'utilisateur passe à l'étape suivante (skip, validation de reps, ou fin automatique)
- **THEN** le système joue le pattern audio amélioré : deux bips légers puis un bip normal
- **THEN** le pattern respecte le paramètre audio activé/désactivé