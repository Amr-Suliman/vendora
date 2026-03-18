"use client"

import Link from "next/link"
import { LogOut, MapPin, Heart, Lock, Package, ChevronRight } from "lucide-react"
import { signOut } from "next-auth/react"

const actions = [
  { label: "My Orders", href: "/allorders", icon: Package },
  { label: "Address Book", href: "/addresses", icon: MapPin },
  { label: "My Wishlist", href: "/wishlist", icon: Heart },
  { label: "Change Password", href: "/reset-password", icon: Lock },
]

export default function ProfileActions() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">

      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-sm tracking-wide uppercase text-zinc-400">
          Quick Links
        </h3>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {actions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <ChevronRight size={15} className="text-zinc-300 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white transition" />
          </Link>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full text-red-500 hover:text-red-600 transition group">
          <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <LogOut size={15} />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </div>
  )
}