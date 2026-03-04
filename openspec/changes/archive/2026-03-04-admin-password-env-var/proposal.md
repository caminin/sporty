## Why

Le mot de passe admin est actuellement hardcodé dans le code source (`password === 'sporty'`), visible dans le dépôt et les tests. Pour une app déployée en production, cela expose le secret à quiconque ayant accès au code. Déplacer le mot de passe vers une variable d'environnement permet de le garder hors du code source et de le configurer par environnement.

## What Changes

- Remplacer la comparaison hardcodée par une lecture depuis `process.env.ADMIN_PASSWORD`
- Fallback sur la valeur actuelle (`'sporty'`) si la variable n'est pas définie (rétrocompatibilité dev/local)
- Documenter la variable dans un fichier d'exemple (`.env.example`) sans valeur sensible
- Mettre à jour les tests pour utiliser la variable d'environnement ou un mock

## Capabilities

### New Capabilities

- `admin-password-config`: Configuration du mot de passe admin via variable d'environnement. La vérification admin compare le mot de passe fourni à `ADMIN_PASSWORD` (ou fallback pour dev).

### Modified Capabilities

- Aucun — le comportement fonctionnel (authentification par mot de passe) reste identique ; seule la source du secret change.

## Impact

- `app/exercises/lists-actions.ts` : `verifyAdminAuth` lit `process.env.ADMIN_PASSWORD`
- `app/__tests__/` : tests d'intégration utilisant le mot de passe (ex. `integration.test.ts`) — utiliser `process.env.ADMIN_PASSWORD` ou `ADMIN_PASSWORD=sporty` en dev
- Nouveau : `.env.example` avec `ADMIN_PASSWORD=` (vide, à documenter)
- Déploiement : configurer `ADMIN_PASSWORD` dans l'environnement de production
