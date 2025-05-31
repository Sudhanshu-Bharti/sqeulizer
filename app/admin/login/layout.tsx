/**
 * Admin Login Layout
 * Simple layout for the login page without authentication checks
 */

import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function AdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Block access in production
  if (process.env.NODE_ENV === "production") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
