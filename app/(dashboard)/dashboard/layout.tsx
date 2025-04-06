"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Settings, Shield, Activity, Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: Users, label: "Team" },
    { href: "/dashboard/general", icon: Settings, label: "General" },
    { href: "/dashboard/activity", icon: Activity, label: "Activity" },
    { href: "/dashboard/security", icon: Shield, label: "Security" },
  ];

  return (
    <div className="flex min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full bg-slate-950">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-slate-950/80 border-b border-slate-800/50 backdrop-blur-xl p-4">
        <div className="flex items-center">
          <Button
            size="icon"
            className="mr-2 hover:bg-slate-800/50"
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5 text-gray-200" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <span className="font-medium text-gray-200">Settings</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/80 border-r border-slate-800/50 backdrop-blur-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 flex flex-col gap-1 p-4 pt-20 lg:pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`shadow-none my-1 w-full justify-start hover:bg-slate-800/50 ${
                    pathname === item.href
                      ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 pt-20 lg:pt-4">
        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {children}
      </main>
    </div>
  );
}
