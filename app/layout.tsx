import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthProvider } from "@/components/AuthProvider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cortex - AI Content Creation Platform",
  description: "Generate amazing text and images with AI",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b bg-background z-10">
              <div className="container flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-2 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Link href="/" className="text-xl font-bold text-primary">
                    Cortex
                  </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/create" className="text-sm font-medium hover:text-primary transition-colors">
                    Create
                  </Link>
                  <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors">
                    Gallery
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </nav>
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <Link
                    href="/auth/sign-in"
                    className="text-sm font-medium px-3 py-1.5 rounded-md hover:text-primary hover:bg-accent transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </header>
          {/* Main Content */}
          <main className="flex-1 bg-background">{children}</main>

          {/* Footer */}
            {/* Footer */}
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
