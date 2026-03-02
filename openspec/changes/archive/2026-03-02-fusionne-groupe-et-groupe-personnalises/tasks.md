## 1. Mise à jour des types et structures de données

- [x] 1.1 Étendre l'interface Group pour inclure métadonnées (id, icon, createdAt)
- [x] 1.2 Modifier WorkoutConfig pour utiliser Record<string, Group> au lieu de customGroups séparé
- [x] 1.3 Créer des utilitaires pour la génération d'IDs déterministes pour groupes prédéfinis
- [x] 1.4 Définir le mapping des icônes par défaut pour les groupes prédéfinis

## 2. Implémentation de la logique de migration

- [x] 2.1 Créer une fonction de migration automatique des configurations anciennes
- [x] 2.2 Implémenter la fusion des customGroups existants dans groups
- [x] 2.3 Ajouter la validation des groupes migrés
- [x] 2.4 Créer des tests unitaires pour la migration

## 3. Mise à jour du système de stockage

- [x] 3.1 Modifier les fonctions de chargement pour appliquer la migration automatiquement
- [x] 3.2 Étendre les fonctions de sauvegarde pour supporter la nouvelle structure
- [x] 3.3 Mettre à jour la validation des configurations lors du chargement
- [x] 3.4 Implémenter la persistance des métadonnées des groupes

## 4. Adaptation de l'interface utilisateur

- [x] 4.1 Modifier les composants d'affichage des groupes pour utiliser la structure unifiée (API actions mise à jour)
- [x] 4.2 Mettre à jour les sélecteurs d'exercices pour inclure tous les types de groupes
- [x] 4.3 Adapter l'interface de création de groupes personnalisés
- [x] 4.4 Tester l'affichage des icônes pour tous les groupes

## 5. Mise à jour de l'export JSON

- [x] 5.1 Modifier la fonction d'export pour inclure tous les groupes (prédéfinis et personnalisés)
- [x] 5.2 Maintenir la rétrocompatibilité du format d'export
- [x] 5.3 Ajouter des tests pour l'export des configurations unifiées

## 6. Tests et validation

- [x] 6.1 Créer des tests d'intégration pour la migration automatique (tests de migration créés et passant)
- [x] 6.2 Tester la création, modification et suppression de groupes dans la structure unifiée
- [x] 6.3 Valider le fonctionnement avec les configurations existantes
- [x] 6.4 Tester la persistance et le chargement des métadonnées (tests session-utils passant)