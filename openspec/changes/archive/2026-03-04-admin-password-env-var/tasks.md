## 1. Configuration du mot de passe admin

- [x] 1.1 Modifier `verifyAdminAuth` dans `lists-actions.ts` pour lire `process.env.ADMIN_PASSWORD` avec fallback sur `'sporty'` si non défini
- [x] 1.2 Créer `.env.example` avec `ADMIN_PASSWORD=` et un commentaire indiquant que la variable doit être définie en production

## 2. Tests

- [x] 2.1 Mettre à jour `integration.test.ts` : définir `process.env.ADMIN_PASSWORD = 'sporty'` dans un `beforeAll` du describe concerné (ou utiliser `process.env.ADMIN_PASSWORD || 'sporty'` dans les appels à `createList`/`removeList`)
