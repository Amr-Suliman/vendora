"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PackageCheck, ShoppingBag, CheckCircle2, Truck, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/* ================= TYPES ================= */
interface Order {
  _id: string
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  createdAt: string
  cartItems: {
    _id: string
    count: number
    price: number
    product: {
      id: string
      title: string
      imageCover: string
    }
  }[]
}

/* ================= PROGRESS STEPS ================= */
const steps = [
  { label: "Order Placed", icon: ShoppingBag },
  { label: "Processing", icon: Clock },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
]

function OrderProgress({ createdAt }: { createdAt: string }) {
  const daysSince = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const currentStep = Math.min(daysSince, 3)

  return (
    <div className="px-6 py-5 border-t">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200 dark:bg-neutral-700 mx-8" />
        <div
          className="absolute top-4 left-0 h-[2px] bg-black dark:bg-white transition-all duration-500 mx-8"
          style={{ width: `${(currentStep / (steps.length - 1)) * 85}%` }} />

        {steps.map((step, i) => {
          const Icon = step.icon
          const done = i <= currentStep
          return (
            <div key={i} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${done
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-200 dark:bg-neutral-700 text-gray-400"
                }`}>
                <Icon size={14} />
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${done ? "text-black dark:text-white" : "text-gray-400"
                }`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ================= SKELETON ================= */
function OrdersSkeleton() {
  return (
    <div className="container mx-auto py-20 space-y-6 px-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-neutral-900 border rounded-2xl p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded" />
          </div>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-neutral-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ================= PAGE ================= */
export default function AllOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  function getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.id
    } catch { return null }
  }

  useEffect(() => {
    if (status !== "authenticated" || !session?.token) return

    async function getOrders() {
      try {
        if (!session?.token) return
        const userId = getUserIdFromToken(session.token)
        if (!userId) return

        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
          { headers: { "Content-Type": "application/json", token: session.token } }
        )
        const result = await res.json()
        setOrders(result.data ?? result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [status])

  function handleCancelOrder(orderId: string) {
    setOrders(prev => prev.filter(o => o._id !== orderId))
    toast.success("Order removed from your list", {
    })
  }

  if (status === "loading" || loading) return <OrdersSkeleton />

  /* ================= EMPTY ================= */
  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-32 text-center px-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <PackageCheck size={42} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Once you place your first order, it will appear here.
        </p>
        <Button asChild size="lg">
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    )
  }

  /* ================= UI ================= */
  return (
    <div className="container mx-auto pt-10 mb-10 px-4 space-y-6">

      {/* PROMO BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-zinc-800 to-pink-900 p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Buy 5 Products & Get a Free Gift 🎁</h2>
          <p className="text-sm opacity-80">Limited time offer — shop more & save more</p>
        </div>
        <Button variant="secondary" className="font-semibold text-black dark:bg-zinc-500 w-fit" asChild>
          <a href="/products">Shop Now</a>
        </Button>
      </div>

      <h1 className="text-3xl font-bold">My Orders</h1>

      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            layout
            key={order._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border overflow-hidden">
            {/* ===== HEADER ===== */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50 dark:bg-neutral-800 border-b">
              <div className="flex flex-wrap items-center gap-3">
                <Package size={16} className="text-muted-foreground" />
                <span className="text-sm font-bold text-blue-600">#{order._id.slice(-8)}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toDateString()}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${order.isPaid
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                  {order.isPaid ? "✓ Paid" : "Cash on Delivery"}
                </span>
              </div>
              <Button size="sm" className="rounded-full bg-black dark:bg-zinc-700 text-white text-xs px-4">
                Track Order
              </Button>
            </div>

            {/* ===== PRODUCTS ===== */}
            <div className="divide-y">
              {order.cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 px-6 py-4 items-center">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.count}</p>
                  </div>
                  <span className="font-bold text-sm flex-shrink-0">${item.price}</span>
                </div>
              ))}
            </div>

            {/* ===== PROGRESS BAR ===== */}
            <OrderProgress createdAt={order.createdAt} />

            {/* ===== FOOTER ===== */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t bg-gray-50 dark:bg-neutral-800">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={order.isPaid}
                    className={`text-sm transition ${order.isPaid
                      ? "cursor-not-allowed opacity-40 text-muted-foreground"
                      : "text-red-500 hover:text-red-600 hover:underline"
                      }`}>
                    Cancel Order
                  </button>
                </AlertDialogTrigger>

                {!order.isPaid && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the order from your view. To fully cancel, please contact support.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep it</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleCancelOrder(order._id)}>
                        Yes, cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>

              <span className="font-bold text-base">${order.totalOrderPrice}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}