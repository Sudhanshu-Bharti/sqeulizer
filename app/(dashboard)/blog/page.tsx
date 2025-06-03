import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
            <img src="/pandaview.png" alt="PandaView Logo" className="h-5 w-5" />
            <span>Our Blog</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
            PandaView <span className="text-indigo-400">Blog</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-12 max-w-3xl leading-relaxed">
            Insights, updates, and stories about database visualization and best practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder articles */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <img src="/pandaview.png" alt="PandaView Logo" className="h-16 w-16 opacity-50" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Coming Soon: New Article
                </h3>
                <p className="text-white/60 mb-4">
                  We're preparing some amazing content for you. Check back soon for our latest articles on database visualization.
                </p>
                <div className="text-sm text-indigo-400">June 2025</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
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
