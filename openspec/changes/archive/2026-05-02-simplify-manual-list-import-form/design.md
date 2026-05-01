## Context

La page `group-settings` propose plusieurs voies d'import JSON pour les listes. Le bouton dedie au "fichier manuel" cree un parcours secondaire qui ne correspond pas au flux principal et ajoute une ambiguite dans l'UI. Le besoin est de conserver uniquement les controles utiles a l'import standard: nom de liste, zone JSON, selection de fichier, puis import explicite.

## Goals / Non-Goals

**Goals:**
- Simplifier le formulaire d'import dans l'onglet "Gestion des listes".
- Maintenir les deux entrees legitimes (coller JSON et charger un fichier local) avec une action d'import explicite.
- Supprimer le controle "fichier manuel" redondant sans modifier la logique de validation/import existante.

**Non-Goals:**
- Changer le format JSON des listes.
- Introduire un nouveau mecanisme de stockage ou d'automatisation.
- Revoir les permissions admin existantes.

## Decisions

1. Supprimer le bouton "selectionner un fichier manuel" du composant d'import de listes.
   - Rationale: un seul flux d'import fichier doit rester visible pour eviter les doublons d'action.
   - Alternative rejetee: conserver le bouton mais le renommer. Cela garde la confusion de deux controles de meme nature.

2. Conserver la structure du formulaire autour de trois blocs:
   - champ `nom de liste`,
   - champ `JSON`,
   - bouton de selection de fichier + bouton d'import.
   - Rationale: ces elements couvrent le parcours minimal demande sans casser les habitudes utilisateur.

3. Ne pas toucher a la logique serveur/import.
   - Rationale: le besoin est strictement UX. La validation et la creation de liste restent inchangees.

## Risks / Trade-offs

- [Risque] Tests UI existants attendant l'ancien bouton -> [Mitigation] Mettre a jour les assertions vers la nouvelle structure du formulaire.
- [Trade-off] Perte d'un raccourci potentiellement utilise par certains admins -> [Mitigation] Conserver un parcours fichier clair avec bouton de selection + import.
