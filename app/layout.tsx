import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { getUser } from "@/lib/db/queries";
import { UserProvider } from "@/lib/auth";
import { SessionProvider } from "@/components/session-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "PandaView - Database Schema Visualization & Security",
    template: "%s | PandaView",
  },
  description:
    "Transform your database workflow with PandaView. Generate ERD diagrams, detect vulnerabilities, analyze performance, and optimize your database schema with our powerful visualization tools.",
  keywords: [
    "database visualization",
    "ERD diagrams",
    "database security",
    "schema analysis",
    "database optimization",
    "SQL visualization",
  ],
  authors: [{ name: "PandaView Team" }],
  creator: "PandaView",
  publisher: "PandaView",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pandaview.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pandaview.site",
    title: "PandaView - Database Schema Visualization & Security",
    description:
      "Transform your database workflow with PandaView. Generate ERD diagrams, detect vulnerabilities, analyze performance, and optimize your database schema.",
    siteName: "PandaView",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider>
            <UserProvider userPromise={userPromise}>
              {children}
              <Analytics />
              <Toaster />
            </UserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
