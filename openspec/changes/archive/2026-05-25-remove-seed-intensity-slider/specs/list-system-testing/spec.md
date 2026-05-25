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
