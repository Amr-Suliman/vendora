"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface WishlistContextType {
  wishlist: string[]
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [wishlist, setWishlist] = useState<string[]>([])

  /* ================= GET ================= */
  useEffect(() => {
    if (status !== "authenticated") return
    const token = session?.token
    if (!token) return

    async function getWishlist() {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          headers: { token },
        }
      )
      const data = await res.json()
      setWishlist(data.data.map((p: any) => p._id))
    }

    getWishlist()
  }, [status, session])

  /* ================= ADD ================= */
  async function addToWishlist(productId: string) {
    if (!session?.token) return

    await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: session.token,
      },
      body: JSON.stringify({ productId }),
    })

    setWishlist((prev) => [...prev, productId])
  }

  /* ================= REMOVE ================= */
  async function removeFromWishlist(productId: string) {
    if (!session?.token) return

    await fetch(
      `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
      {
        method: "DELETE",
        headers: { token: session.token },
      }
    )

    setWishlist((prev) => prev.filter((id) => id !== productId))
  }

  function isInWishlist(productId: string) {
    return wishlist.includes(productId)
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

/* ================= HOOK ================= */
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider")
  return context
}