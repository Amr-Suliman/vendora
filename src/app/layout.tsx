import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

import Navbar from "@/components/navbar/page"
import Footer from "@/components/footer/page"
import { Toaster } from "sonner"
import AddressContextProvider from "@/components/context/AddressContext"
import CartContextProvider from "@/components/context/CartContext"
import { WishlistProvider } from "@/components/context/WishlistContext"
import MySessionProvider from "@/components/mySessionProvider/MySessionProvider"
import PageTransition from "@/components/transition/PageTransition"


const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "VEND◯RA",
  description: "Modern e-commerce store",
  openGraph: {
    title: "VEND◯RA",
    description: "Modern e-commerce store",
    url: "https://vendora-store.vercel.app",
    images: [
      {
        url: "/src/app/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (_) {}
})();
            `,
          }}
        />
      </head>

      <body
        className={`
          ${font.variable}
          font-sans
          antialiased
          bg-white dark:bg-neutral-950
          transition-colors duration-300
        `}
      >
        <MySessionProvider>
          <WishlistProvider>
            <CartContextProvider>
              <AddressContextProvider>
                <Navbar />
                <main className="flex flex-col min-h-screen">
                  <PageTransition>
                    {children}
                  </PageTransition>
                  <Toaster position="top-center" richColors />
                </main>
                <Footer />
              </AddressContextProvider>
            </CartContextProvider>
          </WishlistProvider>
        </MySessionProvider>
      </body>
    </html>
  )
}