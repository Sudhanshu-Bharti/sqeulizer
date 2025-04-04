import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our comprehensive range of services",
}

const services = [
  {
    title: "Web Development",
    description: "Custom web applications built with modern technologies",
    features: ["React/Next.js", "TypeScript", "Responsive Design", "API Integration"],
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and deployment",
    features: ["AWS/GCP", "Docker", "CI/CD", "Serverless"],
  },
  {
    title: "Data Analytics",
    description: "Data-driven insights and business intelligence",
    features: ["Data Visualization", "Machine Learning", "ETL Pipelines", "Reporting"],
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600">
          Comprehensive solutions for your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">{service.title}</CardTitle>
              <CardDescription className="text-lg text-gray-600">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 