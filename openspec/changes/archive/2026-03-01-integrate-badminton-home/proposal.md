## Why

Nous avons besoin d'intégrer la première page de l'exercice "badminton_home" dans l'application. Cette intégration permet d'offrir une interface moderne et dynamique pour l'affichage de la séance d'entraînement de badminton, en remplaçant la version statique par des composants réutilisables.

## What Changes

- Intégrer le HTML/CSS de `stitch_exercise/badminton_home.html` sous forme de composants React/Next.js.
- Utiliser Tailwind CSS pour le style, en conservant le thème `dark` par défaut avec le vert de l'application.
- Diviser la page en composants logiques (Header, IntensityControl, SessionSummary, BlockList, etc.).

## Capabilities

### New Capabilities
- `badminton-session-view`: Affichage de la vue d'une séance d'entraînement spécifique au badminton, incluant l'intensité globale, la durée et la séquence d'exercices.

### Modified Capabilities
Aucune.

## Impact

- Frontend: Ajout de nouveaux composants dans l'application.
- Routage: Création d'une nouvelle route ou modification de la vue existante pour afficher l'entraînement de badminton.
