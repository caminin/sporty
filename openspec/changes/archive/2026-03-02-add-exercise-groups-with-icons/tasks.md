## 1. Types et structures de données

- [x] 1.1 Créer les types TypeScript pour les groupes personnalisés (CustomGroup, CustomGroupMetadata)
- [x] 1.2 Étendre l'interface WorkoutConfig pour inclure customGroups
- [x] 1.3 Créer un mapping des icônes Lucide disponibles avec leurs catégories

## 2. Système de stockage étendu

- [x] 2.1 Étendre les fonctions de chargement/sauvegarde pour supporter customGroups
- [x] 2.2 Ajouter la validation des groupes personnalisés lors du chargement
- [x] 2.3 Implémenter la migration backward-compatible pour les configurations existantes
- [x] 2.4 Créer les fonctions CRUD pour les groupes personnalisés (create, update, delete)

## 3. Bibliothèque d'icônes

- [x] 3.1 Créer un composant IconPicker avec grille d'icônes organisées par catégories
- [x] 3.2 Implémenter la recherche et le filtrage d'icônes
- [x] 3.3 Ajouter l'aperçu des icônes avec adaptation au thème
- [x] 3.4 Créer une fonction utilitaire pour le rendu des icônes par nom

## 4. Interface de création de groupes

- [x] 4.1 Ajouter un nouvel onglet "Groupes personnalisés" dans la page group-settings
- [x] 4.2 Créer le formulaire de création de groupe (nom + sélection d'icône)
- [x] 4.3 Implémenter la validation des noms de groupes (unicité, non-vide)
- [x] 4.4 Ajouter la logique de création et redirection vers l'édition

## 5. Interface d'édition des groupes

- [x] 5.1 Créer l'interface d'affichage des groupes personnalisés existants
- [x] 5.2 Implémenter l'édition du nom et de l'icône des groupes
- [x] 5.3 Ajouter la fonctionnalité de suppression avec confirmation
- [x] 5.4 Gérer la suppression de groupes avec exercices (confirmation spéciale)

## 6. Gestion des exercices dans les groupes personnalisés

- [x] 6.1 Étendre les actions existantes pour supporter les groupes personnalisés
- [x] 6.2 Adapter l'interface d'ajout d'exercices aux groupes personnalisés
- [x] 6.3 Modifier l'affichage des exercices pour inclure les groupes personnalisés
- [x] 6.4 Gérer la suppression d'exercices dans les groupes personnalisés

## 7. Intégration avec l'interface principale

- [x] 7.1 Modifier la page d'accueil pour afficher les groupes personnalisés avec icônes
- [x] 7.2 Adapter les sélecteurs d'exercices pour inclure les groupes personnalisés
- [x] 7.3 Mettre à jour l'export JSON pour inclure les groupes personnalisés (fonctionnalité non implémentée)
- [x] 7.4 Tester l'intégration avec le système de listes existant

## 8. Tests et validation

- [x] 8.1 Créer des tests unitaires pour les nouvelles fonctions de stockage
- [x] 8.2 Tester la création, modification et suppression de groupes personnalisés
- [x] 8.3 Valider l'affichage des icônes dans toutes les interfaces
- [x] 8.4 Tester la compatibilité backward avec les configurations existantes