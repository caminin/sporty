## MODIFIED Requirements

### Requirement: Muscle group catalog in admin
The system SHALL display and edit catalog exercises grouped by predefined `muscleGroup` keys on the **Exercices** tab only. Muscle groups are anatomical classifications distinct from trainings.

#### Scenario: Catalog tab groups by muscle group
- **WHEN** the admin views the Exercices tab
- **THEN** exercises are rendered in sections per `muscleGroup` with icons or labels per predefined key
- **THEN** no training selector appears on this tab

#### Scenario: Entraînements tab groups training refs by muscle group
- **WHEN** the admin views the Entraînements tab for an active training
- **THEN** referenced exercises are grouped under the same `muscleGroup` sections derived from the global catalog
- **THEN** adding an exercise is scoped to the section's muscle group filter
