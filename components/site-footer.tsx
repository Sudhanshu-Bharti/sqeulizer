import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-auto relative", className)}>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Top Section with Logo and Descriptive Text */}
        <div className="flex flex-col md:flex-row md:justify-between mb-12">
          <div className="mb-10 md:mb-0 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <img
                src="/pandaview.png"
                alt="PandaView Logo"
                className="h-8 w-8"
              />
              <span className="font-semibold text-2xl">
                <span className="text-white">Panda</span>
                <span className="text-emerald-400">View</span>
              </span>
            </Link>
            <div className="mt-4">
              <p className="text-sm text-white/60">Have an idea? Say Hi!</p>
              <a
                href="mailto:hi@pandaview.com"
                className="text-white font-medium hover:text-indigo-400 transition-colors"
              >
                hi@pandaview.com
              </a>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10 md:gap-8">
            <div>
              <h3 className="font-medium text-white mb-4">Product</h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "Docs"].map((item) => (
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
              <h3 className="font-medium text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {["Blog"].map((item) => (
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
              <h3 className="font-medium text-white mb-4">Works</h3>
              <ul className="space-y-3">
                {["Features"].map((item) => (
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
                {[
                  { name: "Privacy", href: "/privacy" },
                  { name: "Terms", href: "/terms" },
                  { name: "Cookie Policy", href: "/cookie-policy" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>{" "}
        {/* Bottom Section with Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/60 mb-6 md:mb-0 text-center md:text-left">
            Copyright © {new Date().getFullYear()} PandaView. All rights
            reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              href="/legal#privacy"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Privacy & Policy
            </Link>
            <Link
              href="/legal#terms"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>{" "}
      {/* Large gradient watermark logo effect in background - similar to the image */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-10 pointer-events-none z-0 select-none">
        <div className="hidden sm:block text-[300px] md:text-[450px] lg:text-[600px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 select-none -ml-10">
          pv
        </div>
        <div className="sm:hidden text-[150px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 select-none -ml-5">
          pv
        </div>
      </div> */}
    </footer>
  );
}
