## Context

Suite à l'implémentation du système de listes d'exercices, il a été découvert que l'interface de gestion des exercices (`app/group-settings/page.tsx`) ne permet d'ajouter des exercices que dans la liste par défaut. Cela rend le système de listes inutilisable car les utilisateurs ne peuvent pas créer des programmes d'entraînement personnalisés.

Le problème vient du fait que les fonctions d'ajout/modification/suppression d'exercices dans l'interface de gestion utilisent des références codées en dur à la liste actuelle (`currentList`) au lieu d'utiliser la liste sélectionnée globalement.

## Goals / Non-Goals

**Goals:**
- Permettre l'ajout d'exercices dans n'importe quelle liste via l'interface de gestion
- Synchroniser l'interface de gestion avec la liste sélectionnée globalement
- Maintenir la cohérence entre l'interface principale et l'interface de gestion

**Non-Goals:**
- Refactorer complètement l'architecture des listes (le système fonctionne bien)
- Changer les permissions admin ou la structure des données
- Ajouter de nouvelles fonctionnalités de gestion des listes

## Decisions

### Architecture de synchronisation des listes
**Décision**: Utiliser le contexte `ExerciseListContext` dans l'interface de gestion pour rester synchronisé avec la liste sélectionnée globalement.

**Rationale**: Cela garantit que l'interface de gestion travaille toujours avec la même liste que celle sélectionnée dans l'interface principale.

**Alternatives considérées**:
- Props drilling : Plus complexe et sujet aux erreurs
- État local séparé : Risque d'incohérence entre les interfaces

### Gestion des listes dans l'interface de gestion
**Décision**: Supprimer la logique de `currentList` dans l'interface de gestion et utiliser uniquement la liste sélectionnée globalement.

**Rationale**: L'interface de gestion devrait toujours travailler sur la liste active, pas sur une liste "courante" spécifique à cette interface.

**Alternatives considérées**:
- Garder la logique currentList : Maintenait l'incohérence
- Interface séparée par liste : Trop complexe pour l'utilisateur

## Risks / Trade-offs

**Risk: Confusion utilisateur avec plusieurs listes** → Mitigation: Interface claire indiquant toujours quelle liste est active

**Risk: Perte de fonctionnalités existantes** → Mitigation: Tests exhaustifs avant déploiement

**Risk: Incohérence entre interfaces** → Mitigation: Utilisation du même contexte dans toutes les interfaces