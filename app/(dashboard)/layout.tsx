"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-950 selection:bg-slate-800 selection:text-slate-100">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/10 via-slate-500/10 to-emerald-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-slate-500/10 via-emerald-500/10 to-slate-500/10 blur-[100px] animate-pulse" />
      </div>
      <div className="relative z-10">
        <SiteHeader className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800" />
        <main className="pt-16">{children}</main>
        <SiteFooter className="relative border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl overflow-hidden" />
      </div>
      <Toaster />
    </div>
  );
}
