## MODIFIED Requirements

### Requirement: Test de l'Initialisation Automatique
Le système de test SHALL vérifier l'initialisation du système de listes sans automatisme de liste par défaut.

#### Scenario: Initialisation sur stockage vide
- **WHEN** le système est initialisé sans aucune liste existante
- **THEN** aucune liste par défaut n'est créée
- **AND** le système doit rester en état prêt (répertoire présent + API de listes opérationnelle)

#### Scenario: Initialisation avec listes existantes
- **WHEN** des listes existent déjà sur le disque
- **THEN** le système SHALL les conserver telles quelles
- **THEN** le système SHALL ne pas en créer de nouvelles

#### Scenario: Initialisation sans lecture automatique du seed
- **WHEN** l'initialisation s'exécute
- **THEN** le contenu de `default-seed.json` ne doit pas être chargé automatiquement
- **THEN** aucune conversion implicite vers une liste par défaut n'est attendue

#### Scenario: Gestion d'erreur de seed lors d'un import explicite
- **WHEN** un administrateur déclenche un import par seed explicite
- **AND** `default-seed.json` est absent
- **THEN** le fallback `globalRestTime: 15` et `groups: {}` est utilisé pour la liste cible

