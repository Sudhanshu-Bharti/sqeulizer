/**
 * Admin Environment Management Page
 * Only accessible by developers/admins - not for regular SaaS users
 */

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { EnvironmentDashboard } from "@/components/environment-dashboard";
import Link from "next/link";

export default async function AdminEnvironmentPage() {
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
              <h1 className="text-xl font-semibold">Admin Panel</h1>
              <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                Development Only
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Admin
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Environment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage development and production environment settings for Razorpay
            integration.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Admin Only
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  This page is for developers and administrators only. It should
                  not be accessible to regular SaaS users.
                </p>
              </div>
            </div>
          </div>
        </div>

        <EnvironmentDashboard />
      </div>
    </div>
  );
}
