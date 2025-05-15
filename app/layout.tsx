import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthProvider } from "@/components/AuthProvider"
import SessionValidator from "@/components/SessionValidator"
import Header from "@/components/navbar"


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
          <SessionValidator/>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
            {/* Header */}
             <Header/>
          {/* Main Content */}
          <main className="flex-1 bg-background mt-20">{children}</main>
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
