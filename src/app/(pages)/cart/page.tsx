"use client"

import { useContext, useState } from "react"
import { CartContext } from "@/components/context/CartContext"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { CartResponse } from "@/interfaces"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import CheckOut from "@/components/checkOut/CheckOut"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const API_URL = "https://ecommerce.routemisr.com/api/v2/cart"

export default function CartPage() {
  const { cartData, isLoading, setCartData } = useContext(CartContext)
  const { data: session } = useSession()
  const router = useRouter()

  const products = cartData?.data?.products || []
  const totalPrice = cartData?.data?.totalCartPrice || 0
  const totalItems = cartData?.numOfCartItems || 0
  const token = session?.token

  const [removingId, setRemovingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Products skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border">
                <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-24 rounded-lg mt-2" />
                </div>
                <Skeleton className="h-5 w-16 flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl p-6 space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>

        </div>
      </div>
    )
  }

  // Update item quantity
  async function updateCartItem(productId: string, count: number) {
    if (!cartData || !token || count < 1) return

    setUpdatingId(productId)
    const toastId = toast.loading("Updating cart...")

    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ count }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Update failed", { id: toastId })
        return
      }

      setCartData(data)
      toast.success("Cart updated", { id: toastId })
    } catch {
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setUpdatingId(null)
    }
  }

  // Remove single item
  async function removeCartItem(productId: string) {
    if (!cartData || !token) return

    setRemovingId(productId)
    const previousCart = cartData
    const toastId = toast.loading("Removing product...")

    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: { token, "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error()

      const updatedProducts = products.filter((item) => item.product.id !== productId)
      const updatedCart: CartResponse = {
        ...cartData,
        data: {
          ...cartData.data,
          products: updatedProducts,
          totalCartPrice: updatedProducts.reduce((acc, item) => acc + item.price * item.count, 0),
        },
        numOfCartItems: updatedProducts.length,
      }

      setCartData(updatedCart)
      toast.success("Removed successfully ", { id: toastId })
    } catch {
      toast.error("Something went wrong ", { id: toastId })
      setCartData(previousCart)
    } finally {
      setRemovingId(null)
    }
  }

  // Clear entire cart with optimistic UI + undo
  async function clearCart() {
    if (!cartData || !token || products.length === 0) return

    const previousCart = cartData
    setClearing(true)

    // Small delay so loader shows before products disappear
    await new Promise(resolve => setTimeout(resolve, 400))

    setCartData({
      status: "success",
      message: "Cart cleared",
      cartId: null,
      numOfCartItems: 0,
      data: { products: [], totalCartPrice: 0 },
    })

    const toastId = toast.success("Cart cleared", {
      description: "You can undo this action",
      action: {
        label: "Undo",
        onClick: async () => {
          setCartData(previousCart)

          // Re-add all products to cart on server
          try {
            await Promise.all(
              previousCart.data.products.map(item =>
                fetch("https://ecommerce.routemisr.com/api/v2/cart", {
                  method: "POST",
                  headers: { token, "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: item.product.id }),
                })
              )
            )
            toast.success("Cart restored 🛒")
          } catch {
            toast.error("Failed to restore cart ❌")
          }
        },
      },
      duration: 5000,
    })

    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { token, "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
    } catch {
      setCartData(previousCart)
      toast.error("Failed to clear cart", { id: toastId })
    } finally {
      setClearing(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="px-2 sm:px-6 lg:px-0">
        <h1 className="text-3xl font-bold tracking-tight pt-5 text-black dark:text-white">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">{totalItems} items in your cart</p>
      </div>

      <div className="container mx-auto px-1 sm:px-6 lg:px-0 py-5 grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16">

        {/* Products list */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {products.length === 0 ? (
              <motion.div
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20">
                <h2 className="text-2xl font-bold text-black dark:text-white">Your cart is empty 🛒</h2>
              </motion.div>
            ) : (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {products.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border shadow-sm">
                      {/* Product image */}
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0" />

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-lg truncate text-black dark:text-white">{item.product.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{item.product.brand.name} • {item.product.category.name}</p>

                        {/* Price — mobile only */}
                        <p className="font-bold text-sm mt-1 sm:hidden">{item.price}.00 $</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                          <Button
                            variant="outline"
                            className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                            disabled={item.count === 1 || updatingId === item.product.id}
                            onClick={() => updateCartItem(item.product.id, item.count - 1)}
                          >-</Button>
                          <span className="text-sm text-black dark:text-white">{item.count}</span>
                          <Button
                            variant="outline"
                            className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                            disabled={updatingId === item.product.id || item.count >= item.product.quantity}
                            onClick={() => updateCartItem(item.product.id, item.count + 1)}
                          >+</Button>
                        </div>
                      </div>

                      {/* Price + Remove — desktop */}
                      <div className="hidden sm:flex sm:flex-col items-end gap-2 flex-shrink-0">
                        <p className="font-bold text-lg text-black dark:text-white mr-2.5">{item.price}.00 $</p>
                        <Button
                          onClick={() => removeCartItem(item.product.id)}
                          disabled={removingId === item.product.id}
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-1.5 text-sm font-medium px-3">
                          {removingId === item.product.id ? (
                            <div className="w-4 h-4 border-2 border-red-500/70 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <><Trash2 size={14} />Remove</>
                          )}
                        </Button>
                      </div>

                      {/* Remove icon — mobile only */}
                      <Button
                        onClick={() => removeCartItem(item.product.id)}
                        disabled={removingId === item.product.id}
                        variant="ghost"
                        size="icon"
                        className="sm:hidden text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex-shrink-0">
                        {removingId === item.product.id ? (
                          <div className="w-4 h-4 border-2 border-red-600/70 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1 space-y-3 mt-6 lg:mt-0">
          <div className="border rounded-xl p-6 shadow-sm h-fit bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Order Summary</h2>

            <div className="flex justify-between mb-2 text-muted-foreground">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-semibold text-black dark:text-white">{totalPrice}.00 $</span>
            </div>

            <div className="flex justify-between mb-2 text-muted-foreground">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>

            <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

            <div className="flex justify-between font-bold text-lg text-black dark:text-white">
              <span>Total</span>
              <span>{totalPrice}.00 $</span>
            </div>

            {/* Checkout */}
            {cartData?.cartId && <CheckOut cartId={cartData.cartId} />}

            <Button variant="outline" className="w-full mt-3" onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
          </div>

          {/* Clear cart */}
          <Button
            variant="outline"
            onClick={clearCart}
            disabled={products.length === 0 || clearing}
            className="ml-auto text-destructive flex items-center gap-2 -mt-1">
            {clearing ? (
              <div className="w-4 h-4 border-2 border-red-600/70 border-t-red-600 rounded-full animate-spin" />
            ) : (
              <><Trash2 size={18} />Clear Cart</>
            )}
          </Button>
        </div>

      </div>
    </>
  )
}