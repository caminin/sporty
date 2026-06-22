## Context

`buildSessionSteps` insère aujourd'hui un step `rest` de durée `view.globalRestTime` après chaque work step sauf le dernier de la séance — y compris entre deux séries du même exercice. La spec `exercise-series` impose explicitement cette égalité. L'estimation homepage utilise `(workSteps - 1) × globalRestTime`, ce qui surestime la durée réelle une fois les repos inter-séries raccourcis.

Le timer lit la `duration` du step `rest` courant ; aucun changement UI n'est requis pour afficher le bon compte à rebours. L'indicateur « Repos avant série 2/3 » (`timer-series-indicator`) reste valide tel quel.

## Goals / Non-Goals

**Goals:**

- Distinguer repos **intra-bloc** (entre séries d'un même exercice) et repos **inter-exercice** (entre deux références différentes dans la séquence optimisée).
- Durée intra-bloc : `Math.max(1, Math.round(globalRestTime / 2))`.
- Durée inter-exercice : `globalRestTime` inchangé.
- Aligner `estimateSessionDuration` sur la même logique.
- Couvrir par tests unitaires les cas 2 et 3 séries, repos impair (ex. 15 → 8 s), et transition vers exercice suivant.

**Non-Goals:**

- Modifier `globalRestTime` côté admin ou sa sémantique utilisateur (« temps entre exercices »).
- Ajouter un champ configurable pour le ratio inter-séries.
- Marquer les steps `rest` avec un type explicite (`interSeries` vs `interExercise`) — la `duration` suffit pour le timer.
- Retoucher l'affichage série `1/3` (déjà livré).

## Decisions

### 1. Helper `seriesRestDuration(globalRestTime: number): number`

```ts
export function seriesRestDuration(globalRestTime: number): number {
  return Math.max(1, Math.round(globalRestTime / 2));
}
```

**Rationale :** Centralise la règle métier ; réutilisable dans `buildSessionSteps` et `estimateSessionDuration`. `Math.round` gère les impairs (15 → 8). `Math.max(1, …)` évite un repos nul si `globalRestTime` est 0 ou 1.

**Alternative rejetée :** `Math.floor` — sous-estime systématiquement (15 → 7) ; l'arrondi est plus équilibré pour des valeurs typiques (20, 30, 45 s).

### 2. Détection intra-bloc dans `buildSessionSteps`

Dans la boucle `for (let s = 0; s < series; s++)`, après chaque work step :

- Si `s < series - 1` → repos **intra-bloc** (`seriesRestDuration`).
- Sinon si `i < optimizedExercises.length - 1` → repos **inter-exercice** (`globalRestTime`).
- Sinon → pas de repos (dernier work de la séance).

**Rationale :** La structure actuelle (boucle série imbriquée dans boucle exercice) rend la distinction triviale sans comparer les noms d'exercices.

**Alternative rejetée :** Comparer `name` du work précédent et suivant — fragile et redondant avec la structure de boucle.

### 3. Estimation homepage

Pour chaque placement résolu avec `series = S` :

- Ajouter `(S - 1) × seriesRestDuration(globalRestTime)` pour les gaps intra-bloc.
- Après expansion virtuelle de tous les work steps dans l'ordre optimisé, ajouter `globalRestTime` pour chaque transition entre deux blocs d'exercices différents (c.-à-d. `(nombre de références sélectionnées - 1)` transitions inter-bloc, ou équivalent en parcourant la séquence optimisée).

Implémentation pragmatique : réutiliser la logique de comptage en simulant l'expansion (compter work steps et appliquer la même règle que `buildSessionSteps`) ou factoriser un helper `countRestSeconds(view, selectedIds)` partagé.

### 4. Pas de changement de type `SessionStep`

Le step `rest` garde `{ kind: "rest", duration: number }`. Le timer et l'encodage URL restent compatibles.

## Risks / Trade-offs

- **[Estimation légèrement différente du passé]** → Comportement voulu ; les utilisateurs verront une durée plus courte sur les entraînements multi-séries.
- **[globalRestTime impair]** → Arrondi documenté ; tests sur 15 et 21 s.
- **[globalRestTime = 0]** → Repos inter-séries forcé à 1 s ; repos inter-exercice reste 0 — edge case rare, acceptable.

## Migration Plan

1. Implémenter helper + `buildSessionSteps` + tests.
2. Mettre à jour `estimateSessionDuration` + tests homepage.
3. Déploiement sans migration de données ; les sessions sont régénérées à chaque lancement depuis l'entraînement actif.

## Open Questions

- Aucune.
