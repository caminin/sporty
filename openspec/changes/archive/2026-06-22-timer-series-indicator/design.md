## Context

`buildSessionSteps` développe chaque exercice en N steps `work` identiques (même `name`, `group`, `type`, `duration`/`reps`) séparés par des `rest`. Le timer affiche la progression globale `exercice 5 / 12` mais aucune information de série. L'écran « Suivant » répète le même nom lors d'une série 2/3, ce qui prête à confusion.

Lors de l'implémentation des séries (`exercise-series`), l'indicateur timer était explicitement hors scope — il est maintenant demandé.

## Goals / Non-Goals

**Goals:**

- Porter `seriesIndex` (1-based) et `seriesTotal` sur chaque step `work` quand l'exercice logique a plus d'une série.
- Afficher **Série 1/3** (ou format compact **1/3**) de façon lisible sur mobile, sans masquer le chrono.
- Contextualiser le repos entre deux séries du même exercice.
- Adapter préparation et aperçu suivant.

**Non-Goals:**

- Changer la logique de séquençage, de repos ou d'expansion des séries.
- Modifier l'admin ou le catalogue.
- Refonte complète du design timer (couleurs, typographie globale) — ajustements ciblés seulement.

## Decisions

### 1. Métadonnées sur `SessionStep` work

```ts
type SessionWorkStep = {
  kind: "work";
  name: string;
  group: string;
  type: "time" | "reps";
  duration?: number;
  reps?: number;
  seriesIndex?: number;  // 1..seriesTotal, présent si seriesTotal > 1
  seriesTotal?: number;    // >= 2
};
```

**Rationale :** Données dérivées à l'encodage, pas besoin de recalcul fragile côté timer. Rétrocompatible : champs absents = une seule série.

**Alternative rejetée :** Déduire la série en comptant les steps consécutifs même nom — fragile si deux exercices distincts portent le même libellé.

### 2. Remplissage dans `buildSessionSteps`

Lors de la boucle `for (let s = 0; s < series; s++)`, si `series >= 2` :

```ts
seriesIndex: s + 1,
seriesTotal: series,
```

### 3. Composant `SeriesProgressBadge`

Petit badge sous le titre d'exercice : `Série 2/3` (texte) ou variante compacte `2/3` en header. Style : `bg-white/15`, `rounded-full`, `text-sm font-semibold`, distinct du badge groupe musculaire.

Affiché quand `seriesTotal > 1` sur le step courant (work) ou dérivé du prochain work step (repos inter-séries, préparation).

### 4. Repos inter-séries

Quand le step courant est `rest` et le prochain `work` a `seriesIndex > 1` avec le même `name` que le work précédent :

- Sous-titre phase : « Repos avant série 2/3 »
- Optionnel : nom de l'exercice en plus petit

Sinon : comportement actuel « Repos ».

### 5. `NextExercisePreview` étendu

Props optionnelles : `seriesIndex`, `seriesTotal`, `isSameExercise`.

- Même exercice, série suivante → titre « Série suivante », ligne principale `2/3`, pas de répétition du nom en gros.
- Exercice différent → comportement actuel inchangé.

### 6. Hiérarchie visuelle timer

- Header : conserver `N / Total` global ; ajouter badge série compact à côté si applicable.
- Zone titre : nom exercice → badge groupe → badge série (nouveau).
- Réduire légèrement la taille du chrono sur très petits écrans si badge + titre tiennent mal (`text-[9rem]` sm fallback) — uniquement si nécessaire au impl.

## Risks / Trade-offs

- **[Payload URL légèrement plus gros]** → Négligeable (deux entiers par step work multi-série).
- **[Sessions encodées avant déploiement]** → Pas de badge série ; acceptable.
- **[Deux exercices même nom]** → Métadonnées explicites évitent la confusion.

## Migration Plan

1. Types + `buildSessionSteps`.
2. Composant badge + timer + previews.
3. Tests unitaires et timer.
4. Déploiement sans migration de données persistées (session URL régénérée à chaque lancement).

## Open Questions

- Aucune — format `Série 1/3` validé par la demande utilisateur.
