export type AppStatus = "Draft" | "Submitted" | "In Review" | "Changes Requested" | "Approved" | "Deployed" | "Deprecated" | "Archived";
export type Team = "Engineering" | "Product" | "Finance" | "HR" | "Support" | "Company-Wide";
export type Category = "Dashboard" | "Automation" | "Bot" | "Extension" | "Pipeline" | "Other";
export type Role = "Builder" | "Reviewer" | "Admin";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

export interface AppData {
  id: string;
  name: string;
  slug: string;
  description: string;
  purpose: string;
  targetUsers: string;
  team: Team;
  category: Category;
  status: AppStatus;
  repoUrl: string;
  repoName: string;
  templateType: string;
  internalUrl: string;
  oktaProvisioned: boolean;
  scanScore: number | null;
  riskLevel: RiskLevel | null;
  builder: User;
  activeUsers: number;
  lastDeploy: string | null;
  createdAt: string;
  updatedAt: string;
  dataScopes: DataScope[];
  secrets: Secret[];
  auditLog: AuditEntry[];
  scanReport: ScanReport | null;
}

export interface DataScope {
  scopeName: string;
  scopeDescription: string;
  accessLevel: "Read" | "Read/Write";
}

export interface Secret {
  id: string;
  name: string;
  description: string;
  type: "Preset" | "Custom";
  status: "Active" | "Rotated" | "Revoked";
  createdAt: string;
  lastRotatedAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  team: Team;
  avatar: string;
}

export interface AuditEntry {
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

export interface ScanFinding {
  severity: Severity;
  category: string;
  description: string;
  file: string;
  line: number | null;
  recommendation: string;
}

export interface ScanCategory {
  name: string;
  score: number;
  findings: ScanFinding[];
}

export interface ScanReport {
  overallScore: number;
  riskLevel: RiskLevel;
  categories: ScanCategory[];
}
