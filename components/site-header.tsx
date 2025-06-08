"use client";

import Link from "next/link";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";

export function SiteHeader({ className }: { className?: string }) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Schema Analysis", href: "/schema-analysis" },
    { label: "Pricing", href: "/pricing" },
    { label: "Documentation", href: "/docs" },
  ];

  return (
    <header className={cn("z-50", className)}>
      <nav className="container flex h-16 items-center justify-between p-6">
        {" "}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative ml-8">
            <div className="absolute -inset-0.5 rounded-lg  opacity-20 blur transition-opacity group-hover:opacity-20" />
              <img
                src="/pandaview.png"
                alt="PandaView Logo"
                className="h-10 w-10"
              />
          </div>
          <span className="font-semibold text-lg">
            <span className="text-white">Panda</span>
            <span className="text-emerald-400">View</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1 ml-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800/50"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/live" className="ml-2 relative group">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 opacity-20 blur group-hover:opacity-40 transition-opacity" />
            <div className="relative px-3 py-2 bg-slate-900 rounded-md border border-slate-800 text-sm font-medium text-white">
              Try Live Demo
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
