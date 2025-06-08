'use client';

import { Metadata } from "next";
import Link from "next/link";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Error - PandaView",
  description: "An error occurred while loading the page. Please try again or contact support if the problem persists.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-red-400 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-400 mb-8">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
          <div className="text-sm text-slate-500">
            <p>Need help? Here are some options:</p>
            <div className="mt-2 space-x-4">
              <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">
                Contact Support
              </Link>
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 