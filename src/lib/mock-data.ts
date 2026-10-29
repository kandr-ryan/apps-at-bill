import { AppData, User, ScanReport } from "./types";

export const mockUsers: User[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah.chen@bill.com", role: "Builder", team: "Engineering", avatar: "SC" },
  { id: "u2", name: "Marcus Johnson", email: "marcus.johnson@bill.com", role: "Builder", team: "Product", avatar: "MJ" },
  { id: "u3", name: "Priya Patel", email: "priya.patel@bill.com", role: "Reviewer", team: "Engineering", avatar: "PP" },
  { id: "u4", name: "David Kim", email: "david.kim@bill.com", role: "Admin", team: "Engineering", avatar: "DK" },
  { id: "u5", name: "Alex Rivera", email: "alex.rivera@bill.com", role: "Builder", team: "Finance", avatar: "AR" },
  { id: "u6", name: "Jordan Lee", email: "jordan.lee@bill.com", role: "Builder", team: "Support", avatar: "JL" },
];

export const currentUser = mockUsers[0]; // Sarah Chen, Builder

const scanReportExpense: ScanReport = {
  overallScore: 72,
  riskLevel: "Medium",
  categories: [
    {
      name: "Dependency Audit",
      score: 85,
      findings: [
        { severity: "Medium", category: "Dependency Audit", description: "lodash@4.17.20 has known prototype pollution vulnerability (CVE-2021-23337)", file: "package.json", line: 12, recommendation: "Upgrade to lodash@4.17.21 or later" },
        { severity: "Medium", category: "Dependency Audit", description: "axios@0.21.1 has ReDoS vulnerability (CVE-2021-3749)", file: "package.json", line: 8, recommendation: "Upgrade to axios@0.21.2 or later" },
      ],
    },
    {
      name: "Secret Detection",
      score: 95,
      findings: [
        { severity: "Low", category: "Secret Detection", description: "String matches API key pattern: 'sk_test_...'", file: "src/config.ts", line: 12, recommendation: "Verify this is a test key and not a production secret. Move to environment variables." },
      ],
    },
    {
      name: "Network Analysis",
      score: 60,
      findings: [
        { severity: "High", category: "Network Analysis", description: "Outbound HTTP call to api.exchangerate.io -- not in approved domain list", file: "src/utils/currency.ts", line: 47, recommendation: "Use the internal forex proxy at internal-api.bill.com/forex instead" },
      ],
    },
    {
      name: "Data Handling",
      score: 70,
      findings: [
        { severity: "Medium", category: "Data Handling", description: "console.log() includes user.email (PII) without masking", file: "src/pages/submit.tsx", line: 89, recommendation: "Use the logging SDK's mask() function for PII fields" },
      ],
    },
    {
      name: "Permission Scope",
      score: 50,
      findings: [
        { severity: "High", category: "Permission Scope", description: "App accesses billing.subscriptions but only billing.invoices (read) was approved", file: "src/api/billing.ts", line: 23, recommendation: "Either request billing.subscriptions scope or remove this access" },
      ],
    },
  ],
};

const scanReportKnowledge: ScanReport = {
  overallScore: 88,
  riskLevel: "Low",
  categories: [
    {
      name: "Dependency Audit",
      score: 92,
      findings: [
        { severity: "Low", category: "Dependency Audit", description: "semver@7.5.3 has minor ReDoS concern", file: "package.json", line: 15, recommendation: "Upgrade to semver@7.5.4+ when available" },
      ],
    },
    {
      name: "Secret Detection",
      score: 100,
      findings: [],
    },
    {
      name: "Network Analysis",
      score: 85,
      findings: [
        { severity: "Low", category: "Network Analysis", description: "Uses Google Fonts CDN (fonts.googleapis.com)", file: "src/app/layout.tsx", line: 3, recommendation: "Consider self-hosting fonts for privacy compliance" },
      ],
    },
    {
      name: "Data Handling",
      score: 80,
      findings: [
        { severity: "Medium", category: "Data Handling", description: "Search queries are logged with user context", file: "src/lib/search.ts", line: 34, recommendation: "Anonymize search logs or add retention policy" },
      ],
    },
    {
      name: "Permission Scope",
      score: 85,
      findings: [
        { severity: "Low", category: "Permission Scope", description: "App reads users.directory but only uses name field", file: "src/components/results.tsx", line: 67, recommendation: "Consider requesting minimal user fields instead of full directory" },
      ],
    },
  ],
};

export const mockApps: AppData[] = [
  {
    id: "app-1",
    name: "AI Localization Tool",
    slug: "ai-localization",
    description: "AI-powered tool that automatically translates and localizes marketing pages across 12 languages with context-aware translations.",
    purpose: "Replace the manual localization process that currently takes 2-3 weeks per page with an AI-assisted workflow that completes in hours.",
    targetUsers: "Marketing team, Content team",
    team: "Engineering",
    category: "Automation",
    status: "Deployed",
    repoUrl: "https://github.com/bill-internal/ai-localization",
    repoName: "ai-localization",
    templateType: "React Dashboard",
    internalUrl: "apps.bill.com/ai-localization",
    oktaProvisioned: true,
    scanScore: 94,
    riskLevel: "Low",
    builder: mockUsers[0],
    activeUsers: 24,
    lastDeploy: "2026-01-28",
    createdAt: "2025-11-15",
    updatedAt: "2026-01-28",
    dataScopes: [
      { scopeName: "localization.pages", scopeDescription: "Page content and translations", accessLevel: "Read/Write" },
      { scopeName: "localization.languages", scopeDescription: "Supported language list", accessLevel: "Read" },
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s1", name: "GEMINI_API_KEY", description: "Google Gemini for AI translations", type: "Preset", status: "Active", createdAt: "2025-11-15", lastRotatedAt: "2026-01-10" },
      { id: "s2", name: "SLACK_WEBHOOK_URL", description: "Slack notifications", type: "Preset", status: "Active", createdAt: "2025-11-15", lastRotatedAt: null },
    ],
    auditLog: [
      { action: "App Created", actor: "Sarah Chen", details: "Initial app request submitted", timestamp: "2025-11-15T10:30:00Z" },
      { action: "Repo Provisioned", actor: "System", details: "GitHub repo bill-internal/ai-localization created", timestamp: "2025-11-15T10:31:00Z" },
      { action: "Submitted for Review", actor: "Sarah Chen", details: "v1.0 submitted for security review", timestamp: "2025-12-01T14:00:00Z" },
      { action: "AI Scan Complete", actor: "System", details: "Score: 94/100 (Low Risk)", timestamp: "2025-12-01T14:02:00Z" },
      { action: "Approved", actor: "Priya Patel", details: "Approved -- clean scan, well-scoped permissions", timestamp: "2025-12-02T09:15:00Z" },
      { action: "Deployed", actor: "System", details: "Deployed to apps.bill.com/ai-localization", timestamp: "2025-12-02T09:20:00Z" },
      { action: "Update Deployed", actor: "Sarah Chen", details: "v1.3 -- added batch translation support", timestamp: "2026-01-28T16:00:00Z" },
    ],
    scanReport: null,
  },
  {
    id: "app-2",
    name: "Bank Widget Template Manager",
    slug: "widget-templates",
    description: "Visual editor for managing and updating bank widget templates across all partner integrations.",
    purpose: "Eliminate the manual JSON editing and deployment process for bank widget templates that currently requires engineer involvement.",
    targetUsers: "Product team, Partner team",
    team: "Product",
    category: "Dashboard",
    status: "Deployed",
    repoUrl: "https://github.com/bill-internal/widget-templates",
    repoName: "widget-templates",
    templateType: "React Dashboard",
    internalUrl: "apps.bill.com/widget-templates",
    oktaProvisioned: true,
    scanScore: 91,
    riskLevel: "Low",
    builder: mockUsers[1],
    activeUsers: 12,
    lastDeploy: "2026-01-20",
    createdAt: "2025-10-05",
    updatedAt: "2026-01-20",
    dataScopes: [
      { scopeName: "content.templates", scopeDescription: "Widget templates", accessLevel: "Read/Write" },
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s3", name: "DATABASE_URL", description: "Template database connection", type: "Preset", status: "Active", createdAt: "2025-10-05", lastRotatedAt: "2025-12-15" },
    ],
    auditLog: [
      { action: "App Created", actor: "Marcus Johnson", details: "Initial app request", timestamp: "2025-10-05T11:00:00Z" },
      { action: "Approved", actor: "Priya Patel", details: "Approved", timestamp: "2025-10-20T10:00:00Z" },
      { action: "Deployed", actor: "System", details: "Deployed to production", timestamp: "2025-10-20T10:05:00Z" },
    ],
    scanReport: null,
  },
  {
    id: "app-3",
    name: "Expense Report Automator",
    slug: "expense-automator",
    description: "Automates expense report creation by scanning receipts with AI and pre-filling expense forms with categorization.",
    purpose: "Reduce time spent on expense reports from 30 minutes to 5 minutes per report. Eliminate manual data entry errors.",
    targetUsers: "All employees",
    team: "Finance",
    category: "Automation",
    status: "In Review",
    repoUrl: "https://github.com/bill-internal/expense-automator",
    repoName: "expense-automator",
    templateType: "React Dashboard",
    internalUrl: "apps.bill.com/expense-automator",
    oktaProvisioned: false,
    scanScore: 72,
    riskLevel: "Medium",
    builder: mockUsers[4],
    activeUsers: 0,
    lastDeploy: null,
    createdAt: "2026-01-10",
    updatedAt: "2026-02-01",
    dataScopes: [
      { scopeName: "billing.invoices", scopeDescription: "Customer billing records", accessLevel: "Read" },
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
      { scopeName: "users.email", scopeDescription: "Employee email addresses", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s4", name: "GEMINI_API_KEY", description: "Google Gemini for receipt scanning", type: "Preset", status: "Active", createdAt: "2026-01-10", lastRotatedAt: null },
      { id: "s5", name: "STRIPE_SECRET_KEY", description: "Stripe for payment verification", type: "Preset", status: "Active", createdAt: "2026-01-10", lastRotatedAt: null },
      { id: "s6", name: "SLACK_WEBHOOK_URL", description: "Slack notifications", type: "Preset", status: "Active", createdAt: "2026-01-10", lastRotatedAt: null },
    ],
    auditLog: [
      { action: "App Created", actor: "Alex Rivera", details: "Initial request submitted", timestamp: "2026-01-10T09:00:00Z" },
      { action: "Repo Provisioned", actor: "System", details: "GitHub repo created", timestamp: "2026-01-10T09:01:00Z" },
      { action: "Submitted for Review", actor: "Alex Rivera", details: "v1.0 submitted", timestamp: "2026-02-01T11:00:00Z" },
      { action: "AI Scan Complete", actor: "System", details: "Score: 72/100 (Medium Risk) -- 6 findings", timestamp: "2026-02-01T11:03:00Z" },
    ],
    scanReport: scanReportExpense,
  },
  {
    id: "app-4",
    name: "Slack Standup Bot",
    slug: "standup-bot",
    description: "Automated daily standup collection via Slack with team dashboards and trend reporting.",
    purpose: "Replace synchronous standup meetings with async updates. Save 15 minutes per person per day.",
    targetUsers: "Engineering team",
    team: "Engineering",
    category: "Bot",
    status: "Deployed",
    repoUrl: "https://github.com/bill-internal/standup-bot",
    repoName: "standup-bot",
    templateType: "Slack Bot",
    internalUrl: "apps.bill.com/standup-bot",
    oktaProvisioned: true,
    scanScore: 96,
    riskLevel: "Low",
    builder: mockUsers[0],
    activeUsers: 45,
    lastDeploy: "2026-01-15",
    createdAt: "2025-09-01",
    updatedAt: "2026-01-15",
    dataScopes: [
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s7", name: "SLACK_WEBHOOK_URL", description: "Slack Bot token", type: "Preset", status: "Active", createdAt: "2025-09-01", lastRotatedAt: "2025-12-01" },
    ],
    auditLog: [
      { action: "App Created", actor: "Sarah Chen", details: "Initial request", timestamp: "2025-09-01T08:00:00Z" },
      { action: "Deployed", actor: "System", details: "Deployed to production", timestamp: "2025-09-15T10:00:00Z" },
    ],
    scanReport: null,
  },
  {
    id: "app-5",
    name: "Customer Feedback Analyzer",
    slug: "feedback-analyzer",
    description: "AI tool that aggregates and analyzes customer feedback from support tickets, NPS surveys, and social media.",
    purpose: "Provide real-time sentiment analysis and trending issue detection to improve product decisions.",
    targetUsers: "Support team, Product team",
    team: "Support",
    category: "Dashboard",
    status: "Draft",
    repoUrl: "",
    repoName: "feedback-analyzer",
    templateType: "React Dashboard",
    internalUrl: "apps.bill.com/feedback-analyzer",
    oktaProvisioned: false,
    scanScore: null,
    riskLevel: null,
    builder: mockUsers[5],
    activeUsers: 0,
    lastDeploy: null,
    createdAt: "2026-02-03",
    updatedAt: "2026-02-03",
    dataScopes: [
      { scopeName: "support.tickets", scopeDescription: "Customer support tickets", accessLevel: "Read" },
      { scopeName: "analytics.events", scopeDescription: "Product analytics", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s8", name: "GEMINI_API_KEY", description: "Gemini for sentiment analysis", type: "Preset", status: "Active", createdAt: "2026-02-03", lastRotatedAt: null },
    ],
    auditLog: [
      { action: "App Created", actor: "Jordan Lee", details: "Draft created", timestamp: "2026-02-03T15:00:00Z" },
    ],
    scanReport: null,
  },
  {
    id: "app-6",
    name: "Internal Knowledge Search",
    slug: "knowledge-search",
    description: "Semantic search across all internal documentation, Confluence pages, and Slack history using RAG.",
    purpose: "Make it easy to find answers to internal questions without asking around. Reduce repeated questions in Slack.",
    targetUsers: "All employees",
    team: "Engineering",
    category: "Other",
    status: "In Review",
    repoUrl: "https://github.com/bill-internal/knowledge-search",
    repoName: "knowledge-search",
    templateType: "React Dashboard",
    internalUrl: "apps.bill.com/knowledge-search",
    oktaProvisioned: false,
    scanScore: 88,
    riskLevel: "Low",
    builder: mockUsers[0],
    activeUsers: 0,
    lastDeploy: null,
    createdAt: "2026-01-05",
    updatedAt: "2026-02-04",
    dataScopes: [
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s9", name: "GEMINI_API_KEY", description: "Gemini for embeddings", type: "Preset", status: "Active", createdAt: "2026-01-05", lastRotatedAt: null },
      { id: "s10", name: "OPENAI_API_KEY", description: "OpenAI for search", type: "Preset", status: "Active", createdAt: "2026-01-05", lastRotatedAt: null },
    ],
    auditLog: [
      { action: "App Created", actor: "Sarah Chen", details: "Initial request", timestamp: "2026-01-05T10:00:00Z" },
      { action: "Submitted for Review", actor: "Sarah Chen", details: "v1.0 submitted", timestamp: "2026-02-04T09:00:00Z" },
      { action: "AI Scan Complete", actor: "System", details: "Score: 88/100 (Low Risk)", timestamp: "2026-02-04T09:03:00Z" },
    ],
    scanReport: scanReportKnowledge,
  },
  {
    id: "app-7",
    name: "PTO Calendar Sync",
    slug: "pto-sync",
    description: "Syncs PTO requests from BambooHR to team Google Calendars automatically.",
    purpose: "Eliminate the manual process of checking who's out. Automatically block calendars for approved PTO.",
    targetUsers: "All employees",
    team: "HR",
    category: "Automation",
    status: "Deprecated",
    repoUrl: "https://github.com/bill-internal/pto-sync",
    repoName: "pto-sync",
    templateType: "Data Pipeline",
    internalUrl: "apps.bill.com/pto-sync",
    oktaProvisioned: true,
    scanScore: 78,
    riskLevel: "Medium",
    builder: mockUsers[1],
    activeUsers: 8,
    lastDeploy: "2025-08-10",
    createdAt: "2025-05-01",
    updatedAt: "2025-08-10",
    dataScopes: [
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
      { scopeName: "users.email", scopeDescription: "Employee emails", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s11", name: "AWS_ACCESS_KEY_ID", description: "AWS Lambda access", type: "Preset", status: "Active", createdAt: "2025-05-01", lastRotatedAt: "2025-07-01" },
    ],
    auditLog: [
      { action: "App Created", actor: "Marcus Johnson", details: "Initial request", timestamp: "2025-05-01T10:00:00Z" },
      { action: "Deployed", actor: "System", details: "Deployed", timestamp: "2025-05-20T10:00:00Z" },
      { action: "Deprecated", actor: "Marcus Johnson", details: "Replaced by native BambooHR integration", timestamp: "2025-12-01T10:00:00Z" },
    ],
    scanReport: null,
  },
  {
    id: "app-8",
    name: "Release Notes Generator",
    slug: "release-notes",
    description: "Automatically generates release notes from Jira tickets and GitHub PRs with AI-powered summarization.",
    purpose: "Replace the manual process of compiling release notes. Generate customer-facing and internal versions automatically.",
    targetUsers: "Engineering team, Product team",
    team: "Engineering",
    category: "Automation",
    status: "Deployed",
    repoUrl: "https://github.com/bill-internal/release-notes",
    repoName: "release-notes",
    templateType: "React Dashboard",
    internalUrl: "apps.bill.com/release-notes",
    oktaProvisioned: true,
    scanScore: 97,
    riskLevel: "Low",
    builder: mockUsers[3],
    activeUsers: 31,
    lastDeploy: "2026-02-01",
    createdAt: "2025-07-15",
    updatedAt: "2026-02-01",
    dataScopes: [
      { scopeName: "users.directory", scopeDescription: "Employee directory", accessLevel: "Read" },
    ],
    secrets: [
      { id: "s12", name: "GEMINI_API_KEY", description: "Gemini for summarization", type: "Preset", status: "Active", createdAt: "2025-07-15", lastRotatedAt: "2025-12-15" },
      { id: "s13", name: "SLACK_WEBHOOK_URL", description: "Release notifications", type: "Preset", status: "Active", createdAt: "2025-07-15", lastRotatedAt: null },
    ],
    auditLog: [
      { action: "App Created", actor: "David Kim", details: "Initial request", timestamp: "2025-07-15T10:00:00Z" },
      { action: "Deployed", actor: "System", details: "Deployed", timestamp: "2025-08-01T10:00:00Z" },
    ],
    scanReport: null,
  },
];

export function getAppById(id: string): AppData | undefined {
  return mockApps.find((app) => app.id === id);
}

export function getAppsByStatus(status: AppData["status"]): AppData[] {
  return mockApps.filter((app) => app.status === status);
}

export function getAppsInReview(): AppData[] {
  return mockApps.filter((app) => app.status === "In Review" || app.status === "Submitted");
}

export function getAppsByBuilder(userId: string): AppData[] {
  return mockApps.filter((app) => app.builder.id === userId);
}
