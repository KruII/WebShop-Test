import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "DropMaster - Premium Dropshipping Store",
    template: "%s | DropMaster",
  },
  description:
    "Discover premium products with fast delivery, 100-day returns, and flexible payment options at DropMaster.",
  keywords: ["dropshipping", "ecommerce", "online store", "premium products"],
  authors: [{ name: "DropMaster Team" }],
  creator: "DropMaster",
  openGraph: {
    type: "website",
    locale: "en_US",
    //url: "https://dropmaster.com",
    siteName: "DropMaster",
    title: "DropMaster - Premium Dropshipping Store",
    description: "Discover premium products with fast delivery, 100-day returns, and flexible payment options.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DropMaster - Premium Dropshipping Store",
    description: "Discover premium products with fast delivery, 100-day returns, and flexible payment options.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 relative">{children}</main>
            <Toaster position="top-right" richColors />
            <Footer />
          </div>
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  )
}
