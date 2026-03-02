## Context

L'app Sporty gère des listes d'exercices (ExerciseList) stockées en JSON sur le système de fichiers. Chaque liste contient une config (WorkoutConfig) avec groupes et exercices. L'export JSON existe déjà (exportWorkoutConfigToJson) et copie la config dans le presse-papier. La création de listes se fait actuellement via un formulaire (nom + description) qui crée une liste vide. Aucun import n'existe.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur d'importer un JSON (collé ou fichier) pour créer une nouvelle liste
- Accepter le format WorkoutConfig (identique à l'export) et l'ancien format (via migrateWorkoutConfig)
- Valider la structure avant création et fournir un feedback d'erreur explicite
- Créer la liste, la sauvegarder et la sélectionner automatiquement

**Non-Goals:**
- Import depuis URL externe
- Fusion avec une liste existante
- Import de format CSV ou autre que JSON

## Decisions

**1. Source du JSON : coller OU fichier**
- Coller : zone de texte (textarea) pour coller le JSON
- Fichier : input type="file" accept=".json,application/json"
- Les deux sont utiles : coller pour un export précédent, fichier pour un backup
- Décision : proposer les deux (onglets ou boutons distincts) pour couvrir les usages

**2. Emplacement de l'action d'import**
- Dans l'onglet "Listes" de group-settings, à côté du bouton "Nouvelle liste"
- Cohérent avec le flux : on crée des listes dans cette section

**3. Validation et migration**
- Réutiliser `migrateWorkoutConfig` pour convertir l'ancien format (groups: Record<string, Exercise[]>) vers la structure unifiée (Group avec id, icon, createdAt)
- Après migration : valider que la config a des groupes valides (validateGroup ou logique similaire)
- Si invalide : retourner une erreur avec message lisible (ex. "JSON invalide : structure des groupes incorrecte")

**4. Nom de la liste importée**
- Si le JSON contient un champ `name` (format ExerciseList complet) : l'utiliser
- Sinon : demander à l'utilisateur un nom (ou générer "Importé le DD/MM/YYYY HH:mm")
- Décision : demander un nom dans un champ du formulaire d'import pour garder la cohérence avec la création manuelle

**5. Action serveur**
- Nouvelle action `importListFromJson` dans lists-actions.ts (ou module dédié)
- Signature : `importListFromJson(json: string, listName: string, password: string)` → même auth que createList
- Retourne `{ success: boolean, listId?: string, error?: string }`

## Risks / Trade-offs

- **JSON malformé** → Try/catch sur JSON.parse, message "JSON invalide"
- **Structure partiellement valide** → migrateWorkoutConfig peut produire des groupes vides ; accepter une config avec groupes vides (liste vide) ou rejeter selon le cas
- **Taille du fichier** → Pas de limite stricte pour l'instant ; si problème, ajouter une limite (ex. 1 Mo) plus tard
