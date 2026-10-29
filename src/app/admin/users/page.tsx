"use client";

import { useState } from "react";
import { mockApps, mockUsers } from "@/lib/mock-data";
import { Users, ChevronDown, ChevronUp, Plus, Trash2, Shield } from "lucide-react";

const deployedApps = mockApps.filter((a) => a.status === "Deployed");

const mockAccess: Record<string, { users: string[]; groups: string[] }> = {
  "app-1": { users: ["sarah.chen@bill.com", "marcus.johnson@bill.com"], groups: ["Engineering", "Marketing"] },
  "app-2": { users: ["marcus.johnson@bill.com"], groups: ["Product", "Partner"] },
  "app-4": { users: [], groups: ["Engineering"] },
  "app-8": { users: ["david.kim@bill.com"], groups: ["Engineering", "Product"] },
};

export default function AdminUsersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Access Management</h1>
          <p className="text-muted-foreground mt-1">Manage Okta tile assignments and user access per app</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-3 bg-muted/50 border-b border-border">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">App</div>
            <div className="col-span-2">Team</div>
            <div className="col-span-2">Access Type</div>
            <div className="col-span-2">Users / Groups</div>
            <div className="col-span-2"></div>
          </div>
        </div>
        {deployedApps.map((app) => {
          const access = mockAccess[app.id] || { users: [], groups: [] };
          const isExpanded = expanded === app.id;
          return (
            <div key={app.id} className="border-b border-border">
              <button
                onClick={() => setExpanded(isExpanded ? null : app.id)}
                className="w-full px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center text-left">
                  <div className="col-span-4">
                    <div className="font-medium text-foreground">{app.name}</div>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">{app.team}</div>
                  <div className="col-span-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {access.groups.length > 2 ? "Company-Wide" : "Team"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {access.users.length + access.groups.length} assigned
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    {isExpanded ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-6 pb-4 bg-muted/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Users</h4>
                      <div className="space-y-1">
                        {access.users.map((email) => (
                          <div key={email} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-border">
                            <span>{email}</span>
                            <button className="text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
                        >
                          <Plus className="w-3 h-3" /> Add User
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Okta Groups</h4>
                      <div className="space-y-1">
                        {access.groups.map((group) => (
                          <div key={group} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-border">
                            <span className="flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-muted-foreground" /> {group}
                            </span>
                            <button className="text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline">
                          <Plus className="w-3 h-3" /> Add Group
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
