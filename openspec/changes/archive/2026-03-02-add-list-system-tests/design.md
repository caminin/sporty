## Context

Le projet utilise actuellement un framework de test basé sur Jest pour les utilitaires de session (`session-utils.test.ts`). Le système de listes d'exercices (`exercise-lists.ts`) est une fonctionnalité critique qui permet la gestion de configurations d'entraînement multiples, mais n'est actuellement pas testé. Les tests existants se concentrent uniquement sur la logique de session, laissant les opérations CRUD des listes sans couverture de test.

Le système de listes repose sur le système de fichiers pour la persistance, ce qui nécessite une stratégie de test spécifique pour l'isolation et la reproductibilité.

## Goals / Non-Goals

**Goals:**
- Couvrir toutes les opérations CRUD du système de listes (Create, Read, Update, Delete)
- Tester spécifiquement l'ajout d'exercices dans des listes non-par défaut
- Valider la gestion d'erreur et la validation des données
- Tester l'initialisation automatique et la migration de données
- Maintenir l'isolation entre les tests pour éviter les effets de bord

**Non-Goals:**
- Tester l'interface utilisateur ou les composants React
- Tester les actions server (`exercise-lists-actions.ts`) - uniquement la logique métier
- Intégrer un nouveau framework de test (utiliser Jest existant)
- Tester les performances ou la charge

## Decisions

**Framework de test:** Utiliser Jest existant avec sa configuration actuelle, pour maintenir la cohérence avec les tests existants et éviter l'ajout de dépendances.

**Isolation des tests:** Utiliser des répertoires temporaires uniques pour chaque test nécessitant l'accès au système de fichiers, en configurant `DATA_DIR` vers un chemin temporaire. Chaque test nettoie son répertoire après exécution.

**Mocking:** Ne pas mocker les fonctions internes - tester l'intégration complète du système. Les tests vérifieront le comportement end-to-end des opérations sur le système de fichiers.

**Structure des tests:** Organiser par fonctionnalité plutôt que par fonction, avec des sections pour:
- Initialisation et migration
- Opérations CRUD de base
- Validation des données
- Gestion d'erreur
- Tests d'intégration (ajout d'exercices dans différentes listes)

**Gestion des données de test:** Créer des configurations d'exercice réalistes avec différents groupes musculaires et types d'exercice pour valider le comportement dans des scénarios réalistes.

## Risks / Trade-offs

**Risques de performance des tests:** Les opérations sur le système de fichiers peuvent être lentes → Mitigation: Tests ciblés sur la logique métier, limitation du nombre d'exercices par test.

**Maintenance des tests:** Les changements dans la structure des données peuvent casser les tests → Mitigation: Tests basés sur les interfaces publiques plutôt que les détails d'implémentation.

**Isolation imparfaite:** Possibilité d'effets de bord entre tests si le nettoyage échoue → Mitigation: Utilisation de noms de répertoires uniques et nettoyage explicite avant/après chaque test.

**Couverture incomplète:** Tests unitaires ne couvrent pas les actions server avec authentification → Mitigation: Focus sur les tests unitaires de la logique métier, tests d'intégration séparés si nécessaire.