## Context

Nous avons un fichier HTML statique `stitch_exercise/badminton_home.html` généré qui représente une interface utilisateur très claire pour une séance de badminton à la maison. L'application principale est une app Next.js (basée sur React avec Tailwind CSS). Nous devons migrer cette interface HTML statique vers l'application principale pour qu'elle puisse être utilisée et potentiellement interagir avec le backend, tout en conservant son design.

## Goals / Non-Goals

**Goals:**
- Traduire fidèlement le design HTML/CSS (classes Tailwind) en composants React/Next.js.
- Créer des petits composants réutilisables (ex: `Header`, `IntensitySlider`, `SessionStats`, `ExerciseBlock`, `FloatingButton`).
- Implémenter la nouvelle page sous une route dédiée (ex: `/test/badminton` ou `/badminton-session`).

**Non-Goals:**
- Le bouton "settings" et le bouton "Lancer la séance" n'ont pas besoin d'être connectés à des actions réelles pour l'instant (mockup uniquement).
- Ne pas introduire de gestion d'état complexe (Redux, context) ; un état local suffira pour le slider d'intensité si nécessaire (bien que l'intégration visuelle soit la priorité).

## Decisions

- **Architecture des composants:** Diviser la page en une collection de composants UI. Cela facilite la maintenance et la réutilisation dans d'autres types de séances de sport si l'application évolue.
- **Route Next.js:** Création d'un dossier `app/test/badminton/page.tsx` (ou selon l'organisation courante) qui fera office de conteneur principal.
- **Tailwind:** Le HTML original utilise des couleurs custom (`primary: #13ec5b`, `background-dark: #0a0f0d`, etc.). Ces couleurs devront être ajoutées dans la configuration locale de la page ou dans `tailwind.config.ts` global s'il s'agit d'un thème général au sport.

## Risks / Trade-offs

- **Conflits de style Tailwind:** (Risque) Les couleurs ou configurations personnalisées du header dans le HTML statique pourraient rentrer en conflit avec la configuration Tailwind globale de l'app. (Mitigation) Mettre à jour `tailwind.config.ts` proprement.
