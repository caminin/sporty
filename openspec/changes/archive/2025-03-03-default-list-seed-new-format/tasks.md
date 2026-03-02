## 1. Créer le fichier seed

- [x] 1.1 Créer app/exercises/default-seed.json avec WorkoutConfig au format Group (globalRestTime: 15, groups avec id, name, icon, createdAt, exercises)
- [x] 1.2 Convertir les 5 groupes de exercises.json (Cardio endurance, Épaules et frappe, Abdos, Explosivité jambes, Agilité et déplacements) en structure Group

## 2. Modifier ensureDefaultList

- [x] 2.1 Modifier ensureDefaultList pour charger default-seed.json au lieu de exercises.json
- [x] 2.2 Ajouter fallback sur config vide (globalRestTime: 15, groups: {}) si default-seed.json absent ou invalide
- [x] 2.3 Logger un avertissement lorsque le fallback est utilisé

## 3. Tests

- [x] 3.1 Mettre à jour les tests d'initialisation pour vérifier le chargement du seed
- [x] 3.2 Ajouter ou adapter un test pour le fallback sans seed
