## Context

La page `/group-settings` affiche actuellement 3 onglets :
1. **Groupes d'exercices** : groupes prédéfinis (Cardio endurance, Épaules et frappe, Adbos, Explosivité jambes, Agilité et déplacements) + possibilité d'ajouter le premier groupe si vide
2. **Groupes personnalisés** : création/édition/suppression de groupes avec icônes
3. **Gestion des listes** : CRUD des listes d'exercices (admin)

Les groupes prédéfinis proviennent de `exercises.json` et sont migrés vers la structure unifiée (`id`, `name`, `icon`, `createdAt`, `exercises`). Les groupes personnalisés ont un `id` préfixé par `custom_`.

## Goals / Non-Goals

**Goals:**
- Un seul onglet "Groupes d'exercices" qui regroupe toute la gestion des groupes (création, édition, suppression, ajout d'exercices)
- Suppression des groupes prédéfinis : plus de données par défaut dans `exercises.json`
- Tous les groupes sont désormais des groupes "personnalisés" (créés par l'utilisateur avec nom + icône)

**Non-Goals:**
- Ne pas modifier le système de listes ni l'onglet "Gestion des listes"
- Ne pas changer la structure de données des groupes (Group reste inchangé)
- Ne pas migrer les groupes prédéfinis existants vers des groupes personnalisés (on part de zéro)

## Decisions

### 1. Stratégie de migration des données existantes

**Décision** : Lors de la migration depuis l'ancien format (tableaux d'exercices par nom de groupe), ne plus créer de groupes prédéfinis. Les listes déjà migrées conservent leurs groupes (ils ont déjà la structure unifiée). Pour les nouvelles installations ou `exercises.json` : `groups: {}`.

**Alternative** : Convertir les groupes prédéfinis existants en groupes personnalisés (avec `custom_` id). Rejeté car l'utilisateur veut "que des groupes personnalisés" — donc partir de zéro, pas conserver l'ancien contenu.

### 2. Contenu de `exercises.json`

**Décision** : Remplacer le contenu par `{ "globalRestTime": 15, "groups": {} }`. Ce fichier sert de seed pour la liste par défaut lors de la première initialisation.

### 3. Nettoyage du code "prédéfini"

**Décision** : Supprimer `PREDEFINED_GROUP_ICONS` et `generatePredefinedGroupId` de `types.ts`. La fonction `addExercise` dans `actions.ts` ne doit plus créer de groupe "prédéfini" : si le groupe n'existe pas, on lève une erreur ou on utilise `createGroup` en amont. L'UI du premier groupe (création groupe + premier exercice en une fois) reste valide car elle appelle `addExercise` avec un nouveau nom — il faudra adapter pour créer le groupe via `createGroup` d'abord, puis ajouter l'exercice.

**Alternative** : Garder `addExercise` capable de créer un groupe à la volée, mais toujours avec un `id` de type `custom_`. Simplifie le flux "premier groupe" sans réintroduire la notion de prédéfini.

### 4. Flux "premier groupe" dans l'UI

**Décision** : Conserver le formulaire "premier groupe" (nom du groupe + premier exercice en un bloc) pour l'état vide. Lors de la soumission, appeler `createGroup` puis `addExerciseToGroup` (ou une action combinée). Cela évite de dupliquer la logique et garde une UX fluide.

## Risks / Trade-offs

- **[Perte de données]** Les utilisateurs ayant des groupes prédéfinis migrés perdront ces groupes si on vide `exercises.json` et qu'on réinitialise la liste par défaut. → Mitigation : ne pas toucher aux listes déjà créées sur disque ; seul le seed `exercises.json` change. Les listes existantes gardent leurs groupes.

- **[Régression]** Si `addExercise` est appelé avec un groupe inexistant (bug ou ancien code), l'appel échouera. → Mitigation : s'assurer que l'UI n'appelle `addExercise` que pour des groupes existants ; le formulaire "premier groupe" crée le groupe avant d'ajouter l'exercice.

## Migration Plan

1. Modifier `exercises.json` : `groups: {}`
2. Modifier `workout-config.ts` : la migration depuis l'ancien format ne crée plus de groupes prédéfinis (retourner `groups: {}` pour l'ancien format, ou ignorer les groupes du fichier)
3. Modifier `group-settings/page.tsx` : supprimer l'onglet "Groupes d'exercices" (prédéfinis), renommer/fusionner le contenu de "Groupes personnalisés" dans l'unique onglet "Groupes d'exercices"
4. Nettoyer `types.ts` et `actions.ts` : supprimer les références aux groupes prédéfinis
5. Adapter le flux "premier groupe" pour utiliser `createGroup` + `addExerciseToGroup`

Pas de rollback spécifique : les listes sur disque ne sont pas modifiées rétroactivement.
