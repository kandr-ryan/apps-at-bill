# Apps@Bill -- Product Vision

## Executive Summary

Apps@Bill is an internal developer platform that gives teams at Bill the autonomy to build, deploy, and manage internal productivity tools -- without having to think about infrastructure, security review, access provisioning, or deployment. Think of it as an internal App Store: you build your tool, submit it, it gets reviewed, and it goes live.

The platform eliminates the single biggest reason internal tools die: the overhead of deploying them safely exceeds the effort of building them.

---

## The Problem

Today, when a team at Bill identifies a manual, time-consuming, or error-prone workflow -- like localizing pages or updating bank widget templates -- they have two options:

1. **Live with it.** Keep doing the manual work. Productivity stays low.
2. **Try to build a tool.** But to deploy it safely, they need: a repo, CI/CD, a hosting environment, DNS, Okta provisioning, secrets management, a security review, and ongoing maintenance. This takes weeks of coordination across multiple teams (engineering, Infosec, IT) and most tools never make it past the "it works on my laptop" stage.

The result: useful tools exist as scripts on individual laptops, shared Google Sheets, or half-finished side projects. The productivity gain disappears. Institutional knowledge stays siloed.

---

## The Solution

Apps@Bill is a self-service portal where any technical employee can:

1. **Request** a new internal app (and get infrastructure provisioned automatically)
2. **Build** it locally with a pre-configured repo, templates, and secrets
3. **Submit** it for automated security scanning and Infosec review
4. **Deploy** it to a gated internal environment with a single approval
5. **Distribute** it via Okta tiles and the internal App Catalog

The platform handles everything the builder shouldn't have to think about: repo creation, CI/CD pipelines, secrets injection, security gates, Okta provisioning, DNS, and ongoing governance.

---

## Personas

### The Builder
- **Who**: Technical PMs, developers, technical PMs who vibe-code. They know the basics of spinning up an app but aren't infrastructure experts.
- **Goal**: "I have an idea for a tool that saves my team 10 hours a week. I want to build it and get it in front of my team without a 6-week infrastructure odyssey."
- **Pain today**: Can build the tool, can't deploy it safely. Gets stuck at repo provisioning, security review, or access management.

### The Infosec Reviewer
- **Who**: Security engineers responsible for ensuring internal tools don't leak data or introduce vulnerabilities.
- **Goal**: "I want to review and approve internal tools quickly, with confidence that they've been scanned for common issues."
- **Pain today**: Gets ad-hoc review requests with no standard format, no automated scanning, and no audit trail. Reviews are slow because there's no process.

### The Platform Admin
- **Who**: IT/DevOps engineers managing the internal tooling infrastructure.
- **Goal**: "I want to give teams self-service capabilities without creating a security nightmare or ungoverned sprawl."
- **Pain today**: Every internal tool is a snowflake deployment. No visibility into what's running, who's using it, or what secrets it holds.

### The End User
- **Who**: Any Bill employee who uses an internal tool.
- **Goal**: "I want to find and access tools that help me do my job."
- **Pain today**: Doesn't know what tools exist. Has to ask around. Tools are scattered across bookmarks, Slack channels, and tribal knowledge.

---

## End-to-End Workflow

### Phase 1: Request & Provision

1. Builder logs into **apps.bill.com** via Okta SSO
2. Builder browses the **App Catalog** to check if a similar tool already exists
3. Builder clicks **"New App"** and fills out the request form:
   - **Basic info**: App name, description, what it accomplishes, target users
   - **Team scope**: Which team is this for? Or is it company-wide?
   - **Template**: Pick a starter template (React Dashboard, Python Tool, Slack Bot, etc.)
   - **Infrastructure**:
     - GitHub repo name
     - Internal URL: `apps.bill.com/{app-slug}`
     - Okta provisioning: yes/no
   - **Data access scopes**: What internal data does the app need? At what permission level?
     - Example: "Read access to the localization table"
     - Example: "Read/write access to the widget template API"
   - **Secrets**: Which API keys/tokens does the app need?
     - Preset options: Gemini, OpenAI, Stripe, Slack, SendGrid, Twilio, AWS, Database URL
     - Custom secrets: name + description
4. Builder submits the request
5. Platform automatically provisions:
   - A GitHub repo (from the selected template) under the `bill-internal` org
   - A CI/CD pipeline attached to the repo
   - Scoped API tokens for the requested data access
   - Environment variables for the requested secrets
   - A reserved URL at `apps.bill.com/{app-slug}`
6. Builder receives a **copyable clone command**:

```
git clone https://github.com/bill-internal/{app-name}.git
cd {app-name}
npm install
npm run dev
# Your secrets are pre-configured in the portal
# Push to main to deploy to dev
# Push to prod to trigger security gate
```

### Phase 2: Build

7. Builder clones the repo locally, builds the app using the provided template
8. Pushes to `main` branch -- auto-deploys to a **dev environment** (no gate)
9. Iterates, tests, gets feedback from their team

### Phase 3: Submit for Review

10. Builder pushes to `prod` branch (or clicks "Submit for Review" in the portal)
11. This triggers the **CI/CD security gate**:
    - The pipeline runs the **AI Vulnerability Scanner** (see detailed design below)
    - The scanner produces a structured report with a score and findings
    - If the score is below a threshold, the builder is shown findings and asked to fix them before an Infosec reviewer ever sees it
12. Once the scan passes the threshold, the app enters the **Infosec Review Queue**
13. An Infosec reviewer sees:
    - App metadata and description
    - The builder's requested data scopes and secrets
    - The full AI scan report (5 categories, scores, findings, severity levels)
    - The source code (linked to the repo)
14. The reviewer can:
    - **Approve** -- app proceeds to deployment
    - **Request Changes** -- with specific comments; builder is notified
    - **Reject** -- with reason; builder can revise and resubmit

### Phase 4: Deploy & Distribute

15. On approval:
    - The app is deployed to a **gated, partitioned environment** within Bill's infrastructure
    - The app has **full read/write data access**, but ONLY through the scoped API tokens that enforce the permissions approved in review
    - The app becomes available at its reserved URL: `apps.bill.com/{app-slug}`
    - An **Okta tile** is provisioned for the app
    - The app appears in the **internal App Catalog** (the "App Store")
16. Access management:
    - For team-specific apps: the requesting team is auto-provisioned access
    - For company-wide apps: access is open to all employees
    - Additional users/teams can be added via Okta group assignments in the portal

### Phase 5: Ongoing Governance

17. **Every subsequent push to `prod`** goes through the same security gate (scan + Infosec approval)
18. Secrets can be rotated or revoked by the builder or admin at any time via the portal
19. Approvals are **time-boxed** -- apps must be re-reviewed periodically (e.g., every 6 months)
20. Usage and health metrics are tracked (active users, error rates, last deploy)
21. Apps can be **deprecated** or **archived** via self-service teardown (revokes secrets, removes DNS, archives repo)

---

## Data Access Model

This is the most security-critical design decision in the platform.

### Principle: Scoped API Tokens, Not Direct Database Access

Apps built on this platform do **not** get direct database connections. Instead:

1. At request time, the builder specifies what data they need and at what permission level (read, read/write)
2. The platform provisions **scoped API tokens** that can only access the approved data domains
3. These tokens are injected as environment variables at deploy time -- never committed to code
4. The AI scanner and Infosec reviewer verify the app only uses the scopes it was granted

This is how Google, Meta, and Spotify handle internal tool data access. It provides:
- **Blast radius containment**: A buggy app can only affect the data it was approved to touch
- **Auditability**: Every data access is traceable to a specific app and approval
- **Revocability**: Tokens can be rotated or revoked instantly without touching the app's code

### Example

A builder creating an "AI Localization Tool" might request:
- `localization.pages` -- read/write (to read page content and write translations)
- `localization.languages` -- read (to get the list of supported languages)
- `users.directory` -- read (to look up reviewer assignments)

The platform provisions an API token that can only make calls matching these scopes. If the app tries to access `billing.invoices`, the request is denied at the API layer.

---

## Okta Integration

Okta serves two distinct roles in this platform:

### 1. Authentication (SSO)
- All users (builders, reviewers, admins, end users) log into `apps.bill.com` via Okta SSO
- This leverages Bill's existing Okta infrastructure -- no new auth system needed
- Roles (builder, reviewer, admin) are mapped to Okta groups

### 2. Access Provisioning (App Distribution)
- When an app is approved and deployed, it is registered as an **Okta application**
- End users see the app as a **tile in their Okta dashboard** (alongside other Bill tools)
- User access is managed through **Okta group assignments**:
  - Team-specific apps: assigned to the team's Okta group
  - Company-wide apps: assigned to the all-employees group
  - Custom access: admin can add/remove specific users or groups
- This means end users don't need to know `apps.bill.com/tool-name` -- they just click the tile

---

## CI/CD Pipeline Design

Each provisioned app gets an automated CI/CD pipeline:

### Dev Branch (No Gate)
- Every push to `main` (or `dev`) auto-deploys to a development environment
- The builder can iterate quickly without any review overhead
- Dev environment has the same secrets and data scopes as production (so testing is realistic)

### Prod Branch (Security Gate)
- Every push to `prod` triggers the full security pipeline:
  1. **Build**: Compile/bundle the app
  2. **Scan**: Run the AI Vulnerability Scanner (5-category analysis)
  3. **Gate**: If scan score is below threshold, block deployment and notify builder
  4. **Review**: If scan passes, send to Infosec review queue
  5. **Deploy**: On Infosec approval, deploy to production environment
- This ensures no code reaches production without both automated and human review

### Secrets Injection
- Secrets are **never** stored in the repo or committed to code
- The CI/CD pipeline injects approved secrets as environment variables at build/deploy time
- Secrets are stored in the platform's encrypted vault and retrieved at deploy time

---

## AI Vulnerability Scanner

The scanner is the automated first line of defense. It runs on every submission and produces a structured report.

### Five Analysis Categories

| Category | What It Checks | How |
|---|---|---|
| **Dependency Audit** | Known CVEs in npm/pip/etc. packages | Cross-reference package versions against CVE databases (like Snyk/Trivy) |
| **Secret Detection** | Hardcoded API keys, tokens, passwords in source code | Pattern matching + entropy analysis on string literals |
| **Network Analysis** | External API calls outside Bill's approved domains | AST analysis of HTTP/fetch calls, DNS lookups |
| **Data Handling** | PII logging, unencrypted storage, improper data serialization | AI-powered code analysis of logging statements and storage operations |
| **Permission Scope** | Whether the app accesses data beyond its approved scopes | Compare actual API/data calls against the approved scope list |

### Scoring

- Each category receives a score from 0 (critical issues) to 100 (clean)
- An **overall score** is computed as a weighted average
- Each finding includes:
  - **Severity**: Critical / High / Medium / Low / Info
  - **Description**: What was found
  - **Location**: File and line number
  - **Recommendation**: How to fix it
- A configurable **threshold score** determines whether the app auto-advances to Infosec review or is sent back to the builder

### Example Scan Report

```
Overall Score: 72/100 (Medium Risk)

Dependency Audit:        85/100  -- 2 medium-severity CVEs found
Secret Detection:        95/100  -- Clean (no hardcoded secrets)
Network Analysis:        60/100  -- 1 external API call to unrecognized domain
Data Handling:           70/100  -- PII field logged without masking
Permission Scope:        50/100  -- App attempts to access user.email (not in approved scopes)

Findings (5):
  [HIGH] Network: Outbound call to api.external-service.com not in approved domain list
         -> File: src/utils/translate.ts:47
         -> Fix: Use the internal translation proxy at internal-api.bill.com/translate
  
  [HIGH] Scope: App accesses users.email but only users.directory (read) was approved
         -> File: src/components/reviewer-lookup.tsx:23
         -> Fix: Request users.email scope or use the directory lookup endpoint
  
  [MEDIUM] Dependencies: lodash@4.17.20 has CVE-2021-23337 (prototype pollution)
           -> Fix: Upgrade to lodash@4.17.21+
  
  [MEDIUM] Data: console.log includes user.firstName (PII) without masking
           -> File: src/pages/dashboard.tsx:89
           -> Fix: Remove PII from logs or use the logging SDK's mask() function
  
  [MEDIUM] Dependencies: axios@0.21.1 has CVE-2021-3749 (ReDoS)
           -> Fix: Upgrade to axios@0.21.2+
```

---

## Security Principles

### 1. Principle of Least Privilege
- Apps request specific, granular data scopes -- not blanket access
- API tokens enforce these scopes at the infrastructure level
- Reviewers verify requested scopes match the app's stated purpose

### 2. Immutable Audit Trail
- Every action is logged and cannot be modified:
  - App creation, modification, submission
  - Scan runs and results
  - Review decisions and comments
  - Access grants and revocations
  - Secret creation, rotation, revocation
- The audit trail is visible on each app's detail page as a timeline

### 3. Time-Boxed Approvals
- Approvals expire after a configurable period (e.g., 6 months)
- Before expiration, the app is automatically re-scanned
- If the re-scan finds new issues, the app is flagged for re-review
- This prevents "approved 2 years ago, never looked at again" drift

### 4. Secrets Hygiene
- Secrets are never committed to repos
- Secrets are injected as environment variables at deploy time only
- Secrets can be rotated or revoked instantly by the builder or admin
- The scanner flags any hardcoded secrets in source code
- Secret access is logged

### 5. Defense in Depth
- Automated scanning catches known patterns
- Human review catches business logic and intent issues
- Scoped tokens prevent unauthorized data access at runtime
- Network policies prevent unauthorized external communication
- Audit trails enable forensic analysis if something goes wrong

---

## App Lifecycle

```
Draft ──> Submitted ──> In Review ──> Approved ──> Deployed
                            │                         │
                            ▼                         ▼
                     Changes Requested           Deprecated
                            │                         │
                            ▼                         ▼
                      (Builder fixes)             Archived
                            │
                            ▼
                     Resubmitted ──> In Review ...
```

- **Draft**: App request created but not yet submitted
- **Submitted**: Request sent; infrastructure being provisioned
- **In Review**: Code submitted; scan complete; awaiting Infosec approval
- **Changes Requested**: Reviewer found issues; builder needs to address them
- **Approved**: Infosec signed off; ready to deploy
- **Deployed**: Live and accessible to approved users
- **Deprecated**: Marked for sunset; still accessible but flagged
- **Archived**: Decommissioned; secrets revoked, DNS removed, repo archived

---

## App Catalog & Discovery

The App Catalog is the home page of the portal. It serves two purposes:

1. **Discovery**: Employees can browse and search for existing internal tools before building something new
2. **Governance**: Admins and leadership can see the full landscape of internal tooling

The catalog shows:
- App name, description, team, and category
- Current status (deployed, in review, deprecated, etc.)
- Active user count and last deployment date
- Owner/builder contact info

Searchable and filterable by: team, status, category, keyword.

---

## Templates & Scaffolding

To accelerate development (especially for technical PMs and vibe-coders), the platform offers starter templates:

- **React Dashboard**: A pre-built admin dashboard with routing, auth, and data fetching patterns
- **Python Data Tool**: A FastAPI backend with a simple UI for data processing workflows
- **Slack Bot**: A Node.js Slack bot with event handling and command registration
- **Chrome Extension**: A browser extension template with Bill's internal API patterns
- **Data Pipeline**: A scheduled Python job template for ETL workflows

Each template includes:
- Bill's internal auth/SSO integration
- Bill's UI kit and branding
- Pre-configured CI/CD pipeline
- Example code showing approved patterns for data access and logging

---

## Future Considerations

These are not in the initial scope but represent natural extensions:

- **Usage & Health Dashboard**: Per-app metrics (active users, error rates, uptime, response times)
- **Cost Attribution**: Track compute and resource costs per app; charge back to the owning team
- **Environment Tiers**: Separate dev/staging/prod environments with independent secrets contexts
- **Self-Service Teardown**: Clean decommission flow (revoke secrets, remove DNS, archive repo, remove Okta tile)
- **Inter-App Communication**: Allow approved apps to call each other's APIs via the platform's service mesh
- **App Marketplace**: Allow builders to share templates and components with each other
- **Analytics**: Platform-level analytics on what tools are being built, what's being used, and where gaps exist

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Apps@Bill Portal                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ App      │  │ New App  │  │ Review   │  │ Admin   │ │
│  │ Catalog  │  │ Request  │  │ Queue    │  │ Panel   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │   API Layer     │
              └────────┬────────┘
                       │
    ┌──────────┬───────┼───────┬───────────┐
    ▼          ▼       ▼       ▼           ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐
│ GitHub │ │ Okta │ │Vault │ │Gemini│ │  DNS/  │
│  API   │ │ API  │ │(Secr)│ │  AI  │ │Hosting │
└────────┘ └──────┘ └──────┘ └──────┘ └────────┘
```

- **GitHub API**: Repo creation from templates, branch management
- **Okta API**: SSO authentication, tile provisioning, group management
- **Secrets Vault**: Encrypted storage for API keys and tokens; injection at deploy time
- **Gemini AI**: Powers the vulnerability scanner's code analysis capabilities
- **DNS/Hosting**: URL provisioning and app hosting in Bill's gated environment
