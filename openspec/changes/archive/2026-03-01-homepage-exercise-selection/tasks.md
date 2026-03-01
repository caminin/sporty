## 1. Retrait des formulaires Add/Delete de la home

- [x] 1.1 Supprimer le composant `AddExerciseForm` de `app/page.tsx`
- [x] 1.2 Supprimer le bouton "Supprimer" (Trash2) dans `ExerciseGroupBlock`
- [x] 1.3 Retirer les props `onDelete`, `onAdd`, `isPending` de `ExerciseGroupBlock` et mettre à jour sa signature
- [x] 1.4 Retirer les handlers `handleDelete` et `handleAdd` du composant principal `BadmintonSessionPage`
- [x] 1.5 Retirer l'import de `useTransition`, `addExercise`, `deleteExercise` s'ils ne sont plus utilisés

## 2. État de sélection des exercices

- [x] 2.1 Ajouter l'état `selectedIds: Set<string>` dans `BadmintonSessionPage` (par défaut : tous les IDs sélectionnés)
- [x] 2.2 Implémenter `loadSelection(config)` : lit `localStorage.getItem('sporty_session_selection')`, parse le JSON. Si absent ou invalide, retourner tous les IDs du catalogue
- [x] 2.3 Implémenter `saveSelection(selectedIds)` : sérialise le Set en JSON array et écrit dans `localStorage.setItem('sporty_session_selection', ...)`
- [x] 2.4 Dans le `useEffect` post-chargement du config, appeler `loadSelection(config)` pour initialiser `selectedIds`
- [x] 2.5 Implémenter le handler `handleToggle(exerciseId: string)` : toggle l'ID dans `selectedIds`, met à jour l'état et appelle `saveSelection`

## 3. UI de sélection dans ExerciseGroupBlock

- [x] 3.1 Ajouter les props `selectedIds: Set<string>` et `onToggle: (id: string) => void` à `ExerciseGroupBlock`
- [x] 3.2 Dans la liste des exercices, ajouter une checkbox (ou un toggle stylisé) par exercice, liée à `selectedIds.has(ex.id)` et déclenchant `onToggle(ex.id)` au clic
- [x] 3.3 Styler visuellement les exercices non-sélectionnés (opacité réduite, texte barré ou grisé) pour rendre la sélection évidente
- [x] 3.4 Mettre à jour le compteur affiché dans le header du groupe pour ne compter que les exercices sélectionnés de ce groupe

## 4. Filtrage de la sélection au lancement

- [x] 4.1 Dans `FloatingActionButton` (ou dans `handleLaunch`), construire un `filteredConfig` en ne gardant dans chaque groupe que les exercices dont l'ID est dans `selectedIds`
- [x] 4.2 Passer `filteredConfig` (et non `config`) à `buildSessionSteps` pour que le timer ne reçoive que les exercices sélectionnés
- [x] 4.3 Mettre à jour le compteur `totalExercises` dans `SessionSummary` pour refléter uniquement les exercices sélectionnés

## 5. Nettoyage localStorage au chargement

- [x] 5.1 Lors de la sauvegarde de la sélection, filtrer les IDs pour ne conserver que ceux présents dans le catalogue courant (évite l'accumulation d'IDs obsolètes)
