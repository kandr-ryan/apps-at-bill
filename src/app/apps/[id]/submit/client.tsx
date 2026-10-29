"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAppById } from "@/lib/mock-data";
import { SeverityBadge, RiskBadge } from "@/components/status-badge";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { ScanReport, ScanCategory } from "@/lib/types";

const mockScanResult: ScanReport = {
  overallScore: 72,
  riskLevel: "Medium",
  categories: [
    {
      name: "Dependency Audit", score: 85,
      findings: [
        { severity: "Medium", category: "Dependency Audit", description: "lodash@4.17.20 has CVE-2021-23337 (prototype pollution)", file: "package.json", line: 12, recommendation: "Upgrade to lodash@4.17.21+" },
        { severity: "Medium", category: "Dependency Audit", description: "axios@0.21.1 has CVE-2021-3749 (ReDoS)", file: "package.json", line: 8, recommendation: "Upgrade to axios@0.21.2+" },
      ],
    },
    {
      name: "Secret Detection", score: 95,
      findings: [
        { severity: "Low", category: "Secret Detection", description: "Possible API key pattern in config file", file: "src/config.ts", line: 12, recommendation: "Verify this is not a production secret" },
      ],
    },
    {
      name: "Network Analysis", score: 60,
      findings: [
        { severity: "High", category: "Network Analysis", description: "Outbound call to api.exchangerate.io (not approved)", file: "src/utils/currency.ts", line: 47, recommendation: "Use internal forex proxy" },
      ],
    },
    {
      name: "Data Handling", score: 70,
      findings: [
        { severity: "Medium", category: "Data Handling", description: "console.log includes user.email (PII)", file: "src/pages/submit.tsx", line: 89, recommendation: "Use logging SDK mask()" },
      ],
    },
    {
      name: "Permission Scope", score: 50,
      findings: [
        { severity: "High", category: "Permission Scope", description: "Accesses billing.subscriptions (not in approved scope)", file: "src/api/billing.ts", line: 23, recommendation: "Request additional scope or remove" },
      ],
    },
  ],
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : score >= 40 ? "text-orange-500" : "text-red-500";
  return (
    <div className={`text-5xl font-bold ${color}`}>
      {score}
      <span className="text-lg text-muted-foreground">/100</span>
    </div>
  );
}

function CategoryCard({ category }: { category: ScanCategory }) {
  const [expanded, setExpanded] = useState(false);
  const barColor = category.score >= 80 ? "bg-green-500" : category.score >= 60 ? "bg-yellow-500" : category.score >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="font-medium text-foreground">{category.name}</div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{category.score}/100</span>
          <span className="text-xs text-muted-foreground">({category.findings.length} findings)</span>
        </div>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${category.score}%` }} />
      </div>
      {(expanded || category.findings.some(f => f.severity === "High" || f.severity === "Critical")) && (
        <div className="space-y-2 mt-3">
          {category.findings.map((finding, i) => (
            <div key={i} className="flex items-start gap-2 text-sm p-2 bg-muted/50 rounded">
              <SeverityBadge severity={finding.severity} />
              <div className="flex-1">
                <div className="text-foreground">{finding.description}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {finding.file}{finding.line && `:${finding.line}`}
                </div>
                <div className="text-xs text-primary mt-0.5">Fix: {finding.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubmitClient({ id }: { id: string }) {
  const app = getAppById(id);
  const [scanning, setScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const scanCategories = ["Dependency Audit", "Secret Detection", "Network Analysis", "Data Handling", "Permission Scope"];

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanCategories.length - 1) {
          setTimeout(() => setScanning(false), 800);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [scanning, scanCategories.length]);

  if (!app) return <div>App not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/apps/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to {app.name}
      </Link>

      {scanning ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-foreground mb-2">Scanning {app.name}...</h2>
          <p className="text-muted-foreground mb-6">Running security analysis across 5 categories</p>
          <div className="space-y-3 max-w-sm mx-auto text-left">
            {scanCategories.map((cat, i) => (
              <div key={cat} className="flex items-center gap-3 text-sm">
                {i < scanStep ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : i === scanStep ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border" />
                )}
                <span className={i <= scanStep ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {cat}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Scan Complete</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockScanResult.overallScore >= 80
                    ? "Your app has been submitted for Infosec review."
                    : "Your app has issues that should be addressed."}
                </p>
              </div>
              <RiskBadge level={mockScanResult.riskLevel} />
            </div>
            <div className="flex items-center gap-6 mb-6">
              <ScoreRing score={mockScanResult.overallScore} />
              <div className="flex-1">
                {mockScanResult.overallScore < 80 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span>6 findings need attention before Infosec review</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {mockScanResult.categories.map((cat) => (
                <CategoryCard key={cat.name} category={cat} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href={`/apps/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
              Back to App Detail
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={`/apps/${id}`}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted"
              >
                Fix & Resubmit
              </Link>
              <Link
                href="/review"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> View Review Queue
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
