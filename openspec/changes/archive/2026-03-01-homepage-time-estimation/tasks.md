## 1. Page d'accueil — Nettoyage et valeur par défaut

- [x] 1.1 Dans `app/page.tsx`, passer la valeur initiale du state `intensity` de `1.2` à `1.0` dans le composant `IntensityControl`
- [x] 1.2 Dans `app/page.tsx`, supprimer le bloc "Difficulté" du composant `SessionSummary` (le troisième `<div>` avec `text-primary` contenant "Haute")
- [x] 1.3 Supprimer le séparateur `<div className="h-8 w-px …" />` devenu inutile entre "Repos / Exo" et "Difficulté"

## 2. Calcul de la durée estimée

- [x] 2.1 Créer une fonction pure `estimateSessionDuration(config: WorkoutConfig, selectedIds: Set<string>): number` dans `app/session-utils.ts` — retourne le nombre total de secondes estimées selon la formule : 5s/start + (reps × 3s ou durée) + repos entre exercices
- [x] 2.2 Créer une fonction utilitaire `formatDuration(seconds: number): string` dans `app/session-utils.ts` — retourne `"Xm Ys"` si ≥ 60s ou `"Xs"` sinon

## 3. Affichage dans le résumé de séance

- [x] 3.1 Dans `app/page.tsx`, passer `estimatedSeconds` en prop à `SessionSummary` (calculé dans le composant parent via `estimateSessionDuration`)
- [x] 3.2 Dans `SessionSummary`, remplacer la colonne "Difficulté" par une colonne "Durée est." qui affiche la valeur formatée avec `formatDuration`
- [x] 3.3 Mettre à jour la signature du composant `SessionSummary` pour accepter `estimatedSeconds: number` en prop et supprimer les props devenues inutiles

## 4. Garantie de non-démarrage par un repos

- [x] 4.1 Vérifier dans `buildSessionSteps` que le premier step retourné est toujours `kind === "work"` (valider par lecture du code)
- [x] 4.2 Ajouter un commentaire explicite dans `buildSessionSteps` documentant la règle "la séance ne commence jamais par un repos"
