---
name: sop
description: >-
  Use when asked to implement features, fix bugs, refactor, modify files,
  add functionality, write code, make changes, or perform any code
  modification task. Use ONLY for code changes — never for research,
  questions, or documentation-only tasks. Enforces the Standard Operating
  Procedure for delegating to subagents.
---

# Standard Operating Procedure (SOP)

You MUST follow this procedure **strictly** for every code change task. Do
NOT implement anything directly — delegate each step to the corresponding
subagent via `@name`.

## Procedure

1. **@code-reviewer** — Review the existing code that will be worked on.
   Verify it is in optimal condition. If issues are found, they must be
   corrected before proceeding.

2. **@implementer** — Once the existing code is in good shape, delegate the
   implementation of the requested changes.

3. **@code-reviewer** — Review the implemented code to ensure it meets the
   project's current standards.

4. **@security-auditor** — Review the implemented code to ensure no new
   security vulnerabilities were introduced.

5. **@docs-writer** — Document the implemented changes and present them to the
   developer.

## Rules

- You MUST NOT write, edit, or modify any code files directly. Always delegate
  to the appropriate subagent.
- You MUST NOT skip any step in the procedure.
- You MUST complete each step before moving to the next.
- For commits/PRs: @git-committer should only gather information produced by
  the previous steps — it must not perform its own review or documentation.
