"use client";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Target, Award, Code2, Database, GitBranch } from "lucide-react"
import { TextEffect } from "@/components/motion-primitives/text-effect"

const stats = [
  {
    title: "Active Users",
    value: "10K+",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Projects Visualized",
    value: "50K+",
    icon: <Database className="h-6 w-6" />,
  },
  {
    title: "Team Members",
    value: "5+",
    icon: <GitBranch className="h-6 w-6" />,
  },
]

const values = [
  {
    title: "Developer-First",
    description: "We build tools that developers love to use, focusing on efficiency and clarity.",
    icon: <Code2 className="h-6 w-6" />,
  },
  {
    title: "Quality Focus",
    description: "Every feature is crafted with attention to detail and user experience.",
    icon: <Award className="h-6 w-6" />,
  },
  {
    title: "Continuous Innovation",
    description: "We're constantly improving and adding new features based on user feedback.",
    icon: <Target className="h-6 w-6" />,
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-600/20 to-amber-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <TextEffect
              per="char"
              as="h1"
              preset="blur"
              speedSegment={0.1}
              className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl"
            >
              About Us
            </TextEffect>
            <TextEffect
              per="word"
              as="p"
              preset="fade"
              delay={3}
              speedSegment={0.7}
              className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We're a team of developers passionate about making database visualization accessible and powerful
            </TextEffect>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.title}</div>
              </Card>
            ))}
          </div>

          <div className="text-center mb-16">
            <TextEffect
              per="char"
              as="h2"
              preset="blur"
              speedSegment={0.1}
              className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6"
            >
              Our Mission
            </TextEffect>
            <TextEffect
              per="word"
              as="p"
              preset="fade"
              delay={3}
              speedSegment={0.7}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              To empower developers with intuitive tools that make database visualization and management simple, efficient, and enjoyable. We believe that clear understanding of data structures leads to better applications and happier developers.
            </TextEffect>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 