## ADDED Requirements

### Requirement: Home Page Exercise List Display
The system SHALL display all exercises from `exercises.json` on the home page, organized by their respective groups.

#### Scenario: View grouped exercises
- **WHEN** the user navigates to the home page
- **THEN** they see exercises organized by their group
- **THEN** each exercise displays its name, type (reps or time), and value

### Requirement: Edit Exercise List on Home Page
The system SHALL allow users to modify the list of exercises from the home page, including adding new exercises (with their type and duration/reps) and removing existing ones.

#### Scenario: Add new time-based exercise
- **WHEN** the user adds an exercise from the home page
- **THEN** they input the name, select "time" as the type, and enter the duration
- **WHEN** they submit the form
- **THEN** the exercise is saved to `exercises.json` and immediately visible in the list

#### Scenario: Delete an existing exercise
- **WHEN** the user clicks the delete button next to an exercise on the home page
- **THEN** the exercise is removed from the UI and `exercises.json`
