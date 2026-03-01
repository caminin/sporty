## ADDED Requirements

### Requirement: Algorithme de séquençage optimisé
Le système DOIT implémenter un algorithme de séquençage qui maximise l'alternance entre groupes musculaires différents lors de la construction de la séquence de session.

#### Scenario: Alternance maximale avec deux groupes
- **WHEN** la configuration contient des exercices de deux groupes différents (A et B)
- **THEN** la séquence alterne autant que possible entre les groupes (A-B-A-B-... ou B-A-B-A-...)
- **THEN** aucun groupe n'est sollicité consécutivement plus que nécessaire

#### Scenario: Alternance avec trois groupes ou plus
- **WHEN** la configuration contient des exercices de trois groupes ou plus
- **THEN** l'algorithme sélectionne à chaque étape l'exercice du groupe le plus éloigné dans la séquence actuelle
- **THEN** la distance est calculée comme le nombre d'exercices depuis le dernier exercice du même groupe

#### Scenario: Préservation de l'ordre relatif dans un groupe
- **WHEN** plusieurs exercices appartiennent au même groupe
- **THEN** l'ordre relatif des exercices dans leur groupe est préservé
- **THEN** les exercices d'un même groupe sont distribués de manière équilibrée dans la séquence

#### Scenario: Compatibilité avec la structure existante
- **WHEN** l'algorithme optimisé est appliqué
- **THEN** la séquence résultante contient le même nombre total d'exercices
- **THEN** chaque exercice apparaît exactement une fois dans la séquence
- **THEN** la séquence commence toujours par un step de type "work"