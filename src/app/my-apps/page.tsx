"use client";

import Link from "next/link";
import { mockApps, currentUser } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Users, Calendar, ArrowRight, Eye, Send } from "lucide-react";

export default function MyAppsPage() {
  const myApps = mockApps.filter((app) => app.builder.id === currentUser.id);

  const stats = {
    total: myApps.length,
    deployed: myApps.filter((a) => a.status === "Deployed").length,
    inReview: myApps.filter((a) => a.status === "In Review").length,
    draft: myApps.filter((a) => a.status === "Draft").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Apps</h1>
          <p className="text-muted-foreground mt-1">Apps you&apos;ve created and submitted</p>
        </div>
        <Link
          href="/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New App
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "Deployed", value: stats.deployed },
          { label: "In Review", value: stats.inReview },
          { label: "Draft", value: stats.draft },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* App Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myApps.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-xl border border-border p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{app.name}</h3>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {app.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              {app.activeUsers > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {app.activeUsers} users
                </span>
              )}
              {app.lastDeploy && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {app.lastDeploy}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <Link
                href={`/apps/${app.id}`}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </Link>
              {app.status === "Draft" && (
                <Link
                  href={`/apps/${app.id}/submit`}
                  className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 ml-auto"
                >
                  <Send className="w-3.5 h-3.5" /> Submit for Review
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
