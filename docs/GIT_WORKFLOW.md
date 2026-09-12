# ResolveFlow — Team Git Workflow & Collaboration Guide

To ensure rapid, collision-free development across all 4 team members during the hackathon, follow this workflow strictly.

---

## 1. Git Branch Structure

```
main (STABLE INTEGRATION BRANCH - Production Ready)
 │
 ├── feature/member-1-ui          (Member 1: React UI & Case Management)
 ├── feature/member-2-agent       (Member 2: Autonomous Agent & Replanning)
 ├── feature/member-3-enterprise  (Member 3: Enterprise Data & Evidence)
 └── feature/member-4-actions     (Member 4: Actions & Verification)
```

> [!IMPORTANT]
> All 4 feature branches are created from the **same initial foundation commit** on `main`.

---

## 2. Team Branch & Area Ownership

| Member | Feature Branch | Primary Directories |
| :--- | :--- | :--- |
| **Member 1** | `feature/member-1-ui` | `client/` |
| **Member 2** | `feature/member-2-agent` | `server/src/services/agent/`, `server/src/tools/` |
| **Member 3** | `feature/member-3-enterprise` | `server/src/models/`, `server/src/services/customer/`, `server/src/services/order/`, `server/src/services/inventory/`, `server/src/services/policy/` |
| **Member 4** | `feature/member-4-actions` | `server/src/services/actions/`, `server/src/services/verification/` |

---

## 3. Shared File Ownership Rules

The following files are **SHARED** and must NOT be modified without team lead approval:
- `package.json` (root)
- `README.md` (root)
- `.env.example`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/DATABASE.md`
- `docs/GIT_WORKFLOW.md`
- `server/src/app.js` / `server/src/server.js`

If changes to shared infrastructure (e.g. adding a new global package or route) are required:
1. Coordinate with the team lead.
2. Commit changes separately with a clear commit message.
3. Announce the update to the team.

---

## 4. Conventional Commit Standards

Every commit message must follow this format:
```
<type>(<scope>): <short description>
```

### Allowed Types
- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code reorganization without functional changes
- `docs`: Documentation updates
- `test`: Adding or updating test suites
- `chore`: Tooling, build, or configuration updates
- `style`: Formatting, spacing, UI visual adjustments
- `perf`: Performance improvements

### Approved Examples
```bash
feat(ui): add case creation form modal
feat(agent): implement autonomous tool selection loop
feat(enterprise): add inventory retrieval service
feat(actions): implement refund execution service
feat(verification): add state verification validator
fix(agent): handle replacement stock-out failure
fix(ui): handle empty case list gracefully
chore: update environment variables example
```

> [!CAUTION]
> Avoid vague commits like `"updates"`, `"done"`, `"fixed stuff"`, `"new code"`. Small, logical commits make debugging and merging seamless.

---

## 5. Daily Member Workflow

### Starting Work
```bash
git checkout main
git pull origin main
git checkout feature/member-X-<name>
git merge main
```

### Submitting Work (Pull Request Process)
1. Synchronize local branch with latest `main`:
   ```bash
   git fetch origin
   git merge origin/main
   ```
2. Resolve any merge conflicts locally.
3. Test backend and frontend builds:
   ```bash
   npm run build:client
   npm run test:server
   ```
4. Commit clean changes and push:
   ```bash
   git push origin feature/member-X-<name>
   ```
5. Open PR to `main` for Team Lead review.

---

## 6. Official Merge Order

To ensure zero broken dependencies, feature branches will be merged into `main` in this exact sequence:

1. **Phase 1: MEMBER 3 — Enterprise Intelligence (`feature/member-3-enterprise`)**
   - Provides models, database seed scripts, and customer/order/inventory/policy query services.
2. **Phase 2: MEMBER 4 — Actions & Verification (`feature/member-4-actions`)**
   - Provides mutation actions (refund/replacement/cancel) and verification checks.
3. **Phase 3: MEMBER 2 — Agent & Replanning (`feature/member-2-agent`)**
   - Wires up the autonomous orchestrator utilizing tools from Member 3 & Member 4.
4. **Phase 4: MEMBER 1 — Frontend Integration (`feature/member-1-ui`)**
   - Connects the polished UI to live backend endpoints.
