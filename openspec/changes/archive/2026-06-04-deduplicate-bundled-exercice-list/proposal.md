## Why

The same exercises are currently maintained in both `exercice_list/` and `public/bundled-exercice-list/`, which creates drift risk and unnecessary manual updates. We need a single source-of-truth workflow so bundled defaults stay consistent without duplicating maintenance work.

## What Changes

- Define `exercice_list/` as the only editable source for bundled default exercises and trainings.
- Generate `public/bundled-exercice-list/` automatically from that source in all relevant workflows (development, build, and tests that rely on bundled defaults).
- Add guardrails to detect stale or manually edited bundled files and fail fast when source and bundle are out of sync.
- Clarify the reset workflow contract so admin reset always uses artifacts generated from the canonical source.

## Capabilities

### New Capabilities
- _(none)_

### Modified Capabilities
- `bundled-trainings-reset`: tighten requirements so bundled defaults are generated from a single canonical source with reproducible synchronization checks.

## Impact

- Affected code: bundle copy tooling in `scripts/`, npm script orchestration in `package.json`, and reset/bootstrap paths consuming bundled defaults.
- Developer workflow: editing defaults happens once in `exercice_list/`; bundle files become generated artifacts.
- Quality: reduced risk of regressions where reset data differs from committed source defaults.
