import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading - PandaView",
  description: "Loading your content...",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-slate-400">Loading...</p>
      </div>
    </div>
  );
} 