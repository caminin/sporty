## 1. Types et utilitaires de séquence

- [x] 1.1 Définir le type `SessionStep` (`work-time`, `work-reps`, `rest`) dans `app/workout-types.ts`
- [x] 1.2 Créer une fonction utilitaire `buildSessionSteps(config: WorkoutConfig): SessionStep[]` qui génère la séquence `[work, rest, work, rest, ..., work]` en filtrant les groupes vides
- [x] 1.3 Créer des fonctions `encodeSession(steps: SessionStep[]): string` et `decodeSession(encoded: string): SessionStep[]` utilisant JSON + base64 pour la transmission URL

## 2. Page d'accueil — bouton Lancer la séance

- [x] 2.1 Modifier `FloatingActionButton` dans `app/page.tsx` pour recevoir la `WorkoutConfig` en prop
- [x] 2.2 Implémenter l'action du bouton : appeler `buildSessionSteps()`, encoder la séquence, et naviguer vers `/timer?session=<encoded>` via `useRouter`
- [x] 2.3 Gérer le cas où tous les groupes sont vides : afficher un message d'erreur/toast à l'utilisateur au lieu de naviguer

## 3. Page Timer — refactoring pour séquence dynamique

- [x] 3.1 Lire le paramètre URL `session` dans `app/timer/page.tsx` via `useSearchParams` et décoder la séquence
- [x] 3.2 Gérer le cas d'erreur (paramètre absent ou JSON invalide) : afficher un message avec un bouton de retour à l'accueil
- [x] 3.3 Remplacer la logique de phase hardcodée par un index `currentStepIndex` dans la séquence dynamique
- [x] 3.4 Implémenter le mode `time` : compte à rebours automatique qui avance au step suivant à 0 (comportement existant, adapté)
- [x] 3.5 Implémenter le mode `reps` : affichage statique du nombre de répétitions en grand, pas de compte à rebours, bouton "Valider" pour avancer
- [x] 3.6 Implémenter le mode `rest` : compte à rebours automatique sur la durée configurée (couleur bleue comme actuellement)
- [x] 3.7 Ajouter un indicateur de progression visible (ex: "Exercice 3 / 7" ou barre de progression)

## 4. Écran de fin de boucle

- [x] 4.1 Détecter quand `currentStepIndex` dépasse le dernier step et passer en état `"finished"`
- [x] 4.2 Créer un overlay/écran de fin avec un message de félicitations et deux boutons : "Oui, refaire" et "Terminer"
- [x] 4.3 Implémenter "Oui, refaire" : remettre `currentStepIndex` à 0 et relancer la séquence sans rechargement
- [x] 4.4 Implémenter "Terminer" : naviguer vers `/` via `router.push`

## 5. Contrôles du timer — mise à jour

- [x] 5.1 Mettre à jour le bouton "Stop" pour qu'il permette de pauser et reprendre (`isRunning` toggle)
- [x] 5.2 Mettre à jour le bouton "Passer" pour avancer dans la séquence dynamique (au lieu de changer phase hardcodée)
- [x] 5.3 Masquer ou adapter les contrôles sur l'écran de fin (ne pas montrer Stop/Passer quand `state === "finished"`)
