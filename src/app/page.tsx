"use client";

import { useState } from "react";
import Link from "next/link";
import { mockApps } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Search, Plus, Users, Calendar, ArrowRight } from "lucide-react";
import { Team, AppStatus } from "@/lib/types";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<Team | "All">("All");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "All">("All");

  const filtered = mockApps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = teamFilter === "All" || app.team === teamFilter;
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const teams: (Team | "All")[] = ["All", "Engineering", "Product", "Finance", "HR", "Support", "Company-Wide"];
  const statuses: (AppStatus | "All")[] = ["All", "Deployed", "In Review", "Draft", "Deprecated"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">App Catalog</h1>
          <p className="text-muted-foreground mt-1">Browse internal tools built by teams at Bill</p>
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
          { label: "Total Apps", value: mockApps.length, color: "text-foreground" },
          { label: "Deployed", value: mockApps.filter(a => a.status === "Deployed").length, color: "text-green-600" },
          { label: "In Review", value: mockApps.filter(a => a.status === "In Review").length, color: "text-yellow-600" },
          { label: "Active Users", value: mockApps.reduce((sum, a) => sum + a.activeUsers, 0), color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value as Team | "All")}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {teams.map((t) => <option key={t} value={t}>{t === "All" ? "All Teams" : t}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AppStatus | "All")}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((app) => (
          <Link
            key={app.id}
            href={`/apps/${app.id}`}
            className="bg-white rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {app.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{app.team}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{app.category}</span>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {app.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
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
              <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-primary transition-all" />
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-semibold">
                {app.builder.avatar}
              </div>
              <span className="text-xs text-muted-foreground">{app.builder.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
