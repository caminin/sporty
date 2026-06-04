## Context

La page admin sépare la gestion du catalogue global (**Exercices**) et des entraînements (**Entraînements**). Aujourd'hui, les sections de groupes musculaires dans la vue entraînement sont dérivées des exercices déjà présents, ce qui masque les groupes vides et empêche d'y ajouter un premier exercice. En parallèle, la suppression d'un exercice catalogue échoue ou ne cible pas correctement l'élément attendu dans certains cas UI/action.

## Goals / Non-Goals

**Goals:**
- Rendre les groupes musculaires visibles de manière déterministe dans l'onglet Entraînements, même sans exercice existant.
- Permettre l'ajout d'un premier exercice dans un groupe vide sans contournement.
- Garantir que l'action de suppression dans l'onglet Exercices déclenche la bonne opération de suppression, avec les validations de références déjà prévues.
- Préserver la compatibilité des données existantes et des règles de validation.

**Non-Goals:**
- Changer la liste des `MuscleGroupKey` autorisés.
- Repenser l'UX complète des onglets admin.
- Modifier la règle métier qui interdit de supprimer un exercice encore référencé.

## Decisions

### 1) Rendu des sections basé sur le catalogue de groupes autorisés
La construction des sections dans l'onglet Entraînements utilisera la liste canonique des groupes (`MuscleGroupKey`) au lieu d'un filtrage "groupes présents dans les refs".  
**Rationale:** la disponibilité d'une zone d'ajout ne doit pas dépendre de l'état actuel de la liste.  
**Alternative considérée:** garder le rendu dynamique basé sur les refs et ajouter un bouton global "Ajouter un exercice". Rejetée car moins explicite et moins ciblée par groupe.

### 2) Garder le contenu vide visible, mais différencier visuellement l'état
Chaque groupe s'affiche avec son en-tête, son sélecteur d'ajout et, s'il est vide, un état "aucun exercice".  
**Rationale:** cela conserve un repère constant et évite l'ambiguïté sur les groupes disponibles.

### 3) Stabiliser le flux de suppression catalogue (UI -> action -> persistence)
Le bouton supprimer doit toujours passer l'identifiant canonique de l'exercice sélectionné à l'action de suppression, puis rafraîchir l'état UI en cohérence avec le résultat.  
**Rationale:** la panne observée vient généralement d'un id erroné, d'un handler non branché, ou d'un état local non synchronisé après action.  
**Alternative considérée:** suppression optimiste sans validation immédiate. Rejetée car risque d'incohérence si la suppression est bloquée par des références actives.

## Risks / Trade-offs

- [Risque] Afficher toutes les sections peut alourdir visuellement l'onglet Entraînements.  
  → Mitigation: conserver un état vide compact et limiter le bruit visuel dans les cartes vides.
- [Risque] Correction de suppression incomplète si plusieurs composants déclenchent des chemins différents.  
  → Mitigation: harmoniser un seul chemin d'action de suppression et couvrir via tests d'intégration.
- [Risque] Régression sur les règles de blocage de suppression référencée.  
  → Mitigation: garder les contrôles côté domaine inchangés et ajouter des tests négatifs explicites.
