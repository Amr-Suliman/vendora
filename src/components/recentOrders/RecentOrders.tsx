"use client"

import { useEffect, useState } from "react"
import { PackageCheck, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Props = {
  userId: string
  token: string
}

export default function RecentOrders({ userId }: Props) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`)
        const result = await res.json()
        setOrders(result.data?.slice(0, 3) ?? [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <PackageCheck size={28} className="text-zinc-400" />
        </div>
        <h3 className="font-bold mb-1">No orders yet</h3>
        <p className="text-sm text-zinc-400 mb-5">Your orders will appear here once you shop.</p>
        <Button asChild size="sm" className="rounded-full px-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-sm tracking-wide uppercase text-zinc-400">
          Recent Orders
        </h3>
        <Link
          href="/allorders"
          className="flex items-center gap-1 text-xs font-semibold text-black dark:text-white hover:opacity-70 transition"
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      {/* ORDERS */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {orders.map((order) => (
          <div key={order._id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">

            {/* ICON */}
            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
              <PackageCheck size={18} className="text-zinc-500" />
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Order #{order._id.slice(-6)}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={10} className="text-zinc-400" />
                <p className="text-xs text-zinc-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-sm">{order.totalOrderPrice} EGP</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.isPaid
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                {order.isPaid ? "Paid" : "Cash"}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}