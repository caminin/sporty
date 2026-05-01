## Why

Le formulaire d'import de listes est confus car il expose un bouton additionnel pour un fichier manuel qui double des actions deja presentes. Cette ambiguite augmente les erreurs de manipulation et ralentit l'import.

## What Changes

- Simplifier l'interface d'import manuel pour ne garder que les champs indispensables: nom de liste et JSON.
- Conserver le flux d'import via fichier local avec le bouton de selection de fichier suivi de l'action d'import.
- Retirer le bouton dedie au "fichier manuel" qui fait doublon avec le flux principal.
- Clarifier la hierarchie visuelle des actions d'import afin qu'un seul parcours soit evident.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `group-settings`: ajuster les exigences UI du panneau d'import pour n'afficher que les controles utilises dans le parcours principal.

## Impact

Les changements touchent principalement `app/group-settings/page.tsx` et la logique d'import associee. Impact attendu sur les tests d'integration et UI qui valident la presence/absence des controles du formulaire.
