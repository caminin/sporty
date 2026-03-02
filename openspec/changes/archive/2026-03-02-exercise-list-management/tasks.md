## 1. Configuration serveur et stockage

- [x] 1.1 Créer le répertoire `/data/exercise-lists/` et la structure de stockage
- [x] 1.2 Implémenter la migration automatique de `exercises.json` vers `default.json`
- [x] 1.3 Créer les utilitaires de lecture/écriture des fichiers de listes
- [x] 1.4 Mettre à jour la configuration Docker pour ajouter le volume `/data`

## 2. API et logique serveur

- [x] 2.1 Créer les Server Actions pour lister les listes disponibles
- [x] 2.2 Implémenter l'API de chargement d'une liste spécifique
- [x] 2.3 Créer l'API de sauvegarde des modifications d'une liste
- [x] 2.4 Implémenter la création et suppression de listes avec validation
- [x] 2.5 Ajouter l'authentification admin (mot de passe "sporty")

## 3. Interface utilisateur d'administration

- [x] 3.1 Étendre l'interface des paramètres avec l'onglet "Gestion des listes"
- [x] 3.2 Implémenter le système d'authentification dans l'interface
- [x] 3.3 Créer l'interface de sélection et gestion des listes
- [x] 3.4 Intégrer la gestion des listes avec l'interface existante des groupes

## 4. Intégration et compatibilité

- [x] 4.1 Modifier le système de chargement pour utiliser les listes sélectionnées
- [x] 4.2 Assurer la compatibilité avec l'interface existante des séances
- [x] 4.3 Tester la migration automatique et la persistance des données
- [x] 4.4 Vérifier que toutes les fonctionnalités existantes restent opérationnelles