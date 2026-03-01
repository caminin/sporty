## ADDED Requirements

### Requirement: Affichage de l'en-tête de séance
Le système DOIT afficher un en-tête avec le titre de la séance ("Ma Séance"), un sous-titre de contexte ("Entraînement à la maison") et une icône représentative. Un bouton de paramètres doit également être visible.

#### Scenario: Visualisation de l'en-tête
- **WHEN** l'utilisateur navigue sur la page de la séance de badminton
- **THEN** l'en-tête supérieur reste fixe et affiche le titre, le sous-titre et l'icône de volant de badminton.

### Requirement: Contrôle d'intensité globale
Le système DOIT fournir un composant de type slider pour ajuster visuellement l'intensité de la séance. Bien que fonctionnellement inactif dans un premier temps, le slider DOIT reprendre le style exact de la maquette (valeurs de 0.5x à 2x).

#### Scenario: Interagir avec le slider d'intensité
- **WHEN** l'utilisateur modifie la valeur du slider
- **THEN** l'indicateur textuel de la valeur courante (ex: x1.2) se met à jour correspondamment (si géré par React) ou reste visuellement correct.

### Requirement: Affichage des statistiques de séance
Le système DOIT afficher un panneau récapitulatif présentant la durée totale, le temps de repos par exercice, et la difficulté globale.

#### Scenario: Affichage au chargement
- **WHEN** la page est chargée
- **THEN** les 3 indicateurs (Durée, Repos, Difficulté) sont clairement lisibles dans un bloc distinct.

### Requirement: Liste des blocs d'exercices
Le système DOIT afficher une liste chronologique des blocs d'exercices (Échauffement, Explosivité, Cardio, Renforcement, Retour au calme). Chaque bloc doit avoir une icône de couleur spécifique, un titre, un sous-titre, et une durée associée.

#### Scenario: Visualisation de la liste des blocs
- **WHEN** l'utilisateur scrolle la page
- **THEN** il voit tous les blocs consécutifs avec leurs bonnes couleurs de badge et bordures (selon la maquette).

### Requirement: Bouton d'action flottant "Lancer la séance"
Le système DOIT inclure un bouton d'action principal bien visible en bas de l'écran (fixed), qui incitera à lancer le chronomètre/la séance.

#### Scenario: Clic sur le bouton lancer
- **WHEN** l'utilisateur appuie ou survole le bouton
- **THEN** le bouton affiche une animation visuelle (scale au clic, brillance au survol) comme prévu dans la maquette HTML/CSS.
