/**
 * Root Admin Layout
 * Handles production blocking only
 */

import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function RootAdminLayout({ children }: { children: ReactNode }) {
  // Block access in production
  if (process.env.NODE_ENV === "production") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
