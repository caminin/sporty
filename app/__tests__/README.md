# Structure des Tests - Sporty

Cette structure de tests a été réorganisée pour faciliter l'ajout de tests pour de nouvelles entités.

## Organisation

```
app/__tests__/
├── shared/                          # Utilitaires partagés
│   ├── test-helpers.ts             # Setup/cleanup filesystem
│   └── *-helpers.ts                # Helpers spécifiques aux entités
├── entities/                        # Tests organisés par entité
│   └── exercise-lists/             # Tests pour les listes d'exercices
│       ├── crud-operations.test.ts # Tests CRUD de base
│       ├── custom-lists.test.ts    # Tests des listes personnalisées
│       ├── integration.test.ts     # Tests d'intégration
│       ├── data-validation.test.ts # Tests de validation des données
│       ├── error-handling.test.ts  # Tests de gestion d'erreurs
│       └── initialization-migration.test.ts # Tests init/migration
└── README.md                        # Cette documentation
```

## Utilitaires Partagés

### `shared/test-helpers.ts`
- `getTestDataDir()`: Génère un répertoire temporaire unique pour chaque test
- `tempFilesystemSetup`: Setup et cleanup automatique pour les tests filesystem

### `shared/*-helpers.ts`
Helpers spécifiques à chaque entité pour créer des objets de test :
- `createTestList()`, `createTestConfig()`, etc. pour les listes d'exercices

## Comment ajouter des tests pour une nouvelle entité

### 1. Créer le dossier de l'entité
```bash
mkdir -p app/__tests__/entities/ma-nouvelle-entite
```

### 2. Créer les helpers partagés
```typescript
// app/__tests__/shared/ma-nouvelle-entite-helpers.ts
import { tempFilesystemSetup } from './test-helpers';

export function createTestEntity(name: string) {
  // Logique pour créer une entité de test
}

export function createTestConfig(overrides?) {
  // Configuration de test par défaut
}
```

### 3. Créer les fichiers de test
Organisez vos tests par fonctionnalité :

```typescript
// app/__tests__/entities/ma-nouvelle-entite/crud-operations.test.ts
import { tempFilesystemSetup } from '../../shared/test-helpers';
import { createTestEntity } from '../../shared/ma-nouvelle-entite-helpers';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Ma Nouvelle Entité - CRUD Operations', () => {
  it('should create a new entity', async () => {
    const entity = await createTestEntity('Test Entity');
    expect(entity.id).toBeDefined();
  });
});
```

### 4. Structure recommandée des tests
- `crud-operations.test.ts`: Opérations de base (Create, Read, Update, Delete)
- `integration.test.ts`: Tests d'intégration entre composants
- `data-validation.test.ts`: Validation des données et types
- `error-handling.test.ts`: Gestion d'erreurs et cas limites
- `*-specific.test.ts`: Tests spécifiques à une fonctionnalité

## Avantages de cette structure

1. **Réutilisabilité**: Les utilitaires partagés évitent la duplication de code
2. **Isolation**: Chaque entité a ses propres helpers et tests
3. **Évolutivité**: Facile d'ajouter de nouvelles entités
4. **Maintenance**: Code organisé et facile à maintenir
5. **Cohérence**: Structure uniforme pour tous les tests

## Exécution des tests

```bash
# Tous les tests
npm test

# Tests d'une entité spécifique
npm test -- app/__tests__/entities/exercise-lists/

# Tests d'un fichier spécifique
npm test -- crud-operations.test.ts
```

## Bonnes pratiques

- Utilisez toujours `tempFilesystemSetup` pour les tests nécessitant le filesystem
- Créez des helpers pour les objets de test complexes
- Organisez les tests par fonctionnalité, pas par classe/méthode
- Utilisez des noms descriptifs pour vos tests
- Testez les cas d'erreur et les cas limites