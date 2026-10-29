# Apps@Bill -- Demo Prototype Requirements

> **Purpose**: Build a polished, clickable demo that shows every touchpoint of the Apps@Bill workflow. This prototype is designed to pitch the concept to leadership -- it should look and feel real, with realistic mock data, even where backend integrations are simulated.
>
> **Reference**: See [CONCEPT.md](CONCEPT.md) for the full product vision, architecture, and design rationale.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: SQLite via Prisma (local, file-based -- no external DB needed)
- **Auth**: NextAuth.js with a mock Okta provider (simulates SSO login)
- **GitHub Integration**: Real GitHub API via Octokit, wired to a personal GitHub account
- **AI Scanner**: Mock scan results with realistic data (Gemini API integration as stretch goal)
- **State**: React Server Components + Server Actions

---

## Pages & Features

### 1. App Catalog (Home) -- `/`

The landing page after login. Shows all internal tools in a searchable grid.

- **Layout**: Grid of app cards (3 columns on desktop, 1 on mobile)
- **Each card shows**: App name, description (truncated), team, status badge, active user count, last deploy date
- **Status badges**: Draft (gray), In Review (yellow), Deployed (green), Deprecated (red)
- **Filters**: By team, by status, search by keyword
- **Action**: "New App" button in the header (prominent, primary color)
- **Pre-seeded mock data** (6-8 apps at various lifecycle stages):
  - "AI Localization Tool" -- Deployed, Engineering, 24 active users
  - "Bank Widget Template Manager" -- Deployed, Product, 12 active users
  - "Expense Report Automator" -- In Review, Finance, 0 active users
  - "Slack Standup Bot" -- Deployed, Engineering, 45 active users
  - "Customer Feedback Analyzer" -- Draft, Support, 0 active users
  - "Internal Knowledge Search" -- In Review, Engineering, 0 active users
  - "PTO Calendar Sync" -- Deprecated, HR, 8 active users
  - "Release Notes Generator" -- Deployed, Engineering, 31 active users

### 2. New App Request -- `/new`

Multi-step form for requesting a new internal app. This is the core builder experience.

**Step 1: Basic Info**
- App name (text input, required)
- Description (textarea, required)
- What does this accomplish? (textarea -- the problem statement)
- Target users (text input -- "Engineering team", "All employees", etc.)
- Team scope: dropdown (Engineering, Product, Finance, HR, Support, Company-Wide)
- Category: dropdown (Dashboard, Automation, Bot, Extension, Data Pipeline, Other)

**Step 2: Infrastructure**
- GitHub repo name (text input, auto-slugified from app name)
- Starter template: radio group with descriptions
  - React Dashboard -- "Admin dashboard with routing, auth, and data fetching"
  - Python Data Tool -- "FastAPI backend with a simple UI for data workflows"
  - Slack Bot -- "Node.js Slack bot with event handling"
  - Chrome Extension -- "Browser extension with internal API patterns"
  - Data Pipeline -- "Scheduled Python job for ETL workflows"
  - Blank -- "Empty repo with just CI/CD configuration"
- Internal URL: `apps.bill.com/` + editable slug (auto-filled from app name)
- Okta provisioning: toggle (yes/no), with helper text "Create an Okta tile for end users"

**Step 3: Data Access**
- Header text: "What internal data does your app need access to?"
- Checklist of internal data domains, each with a read/write toggle:
  - `localization.pages` -- "Page content and translations"
  - `localization.languages` -- "Supported language list"
  - `users.directory` -- "Employee directory and profiles"
  - `users.email` -- "Employee email addresses"
  - `billing.invoices` -- "Customer billing records"
  - `billing.subscriptions` -- "Subscription data"
  - `support.tickets` -- "Customer support tickets"
  - `analytics.events` -- "Product analytics events"
  - `content.templates` -- "Content and widget templates"
  - Custom scope: text input for name + description
- Each selected scope shows a read/write radio toggle
- Helper text: "Your app will receive scoped API tokens that only allow access to the data you select here. Direct database access is not permitted."

**Step 4: Secrets**
- Header text: "What API keys or secrets does your app need?"
- Preset checkboxes (each with description):
  - `GEMINI_API_KEY` -- "Google Gemini for AI/ML features"
  - `OPENAI_API_KEY` -- "OpenAI for GPT-based features"
  - `STRIPE_SECRET_KEY` -- "Stripe for payment processing"
  - `SLACK_WEBHOOK_URL` -- "Slack for notifications and integrations"
  - `SENDGRID_API_KEY` -- "SendGrid for transactional email"
  - `TWILIO_AUTH_TOKEN` -- "Twilio for SMS/Voice"
  - `AWS_ACCESS_KEY_ID` -- "AWS services access"
  - `DATABASE_URL` -- "Managed database connection string"
- Custom secret: repeatable row with name + description fields
- Helper text: "Secrets are injected as environment variables at deploy time. They are never committed to your repo."

**Step 5: Review & Submit**
- Summary of all selections across previous steps
- Editable (can go back to any step)
- "Submit Request" button
- On submit: shows a success screen with:
  - Copyable clone command block
  - Link to the created GitHub repo
  - Link to the app detail page
  - "What's next" checklist: Clone repo -> Build your app -> Push to prod -> Submit for review

### 3. App Detail -- `/apps/[id]`

The detail view for a single app. Different content based on lifecycle state.

- **Header**: App name, status badge, team, category, builder name
- **Tabs**:
  - **Overview**: Description, purpose, target users, created date, last updated
  - **Infrastructure**: Repo link (clickable), clone command (copyable), internal URL, Okta tile status
  - **Data Access**: Table of approved scopes with read/write indicators
  - **Secrets**: List of provisioned secrets (masked by default, reveal toggle), rotation/edit buttons
  - **Pipeline**: CI/CD status visualization (Build -> Scan -> Gate -> Deploy) with timestamps and status per stage
  - **Activity**: Audit trail timeline (created, submitted, scanned, reviewed, approved, deployed -- with dates and actors)
- **Actions** (contextual based on state):
  - Draft: "Submit for Review" button
  - Changes Requested: "Resubmit" button, reviewer comments shown prominently
  - Deployed: "View Live App" button (links to `apps.bill.com/{slug}`)

### 4. My Apps -- `/my-apps`

Dashboard of the current user's apps.

- Same card layout as the App Catalog but filtered to the logged-in user
- Summary stats at top: total apps, deployed, in review, draft
- Quick actions per card: View, Edit, Submit for Review

### 5. Submit for Review -- `/apps/[id]/submit`

Triggered when builder submits their app for Infosec review.

- Shows a "Scanning..." progress UI with the 5 scan categories animating through
- After scan completes (simulated 3-5 second delay), shows:
  - Overall score (large, centered, color-coded)
  - Per-category score bars
  - If below threshold: "Your app has issues that need to be addressed before review" + findings list + "Fix and Resubmit" button
  - If above threshold: "Your app has been submitted for Infosec review" + findings list (for awareness) + estimated review time

### 6. Review Queue -- `/review`

The Infosec reviewer's inbox.

- Table/list of apps pending review, sorted by submission date (oldest first)
- Each row shows: app name, builder name, team, submission date, scan score, risk level badge (Low/Medium/High/Critical)
- Click to open review detail
- Filter by: risk level, team, date range
- Stats bar at top: total pending, avg review time, reviewed this week

### 7. Review Detail -- `/review/[id]`

The full review view for an Infosec reviewer. This is the most information-dense page.

**Left column (2/3 width):**
- **AI Scan Report**:
  - Overall score (0-100) with color ring (green/yellow/orange/red)
  - Risk level badge
  - 5 category cards, each showing:
    - Category name and icon
    - Score bar (0-100)
    - Number of findings by severity
    - Expandable findings list with:
      - Severity badge (Critical/High/Medium/Low/Info)
      - Description of the finding
      - File path and line number
      - Recommendation for how to fix

**Right column (1/3 width):**
- **App metadata**: Name, builder, team, category, description
- **Requested data scopes**: Table with scope name + read/write level
- **Requested secrets**: List of secret names
- **Repo link**: Direct link to GitHub repo for code review
- **Review actions** (sticky at bottom of right column):
  - "Approve" button (green) -- with confirmation dialog
  - "Request Changes" button (yellow) -- opens comment textarea
  - "Reject" button (red) -- opens reason textarea

**Mock scan data for the demo** (for "Expense Report Automator"):
```
Overall Score: 72/100 (Medium Risk)

Dependency Audit:     85/100 (2 findings)
  [MEDIUM] lodash@4.17.20 -- CVE-2021-23337 (prototype pollution) -> Upgrade to 4.17.21+
  [MEDIUM] axios@0.21.1 -- CVE-2021-3749 (ReDoS) -> Upgrade to 0.21.2+

Secret Detection:     95/100 (1 finding)
  [LOW] Possible API key pattern in src/config.ts:12 -> Verify this is not a real key

Network Analysis:     60/100 (1 finding)
  [HIGH] Outbound call to api.exchangerate.io (not in approved domain list) -> Use internal forex proxy

Data Handling:        70/100 (1 finding)
  [MEDIUM] console.log includes user.email (PII) in src/pages/submit.tsx:89 -> Use logging SDK mask()

Permission Scope:     50/100 (1 finding)
  [HIGH] App accesses billing.subscriptions but only billing.invoices (read) was approved -> Request additional scope or remove usage
```

### 8. Admin: User Access -- `/admin/users`

Manage which users have access to which apps via Okta.

- Table of deployed apps with columns: app name, team, access type (team/company-wide), user count
- Click an app to expand: list of users/groups with access, add/remove buttons
- "Add User" opens a modal: search by name/email, select, confirm
- "Add Group" opens a modal: select Okta group (Engineering, Product, etc.)

### 9. Admin: Secrets -- `/admin/secrets`

Global view of all secrets across all apps.

- Table with columns: secret name, app, type (preset/custom), created date, last rotated, status
- Actions per row: Rotate (generates new value), Revoke (with confirmation), View history
- Summary stats: total secrets, needing rotation (>90 days), revoked

---

## Navigation & Layout

- **Top nav bar**: "Apps@Bill" logo/wordmark (left), navigation links (center), user avatar + dropdown (right)
- **Nav links**: Catalog, My Apps, New App | Review Queue (visible only to reviewers), Admin (visible only to admins)
- **Role simulation**: Toggle in user dropdown to switch between "Builder", "Reviewer", and "Admin" views (for demo purposes)
- **Responsive**: Works on desktop and tablet. Mobile is stretch goal.
- **Dark/light mode**: Follow system preference via Tailwind's `dark:` classes

---

## Database Schema (Prisma)

### Models

**App**
- id, name, slug, description, purpose, targetUsers
- teamScope (enum: Engineering, Product, Finance, HR, Support, CompanyWide)
- category (enum: Dashboard, Automation, Bot, Extension, Pipeline, Other)
- status (enum: Draft, Submitted, InReview, ChangesRequested, Approved, Deployed, Deprecated, Archived)
- repoUrl, repoName, templateType, internalUrl
- oktaProvisioned (boolean)
- scanScore (nullable int)
- builderId (relation to User)
- createdAt, updatedAt

**DataScope**
- id, appId (relation to App)
- scopeName, scopeDescription
- accessLevel (enum: Read, ReadWrite)

**Secret**
- id, appId (relation to App)
- name, description, type (enum: Preset, Custom)
- status (enum: Active, Rotated, Revoked)
- createdAt, lastRotatedAt

**Review**
- id, appId (relation to App)
- reviewerId (relation to User)
- status (enum: Pending, Approved, ChangesRequested, Rejected)
- comment (nullable text)
- scanReport (JSON -- the full scan result)
- createdAt

**User**
- id, name, email, avatarUrl
- role (enum: Builder, Reviewer, Admin)
- team (enum: Engineering, Product, Finance, HR, Support)

**AuditLog**
- id, appId (relation to App)
- userId (relation to User)
- action (string -- "created", "submitted", "scanned", "approved", etc.)
- details (nullable text)
- createdAt

---

## GitHub Integration

- Use **Octokit** (official GitHub SDK) to create repos via the GitHub API
- Wired to a personal GitHub account via a `GITHUB_TOKEN` environment variable
- On "Submit Request":
  1. Call `POST /user/repos` to create a new repo with the specified name
  2. If a template is selected, use GitHub's template repository feature (`POST /repos/{template}/generate`)
  3. Return the clone URL to the user
- The clone command displayed to the user should be a fully copyable block including the HTTPS URL
- For the demo, repos are created under the authenticated user's account

---

## Mock Data Seeding

On first run (or via a seed script), populate the database with:
- 3-4 mock users (with different roles)
- 6-8 mock apps at various lifecycle stages (as listed in the App Catalog section)
- Scan reports for apps in review (as detailed in the Review Detail section)
- Audit log entries for each app showing realistic timeline events
- Data scopes and secrets for each app

---

## File Structure

```
app-automation/
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # Mock data seeding script
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with top nav
│   │   ├── page.tsx            # App Catalog (home)
│   │   ├── new/
│   │   │   └── page.tsx        # Multi-step New App Request form
│   │   ├── apps/
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # App detail (tabbed)
│   │   │       └── submit/
│   │   │           └── page.tsx # Submit for review + scan progress
│   │   ├── my-apps/
│   │   │   └── page.tsx        # My apps dashboard
│   │   ├── review/
│   │   │   ├── page.tsx        # Review queue
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Review detail + scan report
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   └── page.tsx    # User access management
│   │   │   └── secrets/
│   │   │       └── page.tsx    # Global secrets management
│   │   └── api/
│   │       ├── apps/
│   │       │   └── route.ts    # App CRUD
│   │       ├── github/
│   │       │   └── route.ts    # Repo provisioning
│   │       ├── review/
│   │       │   └── route.ts    # Review actions
│   │       └── scan/
│   │           └── route.ts    # Mock scan trigger
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── app-card.tsx
│   │   ├── request-form/
│   │   │   ├── step-basic-info.tsx
│   │   │   ├── step-infrastructure.tsx
│   │   │   ├── step-data-access.tsx
│   │   │   ├── step-secrets.tsx
│   │   │   └── step-review.tsx
│   │   ├── scan-report.tsx
│   │   ├── review-actions.tsx
│   │   ├── clone-command.tsx
│   │   ├── pipeline-status.tsx
│   │   ├── audit-timeline.tsx
│   │   └── secrets-table.tsx
│   ├── lib/
│   │   ├── github.ts           # Octokit wrapper
│   │   ├── scanner.ts          # Mock scan logic
│   │   ├── db.ts               # Prisma client singleton
│   │   └── auth.ts             # Mock auth helpers
│   └── types/
│       └── index.ts
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## Build Order

Build in this sequence so there's a demoable state at every step:

1. **Scaffold**: Next.js + Tailwind + shadcn/ui + Prisma + SQLite setup
2. **Schema + Seed**: Prisma schema + seed script with all mock data
3. **Layout + Nav**: Root layout with top navigation, role switcher
4. **App Catalog**: Home page with mock app cards, search, filters
5. **New App Request**: Multi-step form (all 5 steps)
6. **GitHub Integration**: Real repo creation wired to personal account
7. **App Detail**: Tabbed detail page with all sections
8. **My Apps**: Filtered dashboard
9. **Submit for Review**: Scan animation + mock results display
10. **Review Queue**: Reviewer inbox with sorting and filters
11. **Review Detail**: Full scan report + approval/rejection flow
12. **Admin Pages**: User access management + secrets management
13. **Polish**: Loading states, empty states, error handling, responsive tweaks
