## 1. Setup and Preparation

- [x] 1.1 Remove existing irrelevant code from `app/group-settings/page.tsx` (notification, privacy settings)
- [x] 1.2 Initialize React `useState` with the 5 predefined groups: 'Cardio endurance', 'Épaules et frappe', 'adbos', 'Explosivité jambes', 'Agilité et déplacements', each containing an empty `exercises` array

## 2. UI Implementation

- [x] 2.1 Create the layout to map and display each of the 5 exercise groups
- [x] 2.2 Add an input field and "Add" button within each group to allow adding exercise names
- [x] 2.3 Display the current list of exercises within each group, and include a "Remove" or "Delete" button for each exercise
- [x] 2.4 Add a prominent "Export JSON" button on the page

## 3. Finalization and Export

- [x] 3.1 Implement the JSON serialization logic that formats the groups and exercises appropriately for `exercices.json`
- [x] 3.2 Attach `navigator.clipboard.writeText` to the Export button to copy the configured JSON
- [x] 3.3 Provide UI feedback (like a popup or text update) to confirm that the JSON has been copied successfully
