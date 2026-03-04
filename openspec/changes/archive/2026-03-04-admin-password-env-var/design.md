## Context

`verifyAdminAuth` dans `lists-actions.ts` compare actuellement le mot de passe fourni à la chaîne littérale `'sporty'`. Ce secret est présent dans le code source, les tests, et potentiellement l'historique git. Pour un déploiement en production, le mot de passe doit être configurable sans être versionné.

## Goals / Non-Goals

**Goals:**
- Lire le mot de passe admin depuis une variable d'environnement
- Conserver un fallback pour le développement local (rétrocompatibilité)
- Ne pas exposer de secret dans le code ou les tests

**Non-Goals:**
- Hash du mot de passe (bcrypt/argon2) — comparaison en clair suffit pour un secret partagé configuré par l'admin
- Rate limiting ou protection brute-force
- Changer le flux d'authentification (sessionStorage, etc.)

## Decisions

### 1. Variable d'environnement

**Décision** : Utiliser `ADMIN_PASSWORD`. Nom explicite, cohérent avec les conventions (MAJUSCULES, préfixe métier).

**Alternative** : `SPORTY_ADMIN_PASSWORD` pour éviter les collisions. Rejeté : projet mono-app, pas de risque de collision.

### 2. Fallback en développement

**Décision** : Si `ADMIN_PASSWORD` n'est pas défini, fallback sur `'sporty'` pour ne pas casser le dev local et les tests existants.

**Alternative** : Pas de fallback, exiger la variable. Rejeté : friction inutile en dev ; les tests et le README/documentation peuvent continuer à fonctionner sans config.

### 3. Fichier .env.example

**Décision** : Créer `.env.example` avec `ADMIN_PASSWORD=` (vide) et un commentaire explicatif. Le fichier `.env` reste ignoré (déjà dans .gitignore typiquement).

**Alternative** : Documenter uniquement dans le README. Rejeté : `.env.example` est le standard pour les variables requises.

### 4. Tests

**Décision** : Dans les tests d'intégration, définir `process.env.ADMIN_PASSWORD = 'sporty'` dans un `beforeAll` ou utiliser la variable si déjà définie. Éviter de hardcoder `'sporty'` dans les assertions — utiliser `process.env.ADMIN_PASSWORD || 'sporty'` pour la valeur de test.

**Alternative** : Mock de `verifyAdminAuth`. Rejeté : on veut tester le flux réel ; le mock masquerait une régression si la variable n'est pas lue correctement.

## Risks / Trade-offs

- **[Sécurité]** Si `ADMIN_PASSWORD` n'est pas défini en prod, le fallback `'sporty'` s'applique → risque si l'app est déployée sans config. **Mitigation** : Documenter clairement dans le README et `.env.example` que la variable doit être définie en production ; éventuellement log un warning si fallback utilisé et `NODE_ENV === 'production'`.

- **[Tests]** Les tests qui passent le mot de passe doivent connaître la valeur. **Mitigation** : Utiliser `process.env.ADMIN_PASSWORD || 'sporty'` dans les tests, ou définir la variable dans le setup de test.

## Migration Plan

1. Ajouter la lecture de `process.env.ADMIN_PASSWORD` dans `verifyAdminAuth` avec fallback
2. Créer `.env.example`
3. Mettre à jour les tests
4. En production : définir `ADMIN_PASSWORD` dans l'environnement avant déploiement
5. Pas de rollback nécessaire — si la variable est retirée, le fallback rétablit l'ancien comportement
