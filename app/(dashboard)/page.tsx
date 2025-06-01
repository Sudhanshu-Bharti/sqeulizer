"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Share2, Database, Sparkles } from "lucide-react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { use } from "react";
import { useUser } from "@/lib/auth";
import Link from "next/link";
import { FunkyBackground } from "@/components/motion-primitives/funky-background";

export default function HomePage() {
  const { userPromise } = useUser();
  const user = use(userPromise);

  return (
    <main className="relative overflow-hidden ">
      <FunkyBackground />
      <section className="min-h-[90vh] relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20 backdrop-blur-sm">
              <Code2 className="h-4 w-4" />
              <span>Built by the Developers For the Developers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
              Turn Code Into{" "}
              <span className="text-indigo-400">Visual Magic</span>
            </h1>
            <p className="text-xl text-white/60 mb-12 mt-8 max-w-2xl mx-auto leading-relaxed">
              Transform your database schemas into stunning, interactive
              diagrams that make sense. Built for developers who think
              differently.
            </p>{" "}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!user ? (
                <>
                  <Link href="/sign-up">
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-8 py-6 text-lg font-medium">
                      Start Creating
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/live">
                    <Button
                      variant="outline"
                      className="px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10 rounded-lg backdrop-blur-sm"
                    >
                      Try Demo
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-md">
                  <Link href="/live" className="w-full">
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-8 py-6 text-lg font-medium w-full">
                      Create New Diagram
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <Link href="/dashboard" className="w-full">
                      <Button
                        variant="outline"
                        className="px-4 py-3 border-white/20 text-white hover:bg-white/10 rounded-lg backdrop-blur-sm w-full"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/live" className="w-full">
                      <Button
                        variant="outline"
                        className="px-4 py-3 border-white/20 text-white hover:bg-white/10 rounded-lg backdrop-blur-sm w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Try Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Features that <span className="text-indigo-400">Pop</span>
            </h2>
            <p className="text-xl text-white/60">
              Everything you need, nothing you don't
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 className="h-6 w-6" />,
                title: "AI-Powered Diagrams",
                description:
                  "Watch your code transform into beautiful ERD diagrams instantly",
                color: "bg-indigo-500",
              },
              {
                icon: <Share2 className="h-6 w-6" />,
                title: "Real-time Magic",
                description:
                  "Collaborate with your team in real-time, see changes as they happen",
                color: "bg-blue-500",
              },
              {
                icon: <Database className="h-6 w-6" />,
                title: "Version Control",
                description:
                  "Track schema changes over time, never lose a single modification",
                color: "bg-violet-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl transition-transform hover:scale-105"
              >
                <div className="p-6 rounded-xl bg-zinc-900 border border-white/10 h-full hover:border-white/20 transition-all">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-xl ${feature.color} text-white mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur-lg"></div>
            <div className="relative bg-black/40 backdrop-blur-xl p-12 border border-white/10">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to visualize?
                  </h2>
                  <p className="text-xl text-white/60">
                    Join developers who are building better applications with
                    clear database documentation.
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
                  <Link href={user ? "/live" : "/sign-up"} className="group">
                    <Button className="bg-white hover:bg-white/90 text-black rounded-lg px-8 py-6 text-lg font-medium group-hover:scale-105 transition-transform">
                      {user ? "Create New Diagram" : "Get Started Free"}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
