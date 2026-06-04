## ADDED Requirements

### Requirement: Distinct muscle group colors on homepage
The homepage SHALL render each muscle-group exercise block with a distinct background and icon treatment derived from a fixed mapping from allowed `MuscleGroupKey` values to `GroupColorKey`, using the same `GROUP_COLOR_STYLES` tokens as custom groups elsewhere in the app. The mapping SHALL NOT include removed keys `fessiers` or `dos`.

#### Scenario: Muscle group block shows color
- **WHEN** the user views the homepage with an active training containing exercises in multiple muscle groups
- **THEN** each muscle-group section header uses a non-default colored background (not plain white text on neutral only)
- **THEN** the group label remains readable in light and dark mode

#### Scenario: Unknown or missing color falls back safely
- **WHEN** a muscle group key has no mapping entry
- **THEN** the section uses the default neutral style without breaking layout
