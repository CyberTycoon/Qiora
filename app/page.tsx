import Link from "next/link"
import { ArrowRight, ImageIcon, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 space-y-8 md:py-32">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
            Introducing Qiora AI
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            AI Content Creation <span className="text-primary animate-pulse">Made Simple</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Generate professional content in seconds with our powerful AI tools. Perfect for content creators,
            marketers, small businesses, educators, and developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" asChild>
              <Link href="/create">
                Create With Qiora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Tailored for Your Needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="p-2 w-fit rounded-full bg-muted mb-2">
                <Type className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Content Creators</CardTitle>
              <CardDescription>
                Generate blog posts, social media captions, video scripts, and podcast outlines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 rounded-md flex items-center justify-center overflow-hidden">
                <Image
                  width={200}
                  height={200}
                  priority
                  src="/content.jpg"
                  alt="Content creators illustration"
                  className="h-full w-full object-cover rounded-md transition-transform hover:scale-105 duration-300"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/create">Create Content</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="p-2 w-fit rounded-full bg-muted mb-2">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Small Business & Marketing</CardTitle>
              <CardDescription>
                Create marketing copy, product descriptions, ad variations, and social media posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                <Image
                  width={200}
                  height={200}
                  priority
                  src="/marketing.jpg"
                  alt="Marketing illustration"
                  className="h-full w-full object-cover rounded-md transition-transform hover:scale-105 duration-300"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/create">Marketing Content</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="p-2 w-fit rounded-full bg-muted mb-2">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Visual Assets</CardTitle>
              <CardDescription>
                Generate images for social media, concept art, mood boards, and design elements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                <Image
                  width={200} 
                  height={200}
                  priority
                  src="/visual.jpg"
                  alt="Visual assets illustration"
                  className="h-full w-full object-cover rounded-md transition-transform hover:scale-105 duration-300"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/create">Create Images</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How Qiora Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Your Prompt</h3>
              <p className="text-muted-foreground">Describe what you want to create with simple text prompts.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Generation</h3>
              <p className="text-muted-foreground">
                Our AI models process your request and generate high-quality content.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Save & Share</h3>
              <p className="text-muted-foreground">
                Store your creations in your personal gallery and share them with others.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
