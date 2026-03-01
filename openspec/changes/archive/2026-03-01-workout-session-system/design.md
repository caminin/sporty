## Context

La page d'accueil (`/`) liste des exercices groupés issus de `exercises.json` et dispose d'un bouton "Lancer la séance" actuellement non fonctionnel. La page timer (`/timer`) existe mais utilise des données fixes codées en dur. L'objectif est de les connecter en transmettant la séquence d'exercices réelle au timer, et de gérer la fin de boucle avec une invite de relancer.

Deux types d'exercices existent : `type: "time"` (durée en secondes) et `type: "reps"` (nombre de répétitions). La configuration globale inclut `globalRestTime` (temps de repos entre exercices, en secondes).

## Goals / Non-Goals

**Goals:**
- Passer la séquence d'exercices dynamique depuis la page d'accueil au timer via les paramètres de l'URL (query string sérialisée en JSON encodé en base64 ou en `searchParams`).
- Refactoriser `TimerPage` pour consommer une séquence `SessionStep[]` (exercice + repos) générée à partir de la config.
- Afficher un **écran de fin** à la fin de la séquence proposant "Refaire une boucle ?" (Oui / Non).
- Gérer les deux types d'exercices : `time` → compte à rebours automatique ; `reps` → affichage statique du nombre de reps + bouton "Valider" pour passer à l'étape suivante.

**Non-Goals:**
- Persistance de l'historique des séances.
- Authentification ou synchronisation backend.
- Modification de `exercises.json` ou de `group-settings`.
- Gestion du slider d'intensité pour modifier les durées à la volée (hors scope).

## Decisions

### 1. Transmission des données via URL (searchParams)

**Choix** : Encoder la séquence d'exercices en JSON base64 dans un paramètre URL `session`.  
**Pourquoi** : Next.js App Router ne fournit pas de store global cross-page simple côté client. L'URL est la solution la plus simple et la plus partageable sans état serveur.  
**Alternative écartée** : `localStorage` — moins fiable sur mobile, nécessite une synchronisation manuelle. `Zustand`/`Context` — surcharge d'une dépendance pour un besoin minimal.

### 2. Structure de la séquence (`SessionStep[]`)

Chaque step est soit un exercice work, soit un repos :
```ts
type SessionStep =
  | { kind: "work"; name: string; group: string; type: "time"; duration: number }
  | { kind: "work"; name: string; group: string; type: "reps"; reps: number }
  | { kind: "rest"; duration: number };
```
La séquence est construite côté page d'accueil : `[work, rest, work, rest, ..., work]` (pas de repos après le dernier exercice).

### 3. Comportement par type d'exercice

- **`time`** : Compte à rebours automatique (comme le timer actuel). Passe automatiquement à l'étape suivante quand `timeLeft === 0`.
- **`reps`** : Affichage statique du nombre de répétitions. Le timer ne décompte pas. Un bouton "Valider / Terminé" permet de passer manuellement à l'étape suivante.
- **`rest`** : Compte à rebours automatique (durée = `globalRestTime`).

### 4. Écran de fin de boucle

À la fin du dernier step, le timer passe en mode `"finished"`. Un overlay plein écran s'affiche avec :
- Message de félicitation.
- Bouton **"Oui, refaire"** → remet `currentStepIndex` à 0 et relance.
- Bouton **"Terminer"** → `router.push("/")`.

## Risks / Trade-offs

- **URL trop longue** : Avec beaucoup d'exercices, l'URL encodée peut dépasser les limites du navigateur (~2000 chars). → Mitigation : filtrer les groupes vides avant encoding ; si besoin, basculer sur sessionStorage en dernier recours.
- **Rafraîchissement de page** : Actualisé en pleine session, le timer repart à l'état initial du step en cours (car l'URL est conservée). Comportement acceptable pour une première version.
- **Exercices `reps` sans timer** : L'utilisateur doit valider manuellement. Si oubli, la séance stagne. → Mitigation : afficher un rappel visuel clair et un bouton "Valider" proéminent.
