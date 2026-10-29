"use client";

import Link from "next/link";
import { getAppsInReview } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";
import { Shield, Clock, ChevronRight } from "lucide-react";

export default function ReviewQueuePage() {
  const appsInReview = getAppsInReview();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
        <p className="text-muted-foreground mt-1">Apps awaiting Infosec review and approval</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-yellow-600">{appsInReview.length}</div>
          <div className="text-sm text-muted-foreground">Pending Review</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-foreground">1.5 days</div>
          <div className="text-sm text-muted-foreground">Avg Review Time</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-muted-foreground">Reviewed This Month</div>
        </div>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-3 bg-muted/50 border-b border-border">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">App</div>
            <div className="col-span-2">Builder</div>
            <div className="col-span-2">Team</div>
            <div className="col-span-1">Score</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        {appsInReview.map((app) => (
          <Link
            key={app.id}
            href={`/review/${app.id}`}
            className="block px-6 py-4 border-b border-border hover:bg-muted/30 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <div className="font-medium text-foreground">{app.name}</div>
                <div className="text-xs text-muted-foreground">{app.category}</div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-semibold">
                    {app.builder.avatar}
                  </div>
                  <span className="text-sm text-foreground">{app.builder.name}</span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">{app.team}</span>
              </div>
              <div className="col-span-1">
                {app.scanScore && (
                  <span className={`text-sm font-semibold ${
                    app.scanScore >= 80 ? "text-green-600" : app.scanScore >= 60 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {app.scanScore}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {app.updatedAt}
                </div>
                {app.riskLevel && <RiskBadge level={app.riskLevel} />}
              </div>
              <div className="col-span-1 text-right">
                <ChevronRight className="w-4 h-4 text-muted-foreground inline" />
              </div>
            </div>
          </Link>
        ))}
        {appsInReview.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No apps pending review</p>
          </div>
        )}
      </div>
    </div>
  );
}
