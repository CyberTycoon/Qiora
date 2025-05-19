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
    default: "Cortex - AI Content Creation Platform", 
    template: "%s | Cortex", // Template for titles on other pages
  },
  description: "Generate amazing text and images instantly with Cortex AI. Your platform for creative content generation using cutting-edge AI models.",
  keywords: [
    "AI content generation",
    "text to image AI",
    "AI writer",
    "AI image generator",
    "free AI tools",
    "online content creator",
    "AI platform",
    "generate text AI",
    "generate images AI",
    "AI art generator",
    "creative AI",
    "AI writing assistant",
    "AI image tools",
    "Cortex AI",
    "AI content creation",
    "AI text generation",
    "AI image generation",
    "Free AI",
    "AI tools",
    "AI for content creators",
    "AI for marketers",
    "AI for developers",
    "AI for educators",
    "AI for small businesses",
    "AI for content marketing",
    "AI for social media",
    "AI for blogging",
    "AI for video scripts",
    "AI for podcasting",
    "AI for education",
    "AI for coding",
    "cortex",
    "AI powered content",
  ],
  authors: [{ name: "Silas Okanlawon" }], // Replace with actual author info
  creator: "silas okanlawon", // Replace with actual creator info
  publisher: "silas okanlawon", // Replace with actual publisher info

  // Open Graph (for social media sharing)
  openGraph: {
    title: "Cortex - AI Content Creation Platform",
    description: "Generate amazing text and images instantly with Cortex AI. Your platform for creative content generation using cutting-edge AI models.",
    url: "https://cortex-gray.vercel.app/",
    siteName: "Cortex",
    images: [
      {
        url: "/opengraph.png", // Replace with a URL to your Open Graph image (recommended size 1200x630)
        width: 1200,
        height: 630,
        alt: "Cortex - AI Content Creation Platform",
      },
      // Add more images if needed
    ],
    locale: "en_US",
    type: "website",
  },

  viewport: "width=device-width, initial-scale=1",

  // Robots meta tag (controls search engine crawling and indexing)
  // 'index, follow' is the default and usually what you want
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'noimageindex': true
    }
  }

  // Other potential metadata properties:
  // verification: { // For search engine verification
  //   google: 'google-site-verification=...',
  //   bing: 'bing-site-verification=...',
  // },
  // themeColor: '#ffffff', // For browser theme color
  // manifest: '/manifest.json', // For Progressive Web Apps
}


// The root layout component. This is an async Server Component
// because we need to fetch the session data on the server.
// Note: Metadata is handled automatically by Next.js from the 'metadata' object
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="7NZY7ue9nb7KjdiSNblV78TZRxZqlm0_zFGhVo409Ms" />
      </head>
      <body className={inter.className}>
        {/* AuthProvider and ThemeProvider remain Client Components */}
        <AuthProvider>
          {/* SessionValidator remains a Client Component */}
          <SessionValidator/>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
            {/* Header remains */}
             <Header/>
            {/* Main Content Area */}
            {/* mt-20 added to push content below the fixed header */}
            <main className="flex-1 bg-background mt-20">{children}</main>
            {/* Footer remains */}
            <footer className="border-t mt-auto bg-background">
              <div className="container py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="bg-primary p-1.5 rounded-lg">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-primary">Cortex</span>
                  </div>
                  <p className="text-sm text-muted-foreground">© 2025 Cortex. All rights reserved.</p>
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
