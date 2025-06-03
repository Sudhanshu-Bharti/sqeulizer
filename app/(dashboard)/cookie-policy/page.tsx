import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
            <img src="/pandaview.png" alt="PandaView Logo" className="h-5 w-5" />
            <span>Legal</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-white">
            Cookie <span className="text-indigo-400">Policy</span>
          </h1>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 mb-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">Last updated: June 3, 2025</p>

            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              PandaView uses cookies for the following purposes:
            </p>
            <ul>
              <li>Essential cookies: These cookies are required for the operation of our Service.</li>
              <li>Preferences cookies: These cookies remember information that changes the way the Service behaves or looks.</li>
              <li>Analytics cookies: These cookies help us understand how visitors interact with the Service by collecting and reporting information anonymously.</li>
              <li>Marketing cookies: These cookies are used to track visitors across websites to enable us to display ads that are relevant and engaging.</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <p>
              We use both session and persistent cookies on the Service:
            </p>
            <ul>
              <li>Session Cookies: These are temporary cookies that are deleted when you close your browser.</li>
              <li>Persistent Cookies: These remain on your device until you delete them or they expire.</li>
            </ul>

            <h2>4. Your Choices Regarding Cookies</h2>
            <p>
              If you prefer to avoid the use of cookies on the website, first you must disable the use of cookies in your browser and then delete the cookies saved in your browser associated with this website. You may use this option for preventing the use of cookies at any time.
            </p>
            <p>
              If you do not accept our cookies, you may experience some inconvenience in your use of the Service. For example, we may not be able to recognize your computer, and you may need to log in every time you visit.
            </p>

            <h2>5. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have questions or comments about our Cookie Policy, please contact us at:
            </p>
            <p className="font-mono bg-slate-800 p-2 rounded text-indigo-300 inline-block">privacy@pandaview.com</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/">
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-6 py-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
