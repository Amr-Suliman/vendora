"use client"

import { Star, Heart as HeartIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { newArrivals } from "@/data/newArrivals"
import AddToCart from "../addToCart/AddToCart"
import { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

type Props = {
  limit?: number
  carousel?: boolean
}

export default function NewArrivalsSection({ limit, carousel }: Props) {
  const products = limit ? newArrivals.slice(0, limit) : newArrivals

  const [wishlist, setWishlist] = useState<number[]>([])
  const [loadingIds, setLoadingIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  function handleWishlist(id: number) {
    setLoadingIds(prev => [...prev, id])
    setTimeout(() => {
      setWishlist(prev =>
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      )
      setLoadingIds(prev => prev.filter(pid => pid !== id))
    }, 500)
  }

  // ===== SKELETON =====
  if (loading) {
    return (
      <div className="container mx-auto px-4 mb">
        <div className="mb-10 mt-3">
          <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
            Just In
          </p>
          <h2 className="font-extrabold text-4xl tracking-tight">
            NEW ARRIVALS
          </h2>
          <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
        </div>

        {/* Skeleton Mobile Carousel */}
        <div className="flex md:hidden gap-4 overflow-hidden">
          {Array.from({ length: limit ?? 4 }).map((_, i) => (
            <Card key={i} className="min-w-[75%] border-none shadow-sm p-3">
              <Skeleton className="w-full h-[250px] rounded-xl mb-3" />
              <Skeleton className="w-3/4 h-5 mx-auto mb-2" />
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="w-4 h-4 rounded-full" />
                ))}
              </div>
              <Skeleton className="w-1/3 h-5 mx-auto mb-3 rounded" />
              <Skeleton className="w-full h-10 rounded" />
            </Card>
          ))}
        </div>

        {/* Skeleton Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {Array.from({ length: limit ?? 4 }).map((_, i) => (
            <Card key={i} className="border-none shadow-sm p-3">
              <Skeleton className="w-full h-[300px] rounded-xl mb-3" />
              <Skeleton className="w-3/4 h-5 mx-auto mb-2" />
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="w-4 h-4 rounded-full" />
                ))}
              </div>
              <Skeleton className="w-1/3 h-5 mx-auto mb-3 rounded" />
              <Skeleton className="w-full h-10 rounded" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // ===== PRODUCT CARD =====
  const ProductCard = ({ product }: { product: typeof products[0] }) => {
    const inWishlist = wishlist.includes(product.id)
    const wishlistLoading = loadingIds.includes(product.id)

    return (
      <div className="group relative mb-10">
        {/* IMAGE + WISHLIST */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110" />
          <button
            onClick={() => handleWishlist(product.id)}
            disabled={wishlistLoading}
            className="absolute top-2 right-1 rounded-bl-lg z-10 bg-white dark:bg-zinc-800 p-2 shadow hover:scale-110 transition"
          >
            {wishlistLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <HeartIcon
                className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  }`} />
            )}
          </button>
        </div>

        {/* NAME */}
        <h3 className="mt-3 font-semibold text-center">{product.name}</h3>

        {/* RATING */}
        <div className="flex justify-center text-yellow-500 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < product.rating ? "currentColor" : "none"} />
          ))}
        </div>

        {/* PRICE */}
        <div className="mt-2 flex justify-center items-center gap-3 mb-3">
          <span className="font-bold text-xl">${product.price}</span>
        </div>

        <AddToCart productId={product.id.toString()} />
      </div>
    )
  }

  // ===== MAIN RETURN =====
  return (
    <div className="container mx-auto px-2 pt-3">
      <div className="mb-10 mt-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
          Just In
        </p>
        <h2 className="font-extrabold text-4xl tracking-tight">
          NEW ARRIVALS
        </h2>
        <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
      </div>

      {/* MOBILE: Carousel */}
      <div className="md:hidden ml-3">
        <Carousel opts={{ align: "start", dragFree: true }}>
          <CarouselContent>
            {products.map(product => (
              <CarouselItem key={product.id} className="basis-3/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* DESKTOP: Grid */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}