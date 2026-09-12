# ResolveFlow — Git Workflow

## Repository Layout

```
agentic_ai-main/         ← repository root
├── apps/                ← existing workshop (untouched)
├── resolveflow/         ← our application
└── ...
```

---

## Branches

| Branch | Owner | Purpose |
|--------|-------|---------|
| `main` | Team Lead | Stable, runnable at all times |
| `feature/member-1-ui` | Member 1 | Frontend (React/Vite) |
| `feature/member-2-agent` | Member 2 | Agent orchestration + tools |
| `feature/member-3-enterprise` | Member 3 | Enterprise data services + models |
| `feature/member-4-actions` | Member 4 | Actions + verification |

All four feature branches originate from the **same foundation commit** on `main`.

---

## Module Ownership

### Member 1 — Frontend

```
resolveflow/client/
```

### Member 2 — Agent Engine

```
resolveflow/server/src/services/agent/
resolveflow/server/src/tools/
```

### Member 3 — Enterprise Intelligence

```
resolveflow/server/src/models/
resolveflow/server/src/services/customer/
resolveflow/server/src/services/order/
resolveflow/server/src/services/inventory/
resolveflow/server/src/services/policy/
```

### Member 4 — Actions & Verification

```
resolveflow/server/src/services/actions/
resolveflow/server/src/services/verification/
```

### Shared Infrastructure (Coordinate with Team Lead)

```
resolveflow/server/src/routes/
resolveflow/server/src/controllers/
resolveflow/server/src/config/
resolveflow/server/src/middleware/
resolveflow/server/src/utils/
resolveflow/docs/
resolveflow/.env.example
resolveflow/README.md
```

**Rule:** Never modify a shared file independently. Coordinate with the team lead first.

---

## Starting Your Branch

```bash
git checkout main
git pull origin main
git checkout feature/member-X-<name>

# Verify you're on the right branch
git branch
```

---

## Commit Message Convention

Format: `<type>(<scope>): <description>`

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `docs` | Documentation only |
| `test` | Test additions or corrections |
| `chore` | Tooling, config, build changes |
| `style` | Formatting, white-space (no logic change) |
| `perf` | Performance improvement |

### Scopes

| Scope | Module |
|-------|--------|
| `ui` | Member 1 frontend |
| `agent` | Member 2 agent engine |
| `enterprise` | Member 3 data services |
| `actions` | Member 4 actions |
| `verification` | Member 4 verification |
| `simulator` | Failure simulator |
| `api` | Shared API layer |
| `db` | Database / models |
| `repo` | Root repository |

### Examples

```
feat(ui): add case creation form
feat(ui): add agent journey timeline
feat(agent): implement orchestration loop
feat(agent): add failure detection
feat(agent): add replanning logic
feat(enterprise): add customer retrieval service
feat(enterprise): add inventory service
feat(enterprise): seed synthetic data
feat(actions): add refund execution
feat(actions): add idempotency check
feat(verification): add post-action state check
feat(simulator): set inventory to zero for demo
fix(agent): handle missing order data
fix(actions): prevent duplicate refund
docs(api): add verification endpoint docs
test(agent): add replanning scenario test
chore(repo): update env example
```

### ❌ Bad Commit Messages

```
update
changes
final
done
new file
fixed
working now
latest
```

---

## Development Workflow

### 1. Before Starting Work

```bash
git checkout main
git pull origin main
git checkout feature/member-X-<name>
git merge main   # keep your branch current
```

### 2. During Development

```bash
# Make changes...
git add <specific-files>
git commit -m "feat(scope): clear description"
git push origin feature/member-X-<name>
```

**Never `git add .` blindly** — review what you're staging.

### 3. Before Opening a Pull Request

- [ ] Pull latest `main` and merge into your branch
- [ ] Resolve all conflicts locally
- [ ] Run `npm install` in both `server/` and `client/`
- [ ] Start the server — confirm it starts without errors
- [ ] Start the client — confirm it renders without errors
- [ ] Test your endpoints with Postman or curl
- [ ] Check database behavior
- [ ] Remove all `console.log` debug statements
- [ ] Remove hardcoded secrets
- [ ] Remove temporary test code
- [ ] Commit with a clean, conventional message
- [ ] Push your branch
- [ ] Open a Pull Request against `main`

---

## Pull Request Rules

1. **Target branch:** always `main`
2. **Title:** use Conventional Commits format — e.g. `feat(agent): implement orchestration loop`
3. **Description:** describe what changed and why, not just what
4. **Only the team lead merges PRs** — do not self-merge
5. **No force push** to `main`
6. **No rewriting history** on shared branches

---

## Merge Order (Recommended)

```
1. Member 3 (Enterprise Intelligence)
   → Creates models and services that others depend on

2. Member 4 (Actions + Verification)
   → Depends on Member 3's models

3. Member 2 (Agent Engine)
   → Orchestrates Member 3 and Member 4's services

4. Member 1 (Frontend)
   → Integrates the complete backend
```

---

## Conflict Prevention Rules

| Rule | Detail |
|------|--------|
| Own your directory | Never modify another member's primary directory |
| Shared files need coordination | Always ask the team lead before editing shared files |
| No direct push to main | All work goes through Pull Requests |
| Communicate before touching shared routes | Routes/controllers are shared infra |
| API contract is frozen | Do not rename endpoints independently |

---

## Security Rules

- Never commit `.env` files
- Never commit API keys, passwords, or tokens
- Always use `.env.example` for templates
- Backend must validate all state-changing requests — never trust frontend state

---

## Quick Reference

```bash
# Check your branch
git branch

# Check status
git status

# Stage specific files
git add resolveflow/client/src/pages/Dashboard.jsx

# Commit
git commit -m "feat(ui): add dashboard layout"

# Push
git push origin feature/member-1-ui

# Update from main
git checkout main
git pull origin main
git checkout feature/member-1-ui
git merge main

# View branch graph
git log --oneline --graph --all
```
