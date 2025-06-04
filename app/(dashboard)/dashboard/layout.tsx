"use client";
import { useState } from "react";
import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Settings,
  Shield,
  Activity,
  Menu,
  PlusSquare,
  Bell,
  Database,
  Home,
  X,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navItems = [
    { href: "/dashboard", icon: Users, label: "Team", badge: null },
    {
      href: "/dashboard/general",
      icon: Settings,
      label: "General",
      badge: null,
    },
    {
      href: "/dashboard/activity",
      icon: Activity,
      label: "Activity",
      badge: "3",
    },
    {
      href: "/dashboard/security",
      icon: Shield,
      label: "Security",
      badge: null,
    },
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/dashboard/general":
        return "General Settings";
      case "/dashboard/activity":
        return "Activity Log";
      case "/dashboard/security":
        return "Security Settings";
      case "/dashboard/team":
        return "Team Management";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {" "}
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-300 hover:bg-slate-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                {" "}

                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 truncate">
                    {getPageTitle()}
                  </h1>
                  <div className="flex items-center text-xs sm:text-sm text-slate-400">
                    <span className="hidden xs:inline">Dashboard</span>
                    <ChevronRight className="h-3 w-3 mx-1 hidden xs:inline" />
                    <span className="text-slate-300 truncate">
                      {pathname === "/dashboard"
                        ? "Overview"
                        : (pathname.split("/").pop() ?? "")
                            .charAt(0)
                            .toUpperCase() +
                          (pathname.split("/").pop() ?? "").slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/live">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 sm:px-4">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Diagram</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 lg:w-64 bg-slate-900/50 border-r border-slate-700/50 backdrop-blur-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 lg:pt-0">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="hover:bg-slate-800/80"
              >
                <X className="h-5 w-5 text-slate-400" />
              </Button>
            </div>{" "}
            <nav className="flex-1 flex flex-col gap-2 p-4 sm:p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className="block"
                    >
                      <div
                        className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
                          pathname === item.href
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                      >
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge className="ml-auto bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="mt-auto">
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 shadow-lg">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></div>
                    <h3 className="text-xs sm:text-sm font-semibold text-indigo-300 uppercase tracking-wider">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Link href="/live" className="block group">
                      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-slate-600/50 text-slate-200 hover:text-white hover:border-indigo-400/50 bg-slate-800/50 group-hover:bg-slate-800/80 text-xs sm:text-sm py-1.5 px-2 sm:px-3"
                        >
                          <PlusSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-indigo-400" />
                          Create Diagram
                        </Button>
                      </div>
                    </Link>
                    <Link href="/schema-analysis" className="block group">
                      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-slate-600/50 text-slate-200 hover:text-white hover:border-indigo-400/50 bg-slate-800/50 group-hover:bg-slate-800/80 text-xs sm:text-sm py-1.5 px-2 sm:px-3"
                        >
                          <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-400" />
                          Analyze Schema
                        </Button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </aside>{" "}
        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          {/* Backdrop for mobile sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
