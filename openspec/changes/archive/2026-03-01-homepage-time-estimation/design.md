## Context

La page d'accueil (`app/page.tsx`) est un composant React client-side qui affiche :
- Un contrôle d'intensité (slider)
- Un résumé de séance (nombre d'exercices sélectionnés, temps de repos, et actuellement une "Difficulté" statique)
- La liste des exercices groupés avec sélection

La construction de la séance est faite dans `app/session-utils.ts` via `buildSessionSteps()`, qui produit une séquence `[work, rest, work, rest, …, work]`.

## Goals / Non-Goals

**Goals:**
- Passer la valeur par défaut de l'intensité de 1.2 à 1.0
- Supprimer le bloc "Difficulté" du `SessionSummary` (hardcodé, sans valeur réelle)
- Afficher une estimation du temps total de la séance dans le `SessionSummary`, calculée dynamiquement à partir des exercices sélectionnés
- Garantir que la séance ne commence jamais par un repos dans `buildSessionSteps`

**Non-Goals:**
- Modifier le curseur d'intensité ou son fonctionnement (seule la valeur initiale change)
- Changer la formule de calcul du temps de repos entre exercices
- Permettre à l'utilisateur de modifier les paramètres de calcul (5s/démarrage, 3s/rep)
- Synchroniser l'estimation avec le timer réel

## Decisions

### Formule d'estimation du temps

**Décision** : Calcul côté client dans un hook/fonction pure dérivée des exercices sélectionnés :

```
estimatedSeconds =
  Σ (par exercice sélectionné) [
    5s (démarrage)
    + si type=reps  : value × 3s
    + si type=time  : value (en secondes)
  ]
  + (nbExercicesSelected - 1) × globalRestTime
```

**Pourquoi cette formule** : Simple, paramétrable, cohérente avec le ressenti utilisateur. Les 5s de démarrage couvrent la mise en position, la respiration, etc.

**Alternatif rejeté** : Afficher uniquement le temps de repos total → trop partiel, ne donne pas une vision globale.

### Calcul en temps réel

**Décision** : La durée estimée est recalculée à chaque changement de `selectedIds` via un `useMemo` ou une fonction pure appelée dans le render.

**Pourquoi** : Pas de state supplémentaire nécessaire, données déjà disponibles dans le composant parent.

### Affichage

**Décision** : Remplacer la colonne "Difficulté" par "Durée est." dans `SessionSummary`. Le format est `Xm Ys` si ≥ 60s, sinon `Xs`.

**Pourquoi** : Conserve la grille à 3 colonnes (Exercices | Repos/Exo | Durée est.) sans refonte de layout. Cohérent avec les autres infos de la carte résumé.

### Garantie "pas de repos en premier"

**Décision** : Dans `buildSessionSteps`, la première étape est toujours un `work`. La séquence actuelle (`[work, rest, work, …]`) garantit déjà cela, mais on documente explicitement la règle et on valide avec un test ou une assertion.

**Pourquoi** : La séquence est construite en itérant les exercices et en ajoutant un `rest` après chaque exercice sauf le dernier. Par construction, le premier step est toujours un exercice — on renforce cette garantie via la spec.

## Risks / Trade-offs

- **Estimation approximative** → L'utilisateur doit comprendre que c'est une estimation. On peut afficher "~Xm" avec un tilde ou une icône horloge. Risque faible : la page d'accueil est une aide à la planification.
- **Intensité ignorée dans l'estimation** → Le slider d'intensité n'impacte pas l'estimation affichée. Pour l'instant, c'est acceptable car l'intensité n'est pas utilisée dans la construction des steps. Si elle l'était à l'avenir, l'estimation devrait être mise à jour.
