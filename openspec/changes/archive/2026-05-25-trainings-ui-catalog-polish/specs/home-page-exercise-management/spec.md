## ADDED Requirements

### Requirement: Readable exercise names in session list
On the homepage exercise list within each muscle-group block, exercise names SHALL be displayed without unnecessary truncation so that typical French titles remain readable on common mobile widths.

#### Scenario: Long exercise title visible
- **WHEN** an exercise name exceeds the width of one line
- **THEN** the name wraps or uses available horizontal space
- **THEN** the user can read the full title without opening another screen

## MODIFIED Requirements

### Requirement: Homepage training selection
The homepage SHALL let users choose among **entraînements** (trainings). Labels in French SHALL use **Entraînement** / **entraînements**. Exercise counts and time estimates SHALL resolve the active training refs against the global catalog. Muscle-group sections SHALL use distinct colors per `MuscleGroupKey` as specified in `muscle-group-home-colors`.

#### Scenario: Display training name on homepage
- **WHEN** the user views the homepage with a selected training
- **THEN** the UI shows the training name (e.g. **Jambes**, **Haut du corps** for bundled defaults)
- **THEN** exercise metadata is resolved from the global catalog

#### Scenario: Switch training on homepage
- **WHEN** the user selects another training from the selector
- **THEN** the active training id is persisted in client context
- **THEN** session configuration reloads from the new training refs

#### Scenario: Muscle groups shown with color
- **WHEN** the user views the exercise sequence for the active training
- **THEN** each muscle-group block header uses the configured group color styling
- **THEN** group labels are not rendered as plain white-only headers without colored background
