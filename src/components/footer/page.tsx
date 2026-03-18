"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function Footer() {
  const [year, setYear] = useState<number | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!newsletterEmail) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newsletterEmail)) {
      toast.error("Please enter a valid email")
      return
    }

    setNewsletterLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      if (!res.ok) throw new Error()
      toast.success("Subscribed successfully! Check your email 📩")
      setNewsletterEmail("")
    } catch {
      toast.error("Something went wrong ❌")
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-t border-gray-300 dark:border-zinc-700 mt-15">

      {/* Newsletter Box */}
      <div className="container mx-auto px-4">
        <div className="bg-black dark:bg-zinc-800 text-white rounded-2xl px-6 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 -mt-16 mb-10">
          <h2 className="text-xl md:text-2xl font-extrabold max-w-md">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>

          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto" >
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="pl-10 bg-white text-black rounded-full w-full sm:w-[260px]" />
            </div>
            <Button
              type="submit"
              disabled={newsletterLoading}
              className="bg-white text-black rounded-full px-6 hover:bg-gray-200">
              {newsletterLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Subscribe to Newsletter"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              <Link href="/" className="logo">VEND◯RA</Link>
            </h2>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for technology, fashion, and lifestyle
              products with fast delivery and trusted service.
            </p>
            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="p-2 rounded-full border hover:bg-black hover:text-white transition">
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "SHOP", items: ["Electronics", "Fashion", "Home & Garden", "Sports", "Deals"] },
            { title: "CUSTOMER SERVICE", items: ["Contact Us", "Help Center", "Track Order", "Returns", "Size Guide"] },
            { title: "ABOUT", items: ["About Us", "Careers", "Press", "Investors", "Sustainability"] },
            { title: "POLICIES", items: ["Privacy Policy", "Terms", "Cookies", "Shipping", "Refunds"] },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold text-black dark:text-zinc-200">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {year ?? "----"} VEND◯RA. All rights reserved.</p>
          <img
            src="/images/payment.png"
            alt="payment methods"
            className="h-12 object-contain"
          />
        </div>
      </div>

    </motion.footer>
  )
}