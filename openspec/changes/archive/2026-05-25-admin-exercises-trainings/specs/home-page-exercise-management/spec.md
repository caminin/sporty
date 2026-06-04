## MODIFIED Requirements

### Requirement: Homepage training selection
The homepage SHALL let users choose among **entraînements** (trainings), not « listes d'exercices ». Labels in French SHALL use **Entraînement** / **entraînements**. Exercise counts and time estimates SHALL resolve the active training refs against the global catalog.

#### Scenario: Display training name on homepage
- **WHEN** the user views the homepage with a selected training
- **THEN** the UI shows the training name (not « liste »)
- **THEN** exercise metadata is resolved from the global catalog

#### Scenario: Switch training on homepage
- **WHEN** the user selects another training from the selector
- **THEN** the active training id is persisted in client context
- **THEN** session configuration reloads from the new training refs
