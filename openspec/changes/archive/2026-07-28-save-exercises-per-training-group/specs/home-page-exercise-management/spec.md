## MODIFIED Requirements

### Requirement: Homepage training selection
The homepage SHALL let users choose among **entraînements** (trainings). Labels in French SHALL use **Entraînement** / **entraînements**. Exercise counts and time estimates SHALL resolve the active training refs against the global catalog. Muscle-group sections SHALL use distinct colors per `MuscleGroupKey` as specified in `muscle-group-home-colors`. When the active training changes, the homepage SHALL restore the exercise selection persisted for that training (not a global shared list).

#### Scenario: Display training name on homepage
- **WHEN** the user views the homepage with a selected training
- **THEN** the UI shows the training name (e.g. **Jambes**, **Haut du corps** for bundled defaults)
- **THEN** exercise metadata is resolved from the global catalog

#### Scenario: Switch training on homepage
- **WHEN** the user selects another training from the selector
- **THEN** the active training id is persisted in client context
- **THEN** session configuration reloads from the new training refs
- **THEN** the checked exercises reflect the selection saved for the newly active training (or all checked if none saved)

#### Scenario: Muscle groups shown with color
- **WHEN** the user views the exercise sequence for the active training
- **THEN** each muscle-group block header uses the configured group color styling
- **THEN** group labels are not rendered as plain white-only headers without colored background
