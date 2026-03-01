## Context

La page d'accueil (`app/page.tsx`) charge `exercises.json` via une Server Action (`getWorkoutConfig`) et affiche tous les exercices groupés. Elle permettait aussi d'ajouter et supprimer des exercices directement. La séance inclut systématiquement tous les exercices présents dans le fichier.

L'objectif est de passer à un modèle "catalogue + sélection de séance" : `exercises.json` est le **catalogue source de vérité** (modifiable uniquement depuis les Settings), et la page d'accueil permet de **sélectionner** les exercices à inclure dans la prochaine séance.

## Goals / Non-Goals

**Goals:**
- Afficher tous les exercices du catalogue avec un toggle de sélection per-exercice
- Persister la sélection dans `localStorage` (clé : `sporty_session_selection`)
- Restaurer la sélection à l'ouverture de la page
- Que seuls les exercices sélectionnés soient passés au timer au lancement
- Retirer les formulaires d'ajout et de suppression d'exercices de la page d'accueil

**Non-Goals:**
- Modifier `exercises.json` depuis la page d'accueil
- Implémenter des "presets" ou templates de séance
- Synchronisation cross-tab ou cloud du localStorage

## Decisions

### 1. Format de stockage localStorage

**Décision**: Stocker un `Set<string>` (JSON array) d'IDs d'exercices **sélectionnés**.  
**Pourquoi**: Compact et lisible. Facile à diff par rapport au catalogue courant pour gérer les exercices supprimés/ajoutés.  
**Alternative écartée**: Stocker les exercices non-sélectionnés (exclusions) — problématique car un nouvel exercice ajouté dans les Settings ne serait pas automatiquement inclus (comportement contre-intuitif ; l'utilisateur attend que les nouveaux exercices soient visibles et sélectionnables).  

**Comportement par défaut**: si aucune sélection en localStorage, **tous** les exercices sont sélectionnés (rétrocompatibilité avec le comportement actuel).

### 2. Suppression des formulaires Add/Delete de la home

**Décision**: Retirer complètement `AddExerciseForm` et le bouton de suppression de `page.tsx`.  
**Pourquoi**: Séparation claire des responsabilités. La page d'accueil = configuration de séance. Les Settings = gestion du catalogue.

### 3. Architecture de l'état de sélection

**Décision**: État local React `selectedIds: Set<string>` avec `useEffect` pour charger/sauvegarder en localStorage.  
**Pourquoi**: Simple, aucune dépendance supplémentaire (pas de Zustand, Redux, etc.). La page n'a pas besoin de partager cet état avec d'autres pages.

### 4. Filtre de la sélection au lancement

**Décision**: Filtrer les exercices dans `page.tsx` avant d'appeler `buildSessionSteps`.  
**Pourquoi**: Évite de modifier la logique de `session-utils.ts` — cette fonction reste pure. On lui passe un `WorkoutConfig` déjà filtré.

## Risks / Trade-offs

- **Désynchronisation localStorage / catalogue** : si un exercice est supprimé des Settings mais était sélectionné → son ID reste en localStorage mais ne sera pas trouvé dans le catalogue → sans impact (le filtre n'inclura tout simplement pas cet exercice). Le localStorage se "nettoie" de lui-même à chaque sauvegarde (on ne garde que les IDs présents dans le catalogue courant).
- **Sélection vide** → l'utilisateur n'a sélectionné aucun exercice : le bouton "Lancer" affiche déjà un message d'erreur dans ce cas, comportement inchangé.
