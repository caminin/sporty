## Context

Bundled defaults are consumed from `public/bundled-exercice-list/`, while editable exercise/training defaults live in `exercice_list/`. Even with an existing copy script at build time, keeping two committed representations increases the chance of accidental divergence and confusing reset behavior.

## Goals / Non-Goals

**Goals:**
- Establish `exercice_list/` as the canonical source for bundled defaults.
- Ensure bundled JSON files are regenerated automatically before any runtime that depends on them.
- Detect out-of-sync bundle artifacts early in local and CI workflows.

**Non-Goals:**
- Redesign exercise/training JSON schemas.
- Change admin reset UX or permission model.
- Introduce remote storage or external data pipelines.

## Decisions

1. Canonical source decision: only `exercice_list/` is edited by humans.
   - Rationale: removes double-maintenance and simplifies review.
   - Alternative considered: keeping both folders editable with sync conventions; rejected because it relies on discipline instead of enforcement.

2. Automated generation decision: keep `public/bundled-exercice-list/` as generated output and regenerate it through scripts wired to relevant npm commands.
   - Rationale: reset/bootstrap logic continues to consume stable public assets while source stays singular.
   - Alternative considered: reading defaults directly from `exercice_list/` at runtime; rejected for now to avoid broader runtime path and deployment coupling changes.

3. Consistency gate decision: add a verification step that fails when generated bundle content differs from canonical source.
   - Rationale: catches drift immediately and keeps repository state deterministic.
   - Alternative considered: relying on documentation only; rejected as non-enforceable.

## Risks / Trade-offs

- [Risk] More script hooks can slightly increase local command startup time.  
  → Mitigation: keep copy/verify scripts lightweight and file-scoped.
- [Risk] Developers may forget to run generation manually before commit.  
  → Mitigation: wire generation/verification into standard npm scripts used in CI.
- [Risk] Existing automation may assume direct editing in `public/bundled-exercice-list/`.  
  → Mitigation: document deprecation and fail with clear messaging when drift is detected.

## Migration Plan

1. Document `exercice_list/` as canonical source and bundle folder as generated output.
2. Update npm scripts so generation runs in every relevant workflow.
3. Add verification command and hook it in CI/test pipeline.
4. Regenerate bundled files once and commit aligned artifacts.
5. Communicate the new workflow in developer docs/changelog.

## Open Questions

- Should generated bundle files remain committed for transparency, or be fully ephemeral in CI/runtime only?
- Which CI stage should enforce synchronization (`lint`, dedicated check, or `test`)?
