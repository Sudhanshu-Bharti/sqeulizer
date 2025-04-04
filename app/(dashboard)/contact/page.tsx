import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team",
}

const contactInfo = [
  {
    title: "Email",
    value: "contact@example.com",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+1 (555) 123-4567",
    icon: Phone,
  },
  {
    title: "Address",
    value: "123 Business Street, Suite 100, City, Country",
    icon: MapPin,
  },
]

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input id="name" placeholder="Your name" className="border-gray-300" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input id="email" type="email" placeholder="your@email.com" className="border-gray-300" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input id="subject" placeholder="Subject" className="border-gray-300" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Your message"
                className="min-h-[150px] border-gray-300"
              />
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Send Message
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <Card key={index} className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{info.title}</CardTitle>
                      <p className="text-gray-600">{info.value}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Saturday</span>
                  <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Sunday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 