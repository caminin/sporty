## Context

L'application utilise un système de listes d'exercices avec un contexte global (`ExerciseListContext`) pour gérer la liste sélectionnée actuellement. L'interface de gestion des listes dans `group-settings/page.tsx` permet de changer de liste, mais cette action ne synchronise pas correctement avec le contexte global.

Le problème actuel :
- L'indicateur visuel de sélection (bordure verte) dépend de `selectedListId` du contexte
- La fonction `handleListChange` ne met pas à jour ce contexte, donc l'indicateur ne change jamais
- L'utilisateur reste confus car l'interface ne reflète pas la liste réellement active

## Goals / Non-Goals

**Goals:**
- Synchroniser la sélection de liste entre l'interface de gestion et le contexte global
- Corriger l'indicateur visuel de sélection de liste
- Assurer que tous les composants utilisent la même source de vérité pour la liste sélectionnée

**Non-Goals:**
- Refactorer complètement l'architecture de gestion d'état
- Changer l'interface utilisateur existante
- Ajouter de nouvelles fonctionnalités de listes

## Decisions

**Utiliser le contexte global comme source de vérité unique**
- La fonction `handleListChange` doit mettre à jour `useExerciseList().setSelectedListId(listId)` au lieu de gérer l'état local uniquement
- Cela garantit que tous les composants de l'application utilisent la même liste sélectionnée

**Maintenir la persistance localStorage**
- Le contexte gère déjà la sauvegarde dans localStorage, donc pas de changement nécessaire ici
- La synchronisation sera automatique via le contexte

**Pas de changement d'architecture majeur**
- Garder la structure existante avec `useExerciseList()` comme hook principal
- Éviter de casser les autres utilisations du contexte

## Risks / Trade-offs

**Risk: Changements dans d'autres composants**
- Si d'autres composants dépendent de l'ancien comportement, ils pourraient être affectés
- Mitigation: Tester tous les endroits où `selectedListId` est utilisé

**Risk: Perte de synchronisation temporaire**
- Pendant le chargement asynchrone de la nouvelle liste, il pourrait y avoir un état incohérent
- Mitigation: Afficher un indicateur de chargement et désactiver les interactions pendant le changement