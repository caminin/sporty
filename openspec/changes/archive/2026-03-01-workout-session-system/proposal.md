## Why

Actuellement, le bouton "Lancer la séance" de la page principale ne fait rien : le timer (`/timer`) existe mais fonctionne de façon autonome avec des données codées en dur, sans connexion avec la configuration réelle de la séance (exercices, groupes, temps de repos). Il faut relier la page d'accueil au timer, faire défiler tous les exercices de façon séquentielle, et proposer à l'utilisateur de refaire une boucle à la fin.

## What Changes

- Le bouton **"Lancer la séance"** de `page.tsx` redirige vers le timer avec la liste d'exercices réelle (issue de `exercises.json`) encodée en paramètre de navigation (ou via état partagé).
- Le composant **TimerPage** (`/timer/page.tsx`) est restructuré pour :
  - Recevoir la séquence dynamique d'exercices (work + rest) depuis la config réelle.
  - Faire défiler tous les exercices dans l'ordre : exercise → rest → exercise → rest → … jusqu'au dernier exercice.
  - À la fin de la boucle, afficher un **écran de fin** demandant : *"Refaire une autre boucle ?"* avec deux boutons : **Oui** (relance depuis le début) et **Non / Terminer** (retour à l'accueil).
- **Filtrage des exercices vides** : les groupes sans exercices sont ignorés lors du lancement.
- Le timer prend en compte `type: "time"` (compte à rebours) et `type: "reps"` (compte à rebours de 30s ou affichage du nombre de reps avec validation manuelle).

## Capabilities

### New Capabilities
- `workout-session-flow`: Orchestration complète d'une séance — lancement depuis la page d'accueil, défilement séquentiel des exercices/repos via le timer, et proposition de reboucler à la fin.

### Modified Capabilities
- `timer-view`: La vue timer doit accepter une séquence dynamique d'exercices et afficher l'écran de fin avec la question "Refaire une autre boucle ?".

## Impact

- `app/page.tsx` : modification du `FloatingActionButton` pour passer la config au timer (router.push ou lien avec paramètres).
- `app/timer/page.tsx` : refactoring pour consommer la séquence dynamique, gérer la fin de boucle et l'écran de relance.
- `app/exercises-actions.ts` : potentiellement utilisé côté client pour récupérer la config avant de lancer le timer.
- `app/workout-types.ts` : stabilisé, pas de changement prévu.
- Aucun changement d'API backend, aucune nouvelle dépendance externe.
