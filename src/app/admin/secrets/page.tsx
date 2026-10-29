"use client";

import { useState } from "react";
import { mockApps } from "@/lib/mock-data";
import { Key, RefreshCw, XCircle, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminSecretsPage() {
  const allSecrets = mockApps.flatMap((app) =>
    app.secrets.map((s) => ({ ...s, appName: app.name, appId: app.id }))
  );

  const needsRotation = allSecrets.filter((s) => {
    if (!s.lastRotatedAt) return true;
    const daysSince = Math.floor((Date.now() - new Date(s.lastRotatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 90;
  });

  const [rotated, setRotated] = useState<Set<string>>(new Set());
  const [revoked, setRevoked] = useState<Set<string>>(new Set());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Secrets Management</h1>
        <p className="text-muted-foreground mt-1">Global view of all secrets across internal apps</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-foreground">{allSecrets.length}</div>
          <div className="text-sm text-muted-foreground">Total Secrets</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-yellow-600">{needsRotation.length}</div>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-sm text-muted-foreground">Needs Rotation (&gt;90 days)</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-red-600">{revoked.size}</div>
          <div className="text-sm text-muted-foreground">Revoked</div>
        </div>
      </div>

      {/* Secrets Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-3 bg-muted/50 border-b border-border">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-3">Secret</div>
            <div className="col-span-2">App</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-2">Last Rotated</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>
        {allSecrets.map((secret) => {
          const isRevoked = revoked.has(secret.id);
          const isRotated = rotated.has(secret.id);
          const daysSinceRotation = secret.lastRotatedAt
            ? Math.floor((Date.now() - new Date(secret.lastRotatedAt).getTime()) / (1000 * 60 * 60 * 24))
            : null;
          const stale = daysSinceRotation !== null && daysSinceRotation > 90;

          return (
            <div key={secret.id} className={`px-6 py-3 border-b border-border ${isRevoked ? "opacity-50 bg-red-50" : ""}`}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium text-foreground">{secret.name}</span>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{secret.appName}</div>
                <div className="col-span-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{secret.type}</span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{secret.createdAt}</div>
                <div className="col-span-2">
                  {isRotated ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Just rotated
                    </span>
                  ) : secret.lastRotatedAt ? (
                    <span className={`flex items-center gap-1 text-xs ${stale ? "text-yellow-600" : "text-muted-foreground"}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {secret.lastRotatedAt}
                      {stale && <AlertTriangle className="w-3 h-3" />}
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Never rotated
                    </span>
                  )}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  {!isRevoked && (
                    <>
                      <button
                        onClick={() => setRotated((prev) => new Set(prev).add(secret.id))}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                        title="Rotate"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rotate
                      </button>
                      <button
                        onClick={() => setRevoked((prev) => new Set(prev).add(secret.id))}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                        title="Revoke"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Revoke
                      </button>
                    </>
                  )}
                  {isRevoked && (
                    <span className="text-xs text-red-500 font-medium">Revoked</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
