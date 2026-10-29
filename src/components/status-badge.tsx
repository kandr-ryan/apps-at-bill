import { AppStatus, RiskLevel, Severity } from "@/lib/types";

const statusColors: Record<AppStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Submitted: "bg-blue-100 text-blue-700",
  "In Review": "bg-yellow-100 text-yellow-700",
  "Changes Requested": "bg-orange-100 text-orange-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Deployed: "bg-green-100 text-green-700",
  Deprecated: "bg-red-100 text-red-700",
  Archived: "bg-gray-100 text-gray-500",
};

export function StatusBadge({ status }: { status: AppStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
}

const riskColors: Record<RiskLevel, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColors[level]}`}>
      {level} Risk
    </span>
  );
}

const severityColors: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-blue-100 text-blue-700 border-blue-200",
  Info: "bg-gray-100 text-gray-600 border-gray-200",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${severityColors[severity]}`}>
      {severity}
    </span>
  );
}
