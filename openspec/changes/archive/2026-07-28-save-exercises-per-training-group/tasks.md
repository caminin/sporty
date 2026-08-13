## 1. Persistance par entraînement

- [x] 1.1 Refactorer `loadSelection` / `saveSelection` pour accepter `listId` et lire/écrire un objet `{ [listId]: string[] }` sous `sporty_session_selection`
- [x] 1.2 Ignorer l'ancien format tableau sans migration (fallback : tout coché)
- [x] 1.3 Passer `selectedListId` à `loadSelection` et `saveSelection` dans `app/page.tsx`

## 2. Tests

- [x] 2.1 Extraire les helpers dans `app/session-selection-storage.ts`
- [x] 2.2 Tests unitaires : sélection indépendante par `listId`, défaut tout coché, legacy ignoré, filtrage des `refId` invalides

## 3. Vérification

- [x] 3.1 Vérifier manuellement : décocher sur A, passer à B, revenir à A → sélection A restaurée
- [x] 3.2 Lancer la suite de tests concernée
