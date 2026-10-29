"use client";

import { useState } from "react";
import Link from "next/link";
import { getAppById } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";
import {
  ArrowLeft, ExternalLink, Copy, Check, GitBranch, Globe, Shield,
  Key, Activity, Clock, Send, Eye, EyeOff, RefreshCw, ChevronRight,
  CircleCheck, CircleDot, Circle
} from "lucide-react";

export default function AppDetailClient({ id }: { id: string }) {
  const app = getAppById(id);
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());

  if (!app) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-foreground">App not found</h2>
        <Link href="/" className="text-primary text-sm mt-2 inline-block">Back to Catalog</Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`git clone ${app.repoUrl}.git\ncd ${app.repoName}\nnpm install\nnpm run dev`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReveal = (secretId: string) => {
    setRevealedSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(secretId)) next.delete(secretId);
      else next.add(secretId);
      return next;
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "infrastructure", label: "Infrastructure", icon: GitBranch },
    { id: "data", label: "Data Access", icon: Shield },
    { id: "secrets", label: "Secrets", icon: Key },
    { id: "pipeline", label: "Pipeline", icon: ChevronRight },
    { id: "activity", label: "Activity", icon: Clock },
  ];

  const pipelineStages = [
    { name: "Build", status: app.status === "Deployed" ? "complete" : app.status === "In Review" ? "complete" : "pending" },
    { name: "Scan", status: app.status === "Deployed" ? "complete" : app.status === "In Review" ? "complete" : "pending" },
    { name: "Review Gate", status: app.status === "Deployed" ? "complete" : app.status === "In Review" ? "active" : "pending" },
    { name: "Deploy", status: app.status === "Deployed" ? "complete" : "pending" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{app.name}</h1>
              <StatusBadge status={app.status} />
              {app.riskLevel && <RiskBadge level={app.riskLevel} />}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{app.team}</span>
              <span>·</span>
              <span>{app.category}</span>
              <span>·</span>
              <span>Built by {app.builder.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {app.status === "Draft" && (
              <Link
                href={`/apps/${app.id}/submit`}
                className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                <Send className="w-4 h-4" /> Submit for Review
              </Link>
            )}
            {app.status === "Deployed" && (
              <a
                href={`https://${app.internalUrl}`}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                <ExternalLink className="w-4 h-4" /> View Live App
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-border p-6">
        {tab === "overview" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h3>
              <p className="text-foreground">{app.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Problem Statement</h3>
              <p className="text-foreground">{app.purpose}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-sm text-muted-foreground">Target Users</div>
                <div className="font-medium">{app.targetUsers}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <div className="font-medium">{app.activeUsers}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">{app.createdAt}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "infrastructure" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">GitHub Repository</div>
                <a href={app.repoUrl} className="text-primary font-medium hover:underline flex items-center gap-1">
                  <GitBranch className="w-4 h-4" /> {app.repoName}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Internal URL</div>
                <div className="flex items-center gap-1 font-medium">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {app.internalUrl}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Template</div>
                <div className="font-medium">{app.templateType}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Okta Provisioned</div>
                <div className="font-medium">{app.oktaProvisioned ? "Yes" : "No"}</div>
              </div>
            </div>
            {app.repoUrl && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Clone Command</div>
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <button onClick={handleCopy} className="absolute top-3 right-3 text-gray-400 hover:text-white">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <code className="text-sm text-green-400">
                    git clone {app.repoUrl}.git
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "data" && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Approved Data Scopes</h3>
            {app.dataScopes.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data scopes requested</p>
            ) : (
              <div className="space-y-2">
                {app.dataScopes.map((scope) => (
                  <div key={scope.scopeName} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium font-mono text-foreground">{scope.scopeName}</div>
                      <div className="text-xs text-muted-foreground">{scope.scopeDescription}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      scope.accessLevel === "Read/Write" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {scope.accessLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "secrets" && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Provisioned Secrets</h3>
            <div className="space-y-2">
              {app.secrets.map((secret) => (
                <div key={secret.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium font-mono text-foreground">{secret.name}</div>
                      <div className="text-xs text-muted-foreground">{secret.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {revealedSecrets.has(secret.id) ? "sk_live_abc123..." : "••••••••••••"}
                    </code>
                    <button onClick={() => toggleReveal(secret.id)} className="text-muted-foreground hover:text-foreground">
                      {revealedSecrets.has(secret.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="text-muted-foreground hover:text-foreground" title="Rotate">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "pipeline" && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">CI/CD Pipeline</h3>
            <div className="flex items-center gap-4">
              {pipelineStages.map((stage, i) => (
                <div key={stage.name} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stage.status === "complete" ? "bg-green-100" :
                      stage.status === "active" ? "bg-yellow-100" : "bg-muted"
                    }`}>
                      {stage.status === "complete" ? <CircleCheck className="w-5 h-5 text-green-600" /> :
                       stage.status === "active" ? <CircleDot className="w-5 h-5 text-yellow-600" /> :
                       <Circle className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div className="text-xs font-medium mt-1 text-foreground">{stage.name}</div>
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className={`w-16 h-0.5 mb-5 ${
                      stage.status === "complete" ? "bg-green-300" : "bg-border"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            {app.scanScore && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Last Scan Score</div>
                <div className="text-2xl font-bold text-foreground">{app.scanScore}/100</div>
              </div>
            )}
          </div>
        )}

        {tab === "activity" && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Audit Trail</h3>
            <div className="space-y-0">
              {app.auditLog.map((entry, i) => (
                <div key={i} className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                    {i < app.auditLog.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-medium text-foreground">{entry.action}</div>
                    <div className="text-xs text-muted-foreground">{entry.details}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {entry.actor} · {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
