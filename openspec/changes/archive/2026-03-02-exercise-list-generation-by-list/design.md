## Context

L'application Sporty dispose déjà d'un système de listes d'exercices implémenté (`exercise-lists.ts`, `exercise-lists-actions.ts`) qui permet de stocker différentes configurations d'exercices dans des fichiers JSON séparés. Cependant, le système de génération d'exercices repose encore partiellement sur un fichier global `exercises.json` comme fallback et source de migration initiale.

Le code actuel dans `exercises-actions.ts` maintient une compatibilité avec `exercises.json` pour éviter les ruptures, mais cela limite la flexibilité et crée une dépendance indésirable au fichier global.

## Goals / Non-Goals

**Goals:**
- Supprimer complètement la dépendance au fichier `exercises.json` dans la génération d'exercices
- Permettre le chargement dynamique de différentes listes d'exercices dans l'interface utilisateur
- Maintenir la compatibilité avec les listes existantes et la migration automatique
- Ajouter une interface de sélection de liste pour l'utilisateur

**Non-Goals:**
- Refactorer complètement le système de stockage des listes (le système actuel fonctionne bien)
- Changer le format de stockage des listes (JSON par fichier reste approprié)
- Modifier l'authentification admin ou les permissions existantes

## Decisions

### Architecture de chargement des exercices
**Décision**: Modifier `getWorkoutConfig()` pour ne plus utiliser `exercises.json` comme fallback. Au lieu de cela, s'assurer que la liste par défaut existe toujours et lever une erreur si aucune liste n'est disponible.

**Rationale**: Cela force une initialisation propre du système et évite la dépendance au fichier global. La migration automatique vers la liste 'default' assure la continuité.

**Alternatives considérées**:
- Garder le fallback vers exercises.json : Maintenait la compatibilité mais perpétuait la dépendance
- Charger automatiquement la première liste disponible : Risquait d'être imprévisible pour l'utilisateur

### Interface de sélection de liste
**Décision**: Ajouter un composant de sélection de liste dans l'interface principale qui permet de changer la liste active pour la session d'entraînement.

**Rationale**: Donne à l'utilisateur le contrôle sur quelle liste utiliser, permettant de tester différents programmes d'entraînement.

**Alternatives considérées**:
- Sélection automatique basée sur des critères : Trop complexe et moins flexible
- Interface admin seulement : Limiterait l'usage aux administrateurs uniquement

### Gestion des états de liste
**Décision**: Utiliser un état global (context ou store) pour maintenir la liste actuellement sélectionnée dans l'application.

**Rationale**: Permet de partager l'état de la liste sélectionnée entre les composants sans prop drilling excessif.

**Alternatives considérées**:
- URL params : Bon pour le partage mais pas idéal pour la persistance de session
- Local storage : Simple mais peut créer des conflits entre onglets

## Risks / Trade-offs

**Risk: Perte de données lors de la migration** → Mitigation: Conserver exercises.json comme backup et ajouter des logs détaillés pendant la migration

**Risk: Interface complexe pour l'utilisateur** → Mitigation: Interface simple avec liste par défaut présélectionnée, option avancée pour changer

**Risk: Performance avec de nombreuses listes** → Mitigation: Lazy loading et cache des listes récemment utilisées

**Risk: Rupture de compatibilité** → Mitigation: Migration automatique et tests exhaustifs des chemins existants