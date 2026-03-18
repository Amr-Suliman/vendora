"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"

const styles = [
  { name: "Casual", href: "/products?style=casual", img: "/images/accessories/c.png", col: "md:col-span-5" },
  { name: "Formal", href: "/products?style=formal", img: "/images/accessories/f.png", col: "md:col-span-7" },
  { name: "Party", href: "/products?style=party", img: "/images/accessories/p.png", col: "md:col-span-7" },
  { name: "Gym", href: "/products?style=gym", img: "/images/accessories/g.png", col: "md:col-span-5" },
]

export default function BrowseByStyle() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="container mx-auto px-6 md:px-12 mb-20">
      <div className="bg-[#f2f0f1] rounded-3xl py-16 px-6 md:px-12 dark:bg-zinc-900">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl md:text-4xl font-extrabold mb-12 dark:text-zinc-300"
        >
          BROWSE BY DRESS STYLE
        </motion.h2>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {styles.map((style, i) => (
            <motion.div
              key={style.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={style.col}
            >
              <Link
                href={style.href}
                className="relative block bg-white rounded-2xl overflow-hidden h-[250px] group"
              >
                {/* NAME BADGE */}
                <span className="absolute top-4 left-5 z-10 text-xl font-extrabold text-black">
                </span>

                <img
                  src={style.img}
                  className="absolute right-0 bottom-0 h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={style.name}
                />

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}