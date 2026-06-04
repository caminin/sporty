## 1. Canonical source and generation workflow

- [x] 1.1 Update bundle tooling so `exercice_list/` is the only editable source and `public/bundled-exercice-list/` is always regenerated output.
- [x] 1.2 Wire generation into relevant npm scripts (`dev`, `build`, and any validation/test entrypoints that consume bundled defaults).
- [x] 1.3 Ensure generation handles removed/renamed JSON files so bundled output cannot keep stale files.

## 2. Synchronization safeguards

- [x] 2.1 Add a verification command that checks byte-level parity between `exercice_list/` and `public/bundled-exercice-list/`.
- [x] 2.2 Integrate the sync verification into CI/local quality gates with clear failure messaging.
- [x] 2.3 Add or update automated tests covering generation + out-of-sync failure behavior.

## 3. Reset contract and rollout

- [x] 3.1 Confirm reset/bootstrap paths continue consuming bundled files generated from canonical source data.
- [x] 3.2 Regenerate bundled defaults once and validate reset behavior with names **Jambes** and **Haut du corps**.
- [x] 3.3 Document developer workflow changes (where to edit defaults and how to regenerate/verify bundle).
