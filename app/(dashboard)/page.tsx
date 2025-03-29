"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, Lock } from "lucide-react";
// import { Terminal } from "./terminal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { GlowEffectCardBackground } from "./_components/glow-effect-card";
import { use } from "react";
import { useUser } from "@/lib/auth";
import { BorderButton } from "@/components/border-butto";

export default function HomePage() {
  const { userPromise } = useUser();
  const user = use(userPromise);

  return (
    <main>
      <section className="min-h-screen flex items-center bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-800 to-red-300 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <TextEffect
                per="char"
                as="p"
                preset="blur"
                speedSegment={0.1}
                className="text-5xl font-bold text-gray-900 tracking-tight sm:text-6xl md:text-7xl"
              >
                Modern Database
              </TextEffect>
              <TextEffect
                per="char"
                as="h2"
                preset="blur"
                speedSegment={0.1}
                className=" text-5xl font-bold block tracking-tight sm:text-6xl md:text-7xl text-orange-600"
              >
                Visualization
              </TextEffect>

              <TextEffect
                per="word"
                as="p"
                preset="fade"
                delay={3}
                speedSegment={0.7}
                className="mt-6 text-xl text-gray-500"
              >
                Transform your database schemas into beautiful, interactive
                diagrams. Build better applications with crystal-clear database
                understanding.
              </TextEffect>
              <p className="mt-6 text-xl text-gray-500"></p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:max-w-lg lg:mx-0">
                {!user && (
                  <a href="/sign-up" className="z-10">
                    <Button className="bg-blue-600 hover:bg-blue-700  text-white rounded-full text-lg px-8 py-4">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                )}
                {user && (
                  <a href="/dashboard" className="z-10">
                    <BorderButton>Get Started</BorderButton> 
                  </a>
                )}
              </div>
            </div>
            <div className="mt-12 relative lg:mt-0 lg:col-span-6">
              <GlowEffectCardBackground />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to understand your data
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Powerful features that help you visualize and manage your database
              structure
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Code className="h-6 w-6" />,
                title: "Auto-Generate ERD",
                description:
                  "Automatically generate ERD diagrams from your existing database schema",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Team Collaboration",
                description:
                  "Share and collaborate on database designs with your team in real-time",
              },
              {
                icon: <Lock className="h-6 w-6" />,
                title: "Version Control",
                description:
                  "Track changes and maintain history of your database schema evolution",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white mx-auto">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to visualize your database?
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Join thousands of developers who are building better
                applications with clear database visualization.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xl px-12 py-6">
                Get Started Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
