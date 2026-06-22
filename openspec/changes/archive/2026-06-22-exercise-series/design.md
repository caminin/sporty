## Context

Chaque `exerciseRefs` d'un entraînement représente aujourd'hui une seule exécution en séance. Le repos `globalRestTime` s'applique uniquement entre deux exercices distincts dans la séquence optimisée (`buildSessionSteps` dans `session-utils.ts`). L'admin permet déjà un override de `value` par référence ; il n'existe pas de champ pour répéter un exercice.

## Goals / Non-Goals

**Goals:**

- Permettre `series` (entier ≥ 2 persisté ; défaut 1 implicite sans champ) sur chaque `GroupExerciseRef`.
- Après le séquençage musculaire existant, développer chaque placement en N étapes `work` **enchaînées d'affilée** (bloc indivisible avant l'exercice suivant), avec une étape `rest` de durée `globalRestTime` entre chaque paire d'étapes `work` (y compris entre deux séries du même exercice).
- Exposer l'édition des séries dans l'onglet Entraînements et dans l'import/export JSON.
- Mettre à jour l'estimation de durée sur l'accueil.

**Non-Goals:**

- Repos différents entre séries vs entre exercices (l'utilisateur a demandé le même temps).
- Séries au niveau du catalogue global (uniquement par référence dans l'entraînement).
- Round-robin inter-séries entre exercices (ex. A1, B1, A2, B2) : on garde l'ordre optimisé actuel et on répète chaque slot en bloc.
- Indicateur visuel « série 2/3 » dans le timer (hors scope sauf si trivial) — peut être une amélioration ultérieure.

## Decisions

### 1. Champ `series` optionnel sur `GroupExerciseRef`

```ts
interface GroupExerciseRef {
  refId: string;
  exerciseId: string;
  value?: number;
  series?: number; // ≥ 2 seulement ; absent = 1 série
}
```

**Rationale :** Cohérent avec `value` (override par placement). Rétrocompatible : fichiers existants sans `series` restent à 1 série.

**Alternative rejetée :** Dupliquer les refs dans `exerciseRefs` — encombre l'admin et fausse le séquençage (traité comme des exercices distincts).

### 2. Expansion des séries après `optimizeExerciseSequence`

Le pipeline reste :

1. Résoudre les refs → une entrée par ref avec `series` effectif.
2. Optimiser l'ordre (inchangé, une entrée par ref).
3. Pour chaque entrée, émettre `series` étapes `work` ; entre deux étapes `work` consécutives (même exercice ou non), insérer `rest` avec `globalRestTime`.

**Rationale :** Préserve l'algorithme d'alternance musculaire. Un exercice à 3 séries reste groupé dans le flux : A → repos → A → repos → A → repos → B…

**Alternative rejetée :** Expansion avant optimisation (3 refs virtuelles) — casserait l'alternance et multiplierait les entrées dans l'UI admin.

### 3. `getEffectiveSeries(ref)` avec défaut 1

Fonction utilitaire miroir de `getEffectiveValue`, utilisée dans validation, résolution, session et estimation.

Validation : `series` si présent doit être un entier ≥ 2 ; valeur 1 ou absente = une seule série, champ omis à la persistance.

### 4. Persistance admin via extension de `updateTrainingExerciseRef`

Étendre l'action existante pour accepter `series` en plus de `value`, plutôt qu'une nouvelle action — même granularité (une ref).

### 5. Formule d'estimation mise à jour

Pour les placements sélectionnés :

- `workSteps = sum(effectiveSeries(ref))` pour chaque ref sélectionnée
- Temps travail : inchangé par étape work (5s startup + valeur effective)
- Repos : `(workSteps - 1) × globalRestTime` si `workSteps > 1`, sinon 0

**Rationale :** Alignée sur la règle « repos entre chaque work consécutif, jamais après le dernier ».

## Risks / Trade-offs

- **[Séries longues sur un même muscle]** → Accepté : comportement voulu pour l'isolation ; l'utilisateur peut réduire les séries ou réorganiser l'entraînement.
- **[Timer sans libellé série]** → L'utilisateur ne voit pas « 2/3 » ; acceptable en v1, amélioration UI possible plus tard.
- **[JSON legacy]** → Absence de `series` = 1 ; pas de migration destructive.

## Migration Plan

1. Déployer types + validation (défaut 1).
2. Mettre à jour `buildSessionSteps` et `estimateSessionDuration`.
3. UI admin + tests.
4. Aucune réécriture obligatoire des fichiers `exercice_list/` ; les entraînements bundlés restent valides.

Rollback : retirer le champ `series` du code ; les fichiers avec `series` persisté sont ignorés ou validés selon version.

## Open Questions

- Aucune pour l'instant — le repos inter-séries = `globalRestTime` est confirmé par l'utilisateur.
