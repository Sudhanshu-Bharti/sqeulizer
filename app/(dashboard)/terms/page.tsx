import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
            <img src="/pandaview.png" alt="PandaView Logo" className="h-5 w-5" />
            <span>Legal</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-white">
            Terms of <span className="text-indigo-400">Service</span>
          </h1>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 mb-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">Last updated: June 3, 2025</p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using PandaView, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>

            <h2>2. Subscription Terms</h2>
            <p>
              Certain features of the Service are available on a subscription basis. By selecting a subscription, you agree to pay the subscription fees as described at the time of your selection.
            </p>
            <ul>
              <li>Subscriptions automatically renew unless auto-renewal is turned off.</li>
              <li>You may cancel your subscription at any time from your account settings.</li>
              <li>Refunds are subject to our refund policy as described on our website.</li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Use the Service in any way that violates any applicable laws or regulations.</li>
              <li>Use the Service for any harmful or fraudulent activities.</li>
              <li>Infringe upon or violate our intellectual property rights or those of others.</li>
              <li>Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of PandaView and its licensors.
            </p>

            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service or third parties, or for any other reason at our sole discretion.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall PandaView, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have questions or comments about these Terms of Service, please contact us at:
            </p>
            <p className="font-mono bg-slate-800 p-2 rounded text-indigo-300 inline-block">legal@pandaview.com</p>
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
