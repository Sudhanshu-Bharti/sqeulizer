import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
            <img src="/pandaview.png" alt="PandaView Logo" className="h-5 w-5" />
            <span>Join Our Team</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
            Careers at <span className="text-indigo-400">PandaView</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-12 max-w-3xl leading-relaxed">
            Help us transform how developers visualize and understand database schemas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Why Join Us?</h2>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 mt-1">✓</div>
                <span>Work on cutting-edge visualization technology</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 mt-1">✓</div>
                <span>Flexible remote-first work environment</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 mt-1">✓</div>
                <span>Competitive compensation and benefits</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 mt-1">✓</div>
                <span>Growth opportunities in a fast-growing startup</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-white/80 mb-6">
              We're growing our team! Check back soon for open positions or send your resume to:
            </p>
            <div className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-300 font-mono">
              careers@pandaview.com
            </div>
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
