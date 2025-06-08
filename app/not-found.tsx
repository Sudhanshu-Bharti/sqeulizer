import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page Not Found - PandaView",
  description: "The page you're looking for doesn't exist. Return to PandaView's homepage to continue your database visualization journey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-emerald-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Return Home
          </Link>
          <div className="text-sm text-slate-500">
            <p>Popular pages you might want to visit:</p>
            <div className="mt-2 space-x-4">
              <Link href="/features" className="text-emerald-400 hover:text-emerald-300">
                Features
              </Link>
              <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300">
                Pricing
              </Link>
              <Link href="/about" className="text-emerald-400 hover:text-emerald-300">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
