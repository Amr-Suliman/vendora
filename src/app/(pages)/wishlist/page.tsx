"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { HeartOff, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import AddToCart from "@/components/addToCart/AddToCart"
import { Skeleton } from "@/components/ui/skeleton"
import MyStarIcon from "@/components/myStarIcon/myStarIcon"
import { WishlistProduct } from "@/interfaces/wishlist"

const WISHLIST_URL = "https://ecommerce.routemisr.com/api/v1/wishlist"

export default function WishlistPage() {
  const { data: session, status } = useSession()

  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Fetch wishlist on mount
  useEffect(() => {
    if (status !== "authenticated") return
    const token = session?.token
    if (!token) return

    async function getWishlist() {
      try {
        const res = await fetch(WISHLIST_URL, { headers: { token } })
        const data = await res.json()
        setWishlist(data.data)
      } catch {
        toast.error("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }

    getWishlist()
  }, [status, session])

  // Remove item with optimistic UI
  async function handleRemove(productId: string) {
    if (!session?.token) return

    setRemovingId(productId)
    setWishlist(prev => prev.filter(item => item._id !== productId))

    try {
      await fetch(`${WISHLIST_URL}/${productId}`, {
        method: "DELETE",
        headers: { token: session.token }
      })
      toast.success("Removed from wishlist")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setRemovingId(null)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5 pb-20 px-4 sm:px-6 md:px-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="group w-full border-none shadow-sm p-3">
            <Skeleton className="w-full h-56 rounded-lg mb-3" />
            <Skeleton className="w-3/4 h-5 mb-1 mx-auto" />
            <Skeleton className="w-1/2 h-4 mb-3 mx-auto" />
            <Skeleton className="w-full h-10 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  // Empty state
  if (wishlist.length === 0) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground">Start adding products you love ❤️</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 pb-20 px-4 sm:px-6 md:px-0">
      <AnimatePresence mode="popLayout">
        {wishlist.map(item => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="group w-full border-none shadow-none relative">

              {/* Product image + remove button */}
              <div className="relative rounded-lg overflow-hidden p-3 shadow-sm hover:shadow-md transition">
                <Image
                  src={item.imageCover}
                  alt={item.title}
                  width={220}
                  height={200}
                  className="w-full h-[200px] object-contain transition-transform duration-500 group-hover:scale-105 rounded-t-lg"
                />
                <button
                  onClick={() => handleRemove(item._id)}
                  disabled={removingId === item._id}
                  className="absolute top-2 right-2 z-10 text-red-500 bg-white rounded-full p-2 shadow hover:scale-110 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {removingId === item._id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  ) : (
                    <HeartOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Product info */}
              <CardHeader className="flex flex-col items-center justify-center gap-1 -mb-3">
                <CardTitle className="font-semibold line-clamp-1 text-center">{item.brand.name}</CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-1 text-center">{item.title}</CardDescription>
              </CardHeader>

              {/* Price + Rating + Add to cart */}
              <CardContent className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <MyStarIcon key={i} filled={i <= Math.floor(item.ratingsAverage)} />
                    ))}
                  </div>
                  <p className="font-bold text-lg">${item.price}</p>
                </div>
                <div className="w-full">
                  <AddToCart productId={item._id} />
                </div>
              </CardContent>

            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}