"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import NewArrivalsSection from "@/components/home/NewArrivalsSection"
import TopSellingSection from "@/components/home/TopSellingSection"
import BrowseByStyle from "@/components/home/BrowseByStyle"

export default function Home() {
  return (<>
    <div className="flex flex-col flex-1 bg-white md:bg-[#f2f0f1] dark:bg-neutral-900 transition-colors">

      {/* Hero Section — full width grey, no container */}
      <section className="relative min-h-[560px] overflow-hidden md:mx-20 flex flex-col lg:block">

        {/* IMAGE — absolute, shifted more to the left */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative lg:absolute inset-y-0 right-0 w-full lg:w-[55%] pointer-events-none order-2 lg:order-none" >
          <img
            src="/models.png"
            alt="models"
            className="w-full h-[400px] sm:h-[480px] lg:h-full object-cover object-[91%_top]" />

          {/* Star Decor */}
          <img
            src="/star1.png"
            className="absolute top-[230px] left-[20px] w-8 sm:w-10 md:top-[340px] md:left-[140px] md:w-12 opacity-80"
            alt="decor"
          />

          <img
            src="/star2.png"
            className="absolute top-[40px] right-[16px] w-10 sm:w-12 md:top-[120px] md:right-[40px] md:w-15 opacity-80"
            alt="decor"
          />
        </motion.div>

        {/* Mobile overlay */}
        <div className="absolute inset-0 bg-black/40 lg:hidden" />

        {/* LEFT CONTENT */}
        <div className="relative z-10 px-5 sm:px-8 md:px-10 py-12 sm:py-14 lg:py-20 order-1 md:ml-13">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[40%] space-y-6 text-center lg:text-left">

            {/* TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black leading-tight text-black dark:text-white">
              FIND CLOTHES THAT <br />
              MATCHES YOUR STYLE
            </h1>

            {/* DESCRIPTION */}
            <p className="text-black dark:text-gray-400 mx-auto lg:mx-0 max-w-sm line-clamp-2">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of style.
            </p>

            <Link href="/products">
              <Button className="bg-black dark:bg-zinc-800 text-white px-8 py-6 rounded-full text-lg hover:opacity-90 w-full sm:w-auto">
                Shop Now
              </Button>
            </Link>

            {/* STATS */}
            <div className="flex flex-wrap items-center gap-4 pt-4 justify-center lg:justify-start">
              <div>
                <h3 className="text-4xl font-bold text-black dark:text-white">200+</h3>
                <p className="text-sm text-gray-500">International Brands</p>
              </div>

              <div className="h-10 w-px bg-black dark:bg-white" />

              <div>
                <h3 className="text-4xl font-bold text-black dark:text-white">2,000+</h3>
                <p className="text-sm text-gray-500">High-Quality Products</p>
              </div>

              <div className="hidden sm:block h-10 w-px bg-black dark:bg-white" />
              <div>
                <h3 className="text-4xl font-bold text-black dark:text-white">30,000+</h3>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* BRANDS BAR */}
      <div className="bg-black text-white py-5 w-full dark:bg-zinc-800 overflow-hidden">
        <div className="animate-marquee">
          {/* first list */}
          {["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein", "DeFacto", "Jack & Jones", "LC Waikiki", "Adidas"].map((brand, i) => (
            <span key={i} className="text-xl font-extrabold mx-8 tracking-wider whitespace-nowrap">
              {brand}
              <span className="mx-4 text-white/30">✦</span>
            </span>
          ))}
          {/*  again fisrt list */}
          {["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein", "DeFacto", "Jack & Jones", "LC Waikiki", "Adidas"].map((brand, i) => (
            <span key={`repeat-${i}`} className="text-xl font-extrabold mx-8 tracking-wider whitespace-nowrap">
              {brand}
              <span className="mx-4 text-white/30">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* New Arrivals */}
    <div className="px-2">
      <NewArrivalsSection limit={4} />
      <div className="flex justify-center -mt-3 ">
        <Link
          href="/new-arrivals"
          className="border px-16 py-2.5 rounded-full hover:bg-black hover:text-white transition dark:hover:bg-zinc-600 dark:bg-zinc-900 text-sm font-medium">
          View All
        </Link>
      </div>
    </div>

    {/* Top Selling */}
    <div className="px-2">
      <TopSellingSection limit={4} />
      <div className="flex justify-center -mt-12 mb-10">
        <Link
          href="/top-selling"
          className="border px-16 py-2.5 rounded-full hover:bg-black hover:text-white transition dark:hover:bg-zinc-600 dark:bg-zinc-900 text-sm font-medium">
          View All
        </Link>
      </div>
    </div>
    <BrowseByStyle />
  </>

  )
}