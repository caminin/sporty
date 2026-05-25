## REMOVED Requirements

### Requirement: Fichier seed au format Group

**Reason** : Le contenu initial des listes est géré via `exercice_list/` et import manuel ; un seed embarqué dans l’app n’est plus maintenu.

**Migration** : Créer ou réimporter une liste depuis un JSON versionné dans `exercice_list/` plutôt que d’appeler `seedExerciseList`.

### Requirement: Chargement du seed par action explicite

**Reason** : Même flux que ci-dessus ; l’action admin « Réinitialiser depuis le seed » est supprimée.

**Migration** : Supprimer l’usage de `seedListWithDefaultTemplate` ; utiliser l’import de liste existant.

### Requirement: Suppression de l'initialisation implicite par `ensureDefaultList`

**Reason** : Déjà satisfait par un change antérieur ; la spec `default-list-seed` n’a plus de raison d’exister en entier.

**Migration** : Aucune — comportement « pas de liste auto-créée » inchangé.
