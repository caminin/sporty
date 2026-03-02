## Why

L'utilisateur souhaite améliorer l'expérience audio du timer en modifiant le pattern de bips lors des transitions. Au lieu d'un seul bip, il veut deux bips légers suivis d'un bip normal pour mieux signaler les changements d'état.

## What Changes

- Modifier le système audio du timer pour produire deux bips légers puis un bip normal lors des transitions entre exercices
- Maintenir la fonctionnalité existante du contrôle audio (bouton volume dans le header)

## Capabilities

### New Capabilities
- `timer-audio-patterns`: Définition des patterns audio utilisés par le timer (bips légers, bips normaux, etc.)

### Modified Capabilities
- `timer-view`: Modification des contrôles audio pour supporter le nouveau pattern de bips

## Impact

- Code du composant timer (`app/timer/page.tsx`)
- Logique audio du timer
- Potentiellement les utilitaires de session si les patterns sont définis là