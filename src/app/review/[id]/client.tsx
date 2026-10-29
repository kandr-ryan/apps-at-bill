"use client";

import { useState } from "react";
import Link from "next/link";
import { getAppById } from "@/lib/mock-data";
import { RiskBadge, SeverityBadge } from "@/components/status-badge";
import { ArrowLeft, Shield, ExternalLink, Check, X, MessageSquare, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-foreground font-medium">{label}</span>
        <span className="font-semibold">{score}/100</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function ReviewDetailClient({ id }: { id: string }) {
  const app = getAppById(id);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showChangesDialog, setShowChangesDialog] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Network Analysis", "Permission Scope"]));
  const [approved, setApproved] = useState(false);

  if (!app || !app.scanReport) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-foreground">No scan report available</h2>
        <Link href="/review" className="text-primary text-sm mt-2 inline-block">Back to Review Queue</Link>
      </div>
    );
  }

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const report = app.scanReport;

  if (approved) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">App Approved</h2>
        <p className="text-muted-foreground mb-6">
          <strong>{app.name}</strong> has been approved and will be deployed to {app.internalUrl}
        </p>
        <Link href="/review" className="text-primary font-medium hover:underline">
          Back to Review Queue
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/review" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Review Queue
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Security Review</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Scan Report (2/3) */}
        <div className="col-span-2 space-y-4">
          {/* Score Header */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall Security Score</div>
                <div className={`text-4xl font-bold ${
                  report.overallScore >= 80 ? "text-green-500" : report.overallScore >= 60 ? "text-yellow-500" : "text-orange-500"
                }`}>
                  {report.overallScore}<span className="text-lg text-muted-foreground">/100</span>
                </div>
              </div>
              <RiskBadge level={report.riskLevel} />
            </div>
            <div className="space-y-3">
              {report.categories.map((cat) => (
                <ScoreBar key={cat.name} score={cat.score} label={cat.name} />
              ))}
            </div>
          </div>

          {/* Category Details */}
          {report.categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    cat.score >= 80 ? "bg-green-100 text-green-700" : cat.score >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {cat.score}/100
                  </span>
                  {cat.findings.length > 0 && (
                    <span className="text-xs text-muted-foreground">{cat.findings.length} finding{cat.findings.length !== 1 ? "s" : ""}</span>
                  )}
                </div>
                {expandedCategories.has(cat.name) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedCategories.has(cat.name) && cat.findings.length > 0 && (
                <div className="border-t border-border p-4 space-y-3">
                  {cat.findings.map((finding, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <SeverityBadge severity={finding.severity} />
                      <div className="flex-1">
                        <div className="text-sm text-foreground">{finding.description}</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono">
                          {finding.file}{finding.line && `:${finding.line}`}
                        </div>
                        <div className="text-xs text-primary mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {finding.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {expandedCategories.has(cat.name) && cat.findings.length === 0 && (
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" /> No issues found
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: App Info + Actions (1/3) */}
        <div className="space-y-4">
          {/* App Info */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">App Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{app.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Builder</dt>
                <dd className="font-medium flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[9px] font-semibold">
                    {app.builder.avatar}
                  </div>
                  {app.builder.name}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Team</dt>
                <dd className="font-medium">{app.team}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{app.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Description</dt>
                <dd className="text-foreground text-xs">{app.description}</dd>
              </div>
            </dl>
          </div>

          {/* Data Scopes */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Requested Data Scopes</h3>
            <div className="space-y-2">
              {app.dataScopes.map((scope) => (
                <div key={scope.scopeName} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-foreground">{scope.scopeName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    scope.accessLevel === "Read/Write" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {scope.accessLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Secrets */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Requested Secrets</h3>
            <div className="space-y-1">
              {app.secrets.map((s) => (
                <div key={s.id} className="text-xs font-mono text-foreground py-1">{s.name}</div>
              ))}
            </div>
          </div>

          {/* Repo */}
          {app.repoUrl && (
            <a
              href={app.repoUrl}
              className="flex items-center justify-center gap-2 text-sm font-medium text-primary bg-white rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Source Code
            </a>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-2 sticky top-24">
            <h3 className="font-semibold text-foreground mb-3">Review Actions</h3>
            <button
              onClick={() => setApproved(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => setShowChangesDialog(!showChangesDialog)}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Request Changes
            </button>
            <button
              onClick={() => setShowRejectDialog(!showRejectDialog)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" /> Reject
            </button>
            {(showChangesDialog || showRejectDialog) && (
              <div className="mt-3">
                <textarea
                  placeholder={showChangesDialog ? "Describe the changes needed..." : "Reason for rejection..."}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="mt-2 w-full bg-foreground text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90">
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
