'use client'

import { HeartIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useWishlist } from "@/components/context/WishlistContext"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function WishList({ productId }: { productId: string }) {

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { status } = useSession()
  const router = useRouter()

  const [wishlistLoading, setWishlistLoading] = useState(false)
  const inWishlist = isInWishlist(productId)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (status !== "authenticated") {
      toast.info("Please login first")
      router.push("/login")
      return
    }

    setWishlistLoading(true)

    try {
      if (inWishlist) {
        await removeFromWishlist(productId)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(productId)
        toast.success("Added to wishlist")
      }

    } catch {
      toast.error("Something went wrong")
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <button
      onClick={handleWishlist}
      disabled={wishlistLoading}
      className="absolute top-2 right-1 rounded-full z-10 bg-white dark:bg-zinc-800 p-2 shadow hover:scale-110 transition">
      {wishlistLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      ) : (
        <HeartIcon
          className={`w-5 h-5 ${
            inWishlist
              ? 'fill-red-500 text-red-500'
              : 'text-muted-foreground'
          }`}
        />
      )}
    </button>
  )
}