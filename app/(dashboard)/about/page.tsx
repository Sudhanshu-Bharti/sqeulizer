import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company and mission",
}

const stats = [
  { title: "Team Members", value: "50+", icon: Users },
  { title: "Projects Completed", value: "200+", icon: Target },
  { title: "Years Experience", value: "10+", icon: Award },
]

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We are a team of passionate professionals dedicated to delivering exceptional solutions
          and creating lasting value for our clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="text-center border border-gray-200">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Icon className="h-12 w-12 text-orange-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">{stat.value}</CardTitle>
                <p className="text-lg text-gray-600">{stat.title}</p>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            Our mission is to empower businesses through innovative technology solutions.
            We strive to create products that make a real difference in people's lives
            and help organizations achieve their goals.
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700">Learn More</Button>
        </div>
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-600 mt-2" />
              <div>
                <h4 className="font-semibold text-gray-900">Innovation</h4>
                <p className="text-gray-600">Constantly pushing boundaries and exploring new possibilities</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-600 mt-2" />
              <div>
                <h4 className="font-semibold text-gray-900">Excellence</h4>
                <p className="text-gray-600">Committed to delivering the highest quality in everything we do</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-600 mt-2" />
              <div>
                <h4 className="font-semibold text-gray-900">Collaboration</h4>
                <p className="text-gray-600">Working together to achieve shared success</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 