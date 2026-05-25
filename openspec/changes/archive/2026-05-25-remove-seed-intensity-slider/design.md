## Context

- `default-seed.json` alimente uniquement `seedExerciseList` → action admin « Réinitialiser » (`seedListWithDefaultTemplate`) dans `group-settings`.
- Les listes réelles viennent de `exercise-lists/` (création, import JSON, dossier `exercice_list/`).
- La page d’accueil (`app/page.tsx`) expose `IntensityControl` + `SessionSummary` dans la même carte ; l’intensité est propagée à l’affichage, `estimateSessionDuration`, `buildSessionSteps` / URL timer.

## Goals / Non-Goals

**Goals:**

- Supprimer le seed fichier + API + UI admin associée.
- Retirer le slider d’intensité tout en gardant le résumé (compteur, repos, durée estimée).
- Simplifier `session-utils` et la page d’accueil (plus de state `intensity`).

**Non-Goals:**

- Changer le modèle catalogue / références (`central-exercise-catalog`).
- Ajouter un autre mécanisme de « reset » (ré-import manuel reste le chemin).
- Modifier les overrides par exercice dans les groupes (valeurs effectives inchangées).

## Decisions

### 1. Retrait complet du seed (pas de remplacement)

**Choix** : Supprimer `default-seed.json`, `loadDefaultSeedConfig`, `seedExerciseList`, `seedListWithDefaultTemplate`, tests dédiés, entrée Dockerfile.

**Alternative** : Pointer le seed vers un fichier dans `exercice_list/`. Rejeté : redondant avec l’import manuel déjà en place.

### 2. Intensité = identité (1,0)

**Choix** : Retirer le paramètre `intensity` des signatures publiques (`estimateSessionDuration`, `buildSessionSteps`, props React) plutôt que le laisser optionnel à 1,0 — API plus claire.

**Alternative** : Garder le paramètre avec défaut 1,0. Rejeté : dette morte et confusion pour les lecteurs du code.

### 3. UI accueil

**Choix** : Supprimer `IntensityControl` ; la section conserve uniquement `SessionSummary` (même carte ou layout resserré sans titre « Intensité Globale »).

**Alternative** : Déplacer l’intensité dans les réglages. Rejeté : hors scope, l’utilisateur ne veut plus ce réglage.

### 4. Admin group-settings

**Choix** : Retirer le bouton « Réinitialiser » et le handler associé. Documenter que la récupération passe par ré-import / copie de liste.

## Risks / Trade-offs

- **[Perte du reset one-click]** Les admins ne peuvent plus vider/remplir une liste via seed. → Mitigation : import JSON / duplication de liste existante.
- **[URLs de séance anciennes]** D’éventuelles sessions encodées avec valeurs déjà scalées restent valides côté timer (pas de changement de format URL si on ne touche qu’à l’encodage futur). → Pas de migration URL requise si l’encodeur n’appliquait déjà que des steps finaux.
- **[Specs archivées]** Références historiques au seed dans changements archivés — inchangées.

## Migration Plan

1. Supprimer fichier seed + fonctions seed + action serveur + bouton UI.
2. Simplifier `page.tsx` et `session-utils.ts` ; ajuster tests.
3. Retirer copie Dockerfile.
4. Mettre à jour skill `create-exercise-list` / docs si elles imposent encore `default-seed.json`.
5. Valider : `npm test` (ou suite ciblée listes + session-utils).

Rollback : restaurer `default-seed.json` et commits UI depuis git.

## Open Questions

_(aucune — périmètre validé par la demande utilisateur)_
