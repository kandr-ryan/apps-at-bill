"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, LayoutGrid, PlusCircle, Shield, Settings, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Catalog", icon: LayoutGrid },
  { href: "/my-apps", label: "My Apps", icon: Box },
  { href: "/new", label: "New App", icon: PlusCircle },
  { href: "/review", label: "Review Queue", icon: Shield },
  { href: "/admin/users", label: "Admin", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">Apps@Bill</span>
          </Link>

          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                SC
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">Sarah Chen</div>
                <div className="text-xs text-muted-foreground">Engineering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
