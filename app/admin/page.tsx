/**
 * Admin Dashboard Main Page
 * Handles authentication and provides admin tools
 */

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import Link from "next/link";

export default async function AdminPage() {
  // Check authentication
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                Development Only
              </span>
            </div>{" "}
            <div className="flex items-center space-x-4">
              <form action="/api/admin/auth" method="POST">
                <input type="hidden" name="_method" value="DELETE" />
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </form>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Admin Content */}
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Development and administrative tools
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {" "}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-semibold text-gray-900">
                Environment Management
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Switch between test and live Razorpay environments for development
              and testing.
            </p>
            <Link href="/admin/environment">
              <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer">
                Manage Environment →
              </span>
            </Link>
          </div>{" "}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-semibold text-gray-900">
                Security Notes
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              This admin panel is for development only and is automatically
              disabled in production.
            </p>
            <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded">
              Development Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
