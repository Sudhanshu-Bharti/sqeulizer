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
    <div className="relative min-h-screen bg-black selection:bg-fuchsia-500/30 selection:text-fuchsia-100">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-rose-500/20 via-fuchsia-500/20 to-indigo-500/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-orange-500/20 via-rose-500/20 to-fuchsia-500/20 blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        <SiteHeader className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-b border-white/5" />
        <main className="pt-16">{children}</main>
        <SiteFooter className="border-t border-white/5 bg-black/30 backdrop-blur-xl" />
      </div>
      <Toaster />

      {/* Grain effect overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
