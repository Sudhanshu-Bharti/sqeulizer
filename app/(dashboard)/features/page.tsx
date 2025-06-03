import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Share2, Database, Shield, Check, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
            <img src="/pandaview.png" alt="PandaView Logo" className="h-5 w-5" />
            <span>Product</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
            PandaView <span className="text-indigo-400">Features</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your database schema into beautiful, interactive diagrams with our powerful features.
          </p>
        </div>
        
        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-16 mb-32">
          {[
            {
              icon: <Code2 className="h-8 w-8" />,
              title: "ERD Diagrams",
              description: "Transform your database schema into beautiful, interactive entity relationship diagrams",
              color: "bg-indigo-500",
              features: [
                "Auto-layout algorithms for clean designs",
                "Multiple relationship visualization styles",
                "Column type and constraint display",
                "Color coding for easier comprehension"
              ]
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Schema Analysis",
              description: "Analyze your database for security issues, normalization problems, and performance optimizations",
              color: "bg-emerald-500",
              features: [
                "Security vulnerability detection",
                "Normalization rule checking",
                "Performance optimization suggestions",
                "Best practice recommendations"
              ]
            },
            {
              icon: <Share2 className="h-8 w-8" />,
              title: "Team Workspace",
              description: "Collaborate with your team members on database designs and documentation",
              color: "bg-blue-500",
              features: [
                "Real-time collaboration",
                "Role-based access control",
                "Commenting and feedback tools",
                "Project organization features"
              ]
            },
            {
              icon: <Database className="h-8 w-8" />,
              title: "Version Control (Coming Soon)",
              description: "Track schema changes over time, never lose a single modification",
              color: "bg-violet-500",
              features: [
                "Schema version history",
                "Change comparison views",
                "Rollback capabilities",
                "Migration script generation"
              ]
            }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 hover:border-indigo-500/20 transition-all">
              <div className={`flex items-center justify-center h-16 w-16 rounded-xl ${feature.color} text-white mb-6`}>
                {feature.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{feature.title}</h2>
              <p className="text-white/60 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center text-white/80">
                    <Check className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-75 blur-lg"></div>
          <div className="relative bg-black/40 backdrop-blur-xl p-12 border border-white/10 rounded-xl">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to get started?
                </h2>
                <p className="text-lg text-white/60">
                  Join developers who are building better applications with clear database visualization.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
                <Link href="/sign-up" className="group">
                  <Button className="bg-white hover:bg-white/90 text-black rounded-lg px-8 py-4 text-lg font-medium group-hover:scale-105 transition-transform">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 px-6 py-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
