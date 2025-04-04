"use client";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Database, Code2, GitBranch, Shield, Zap } from "lucide-react"
import { TextEffect } from "@/components/motion-primitives/text-effect"

const services = [
  {
    title: "Database Schema Visualization",
    description: "Transform complex database schemas into clear, interactive diagrams that help you understand your data structure at a glance.",
    features: [
      "Auto-generate ERD diagrams",
      "Interactive relationship mapping",
      "Custom styling options",
      "Export to multiple formats"
    ],
    icon: <Database className="h-6 w-6" />
  },
  {
    title: "Schema Analysis & Optimization",
    description: "Get insights into your database structure and receive recommendations for optimization and improvement.",
    features: [
      "Performance analysis",
      "Schema validation",
      "Optimization suggestions",
      "Best practices check"
    ],
    icon: <Code2 className="h-6 w-6" />
  },
  {
    title: "Version Control Integration",
    description: "Seamlessly integrate with your version control system to track and manage database schema changes.",
    features: [
      "Git integration",
      "Change history tracking",
      "Collaborative reviews",
      "Schema versioning"
    ],
    icon: <GitBranch className="h-6 w-6" />
  },
  {
    title: "Security & Compliance",
    description: "Ensure your database design meets security standards and compliance requirements.",
    features: [
      "Security analysis",
      "Compliance checks",
      "Access control mapping",
      "Audit trail generation"
    ],
    icon: <Shield className="h-6 w-6" />
  },
  {
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time to design and optimize your database structure.",
    features: [
      "Live collaboration",
      "Team comments",
      "Change notifications",
      "Role-based access"
    ],
    icon: <Zap className="h-6 w-6" />
  }
]

export default function ServicesPage() {
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
              Our Services
            </TextEffect>
            <TextEffect
              per="word"
              as="p"
              preset="fade"
              delay={3}
              speedSegment={0.7}
              className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Comprehensive database visualization and management solutions designed for modern development teams
            </TextEffect>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-orange-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-base px-6 py-3 shadow-sm hover:shadow transition-all duration-200">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 