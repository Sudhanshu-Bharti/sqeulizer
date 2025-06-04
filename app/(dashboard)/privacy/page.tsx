import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
            <img src="/pandaview.png" alt="PandaView Logo" className="h-5 w-5" />
            <span>Legal</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-white">
            Privacy <span className="text-indigo-400">Policy</span>
          </h1>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 mb-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">Last updated: June 3, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              At PandaView, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect includes:
            </p>
            <ul>
              <li>Personal Data: Personally identifiable information, such as your name, email address, and other contact information that you voluntarily give to us when you register or when you choose to participate in various activities related to the Service.</li>
              <li>Usage Data: Information on how the Service is accessed and used.</li>
              <li>Cookies Data: We use cookies and similar tracking technologies to track the activity on our Service.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We may use the information we collect about you to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our Service</li>
              <li>Improve, personalize, and expand our Service</li>
              <li>Monitor the usage of our Service</li>
              <li>Detect, prevent and address technical issues</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations, including:
            </p>
            <ul>
              <li>With your consent</li>
              <li>To comply with laws or to protect rights</li>
              <li>For business transfers</li>
              <li>With third-party service providers</li>
            </ul>

            <h2>5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information from unauthorized access and use.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
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
