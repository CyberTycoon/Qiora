import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sparkles } from "lucide-react"
import { AuthProvider } from "@/components/AuthProvider"
import SessionValidator from "@/components/SessionValidator"
import Header from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Quira - AI Content Creation Platform",
    template: "%s | Quira",
  },
  description:
    "Quira is your all-in-one AI content creation platform. Instantly generate engaging text, visuals, and creative assets using cutting-edge generative AI models. Perfect for creators, marketers, educators, and developers.",
  keywords: [
    "Quira",
    "Quira AI",
    "quira",
    "sora",
    "ai",
    "midjourney",
    "dall-e",
    "chatgpt",
    "openai",
    "gpt-3",
    "deepseek",
    "pexel",
    "Quira AI",
    "AI content platform",
    "AI text generation",
    "AI image generator",
    "creative content AI",
    "AI writer",
    "AI art generator",
    "generate content with AI",
    "text to image AI",
    "AI tools for creators",
    "AI for business",
    "AI writing assistant",
    "AI content creator",
    "free AI content tools",
    "Quira platform",
    "AI productivity",
    "AI blogging assistant",
    "AI content marketing",
    "AI tools for small businesses",
    "AI content automation",
    "generative AI platform",
  ],
  authors: [{ name: "Silas Okanlawon" }],
  creator: "Silas Okanlawon",
  publisher: "Silas Okanlawon",
  openGraph: {
    title: "Quira - AI Content Creation Platform",
    description:
      "Create stunning AI-generated content effortlessly with Quira. From blogs and marketing copy to images and code, Quira empowers modern creators with AI tools.",
    url: "https://Quira.vercel.app/", // Update with your new domain if changed
    siteName: "Quira",
    images: [
      {
        url: "/opengraph.png", // Make sure this image has updated Quira branding
        width: 1200,
        height: 630,
        alt: "Quira - AI Content Creation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="7NZY7ue9nb7KjdiSNblV78TZRxZqlm0_zFGhVo409Ms"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SessionValidator />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 bg-background mt-20">{children}</main>
              <footer className="border-t mt-auto bg-background">
                <div className="container py-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                      <div className="bg-primary p-1.5 rounded-lg">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-primary">Quira AI</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      © 2025 Quira. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
