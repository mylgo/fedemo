# Project Overview

- Stack: Node.js 20 + TypeScript, Express, Prisma, PostgreSQL
- Structure: /src(api, services, repos), /tests, /docs

# Coding Standards

- Naming: camelCase for vars/fns; PascalCase for types/interfaces/components
- Error handling: never swallow errors; include error codes
- I18n: user-facing strings must be centralized

# Output Conventions

- PR description: key changes, risk, rollback, test plan
- Commit message: Conventional Commits (feat/fix/refactor), imperative mood

# Review Focus

- First: injection/DoS/secrets; Then: correctness; Then: performance
