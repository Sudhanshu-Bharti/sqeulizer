"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, Lock, Database, Terminal } from "lucide-react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { GlowEffectCardBackground } from "./_components/glow-effect-card";
import { use } from "react";
import { useUser } from "@/lib/auth";
import { BorderButton } from "@/components/border-butto";
import Link from "next/link";

export default function HomePage() {
  const { userPromise } = useUser();
  const user = use(userPromise);

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white">
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-600/20 to-amber-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/20 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
                <Terminal className="h-4 w-4" />
                <span>Built by developers, for developers</span>
              </div>
              <TextEffect
                per="char"
                as="h1"
                preset="blur"
                speedSegment={0.1}
                className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl"
              >
                Modern Database
              </TextEffect>
              <TextEffect
                per="char"
                as="h2"
                preset="blur"
                speedSegment={0.1}
                className="text-4xl font-bold block tracking-tight sm:text-5xl md:text-6xl text-orange-600"
              >
                Visualization
              </TextEffect>

              <TextEffect
                per="word"
                as="p"
                preset="fade"
                delay={3}
                speedSegment={0.7}
                className="mt-6 text-lg text-gray-600 max-w-2xl"
              >
                Transform your database schemas into beautiful, interactive diagrams. 
                Built with modern tools and designed for developers who value clarity and efficiency.
              </TextEffect>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:max-w-lg lg:mx-0">
                {!user && (
                  <a href="/sign-up" className="z-10">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-base px-6 py-3 shadow-sm hover:shadow transition-all duration-200">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                )}
                {user && (
                  <div className="flex flex-row gap-4">
                    <Link href="/live" className="z-10">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-base px-6 py-3 shadow-sm hover:shadow transition-all duration-200">
                        Generate DB Diagram
                        <Database className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="z-10">
                      <BorderButton>Go to Dashboard</BorderButton>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-12 relative lg:mt-0 lg:col-span-6">
              <GlowEffectCardBackground />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to understand your data
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features that help you visualize and manage your database structure
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="h-5 w-5" />,
                title: "Auto-Generate ERD",
                description:
                  "Automatically generate ERD diagrams from your existing database schema",
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Team Collaboration",
                description:
                  "Share and collaborate on database designs with your team in real-time",
              },
              {
                icon: <Lock className="h-5 w-5" />,
                title: "Version Control",
                description:
                  "Track changes and maintain history of your database schema evolution",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100 text-orange-600 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to visualize your database?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Join developers who are building better applications with clear database visualization.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <Link href={user ? "/live" : "/sign-up"}>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-base px-6 py-3 shadow-sm hover:shadow transition-all duration-200">
                  {user ? "Generate DB Diagram" : "Get Started Now"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
