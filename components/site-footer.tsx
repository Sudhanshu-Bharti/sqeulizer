import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-auto p-6", className)}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            {" "}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/pandaview.png"
                alt="PandaView Logo"
                className="h-6 w-6"
              />
              <span className="font-semibold text-lg">
                <span className="text-white">Panda</span>
                <span className="text-indigo-400">View</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 max-w-xs">
              Transform your database schema into beautiful, interactive
              diagrams
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Documentation"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>{" "}
          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {["Blog", "Careers"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          {" "}
          <div className="text-center text-sm text-white/60">
            © {new Date().getFullYear()} PandaView. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
