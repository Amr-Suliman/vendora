"use client"

import { X } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

type Props = {
  onClose: () => void
}

export default function AnnouncementBar({ onClose }: Props) {
  const { status } = useSession()

  // Hide if user is already logged in
  if (status === "authenticated") return null

  return (
    <div className="fixed top-0 z-30 w-full bg-black text-white text-xs sm:text-sm">
      <div className="container mx-auto px-6 sm:px-4 h-10 flex items-center justify-center relative">

        {/* Announcement message */}
        <p className="text-center leading-tight pr-6">
          Sign up and get 20% off to your first order.
          <Link href="/login" className="underline ml-1 cursor-pointer hover:opacity-80">
            Sign Up Now
          </Link>
        </p>

        {/* Close button */}
        <button onClick={onClose} className="absolute right-4 hover:opacity-70">
          <X size={16} />
        </button>

      </div>
    </div>
  )
}