'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-neutral-950 -mt-15">

      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <Link href="/" className="logo text-xl">
          VEND◯RA
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-lg w-full text-center space-y-6"
      >
        {/* BIG 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[140px] sm:text-[180px] font-extrabold leading-none tracking-tighter text-black dark:text-white select-none"
        >
          404
        </motion.h1>

        {/* DIVIDER */}
        <div className="w-12 h-[2px] bg-black dark:bg-white rounded-full mx-auto" />

        {/* TITLE */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            className="gap-2 rounded-full px-6"
            onClick={() => router.push('/')}
          >
            <Home size={16} />
            Back to Home
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-full px-6"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-zinc-400 pt-4">
          Think this is a mistake?{" "}
          <Link href="/contact" className="underline hover:text-black dark:hover:text-white transition">
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  )
}