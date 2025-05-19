import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pricing Plans</h1>
        <p className="mt-6 text-xl text-gray-500">Choose the perfect plan for your content creation needs</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Free Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <div className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-bold tracking-tight">$0</span>
              <span className="ml-1 text-xl font-semibold">/month</span>
            </div>
            <CardDescription className="mt-4">Perfect for trying out our platform</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>10 text generations per month</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>5 image generations per month</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Local storage only</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col relative border-purple-200 bg-purple-50">
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Pro</CardTitle>
            <div className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-bold tracking-tight">$19</span>
              <span className="ml-1 text-xl font-semibold">/month</span>
            </div>
            <CardDescription className="mt-4">Perfect for content creators and small businesses</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Unlimited text generations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>100 image generations per month</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>All templates and presets</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Cloud storage and organization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/auth/signup?plan=pro">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Business Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Business</CardTitle>
            <div className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-bold tracking-tight">$49</span>
              <span className="ml-1 text-xl font-semibold">/month</span>
            </div>
            <CardDescription className="mt-4">Perfect for teams and businesses</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Unlimited text and image generations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Team collaboration features</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Advanced templates and customization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Brand voice customization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>API access</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Dedicated support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/signup?plan=business">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
          We offer custom enterprise plans for organizations with specific needs. Contact us to learn more.
        </p>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  )
}
