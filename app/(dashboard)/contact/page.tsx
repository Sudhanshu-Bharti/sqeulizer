"use client";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Github, Twitter } from "lucide-react"
import { TextEffect } from "@/components/motion-primitives/text-effect"

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help with your account or technical issues",
    icon: <Mail className="h-6 w-6" />,
    link: "mailto:support@dbviz.com",
    label: "support@dbviz.com",
  },
  {
    title: "Community Forum",
    description: "Join our community and share your experiences",
    icon: <MessageSquare className="h-6 w-6" />,
    link: "https://community.dbviz.com",
    label: "Visit Forum",
  },
  {
    title: "GitHub",
    description: "Contribute to our open-source projects",
    icon: <Github className="h-6 w-6" />,
    link: "https://github.com/dbviz",
    label: "View on GitHub",
  },
  {
    title: "Twitter",
    description: "Follow us for updates and announcements",
    icon: <Twitter className="h-6 w-6" />,
    link: "https://twitter.com/dbviz",
    label: "Follow @dbviz",
  },
]

export default function ContactPage() {
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
              Contact Us
            </TextEffect>
            <TextEffect
              per="word"
              as="p"
              preset="fade"
              delay={3}
              speedSegment={0.7}
              className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We're here to help! Choose the best way to get in touch with our team
            </TextEffect>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-6 group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                >
                  {method.label}
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </Card>
            ))}
          </div>

          <div className="mt-20 text-center">
            <TextEffect
              per="char"
              as="h2"
              preset="blur"
              speedSegment={0.1}
              className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6"
            >
              Need More Help?
            </TextEffect>
            <TextEffect
              per="word"
              as="p"
              preset="fade"
              delay={3}
              speedSegment={0.7}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            >
              Check out our documentation or join our community forum for additional support
            </TextEffect>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-base px-6 py-3 shadow-sm hover:shadow transition-all duration-200">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 