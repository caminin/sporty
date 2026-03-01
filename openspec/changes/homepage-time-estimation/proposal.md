## Why

La page d'accueil affiche des informations redondantes ou incorrectes (le widget "Difficulté" est hardcodé et sans valeur réelle, le curseur d'intensité démarre à 1.2 au lieu de 1.0), et ne donne aucune estimation du temps total de la séance. L'utilisateur ne peut pas anticiper la durée avant de lancer. De plus, la règle métier "ne jamais commencer par un repos" doit être garantie dans la construction de la séance.

## What Changes

- Le curseur **Intensité Globale** passe à **1.0** comme valeur par défaut (au lieu de 1.2)
- Suppression du bloc **"Difficulté"** dans le résumé de séance (statique, non pertinent)
- Ajout d'un affichage **"Durée estimée"** dans le résumé de séance, calculé dynamiquement selon les exercices sélectionnés :
  - 5 secondes de démarrage par exercice
  - Pour les exercices en **répétitions** : 3 secondes × nombre de répétitions
  - Pour les exercices en **temps** : durée de l'exercice en secondes
  - Temps de repos (`globalRestTime`) entre chaque exercice (sauf après le dernier)
- Garantie que la **première étape** de la séance n'est jamais un repos (`buildSessionSteps`)

## Capabilities

### New Capabilities
- `homepage-session-time-estimate`: Calcul et affichage du temps total estimé d'une séance à partir des exercices sélectionnés, avec formules paramétrées (5s/démarrage, 3s/rep)

### Modified Capabilities
- `home-page-exercise-management`: Valeur par défaut de l'intensité modifiée (1.2 → 1.0) et suppression du bloc Difficulté dans le résumé
- `session-exercise-selection`: Le résumé de séance affiche maintenant la durée estimée au lieu de la difficulté

## Impact

- `app/page.tsx` : `IntensityControl` (valeur par défaut), `SessionSummary` (suppression Difficulté, ajout durée estimée)
- `app/session-utils.ts` : `buildSessionSteps` (garantie de ne pas commencer par un repos)
- Aucune dépendance externe, aucune API modifiée
