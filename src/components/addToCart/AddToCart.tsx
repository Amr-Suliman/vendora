'use client'

import React, { useContext, useState } from 'react'
import { CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { CartContext } from '../context/CartContext'
import { addToCartAction } from '@/app/(pages)/products/_action/addToCart.Action'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddToCart({ productId }: { productId: string }) {
  const { setCartData, isInCart } = useContext(CartContext)
  const { status } = useSession()
  const router = useRouter()

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthRedirecting, setIsAuthRedirecting] = useState(false)

  // Derived states
  const isAdded = isInCart(productId)
  const isButtonLoading = isLoading || isAuthRedirecting

  async function handleAddToCart() {
    // Already in cart — do nothing
    if (isAdded) return

    // Not logged in — redirect to login
    if (status !== 'authenticated') {
      setIsAuthRedirecting(true)
      toast.info("Redirecting to login...", { duration: 800 })
      setTimeout(() => router.push('/login'), 600)
      return
    }

    // Add to cart
    setIsLoading(true)
    const toastId = toast.loading("Adding product...")

    try {
      const data = await addToCartAction(productId)
      setCartData(data)
      toast.success("Product added successfully 🛒", { id: toastId })
    } catch (err: any) {
      toast.error(err.message || "Failed to add product ❌", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CardFooter className="w-full p-0 pt-2">
      <Button
        onClick={handleAddToCart}
        disabled={isButtonLoading}
        className={`w-full flex items-center justify-center gap-1.5 font-bold transition-all duration-300 ${
          isAdded
            ? "bg-white text-black border border-black hover:bg-white cursor-default dark:bg-zinc-900 dark:text-white dark:border-white"
            : ""
        }`}>
        {/* Button icon — spinner / checkmark / cart */}
        {isButtonLoading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : isAdded ? (
          // Checkmark icon
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : (
          // Cart icon
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        )}

        {/* Button label */}
        {isAuthRedirecting ? "Redirecting..." : isAdded ? "Added to Cart" : "Add To Cart"}
      </Button>
    </CardFooter>
  )
}