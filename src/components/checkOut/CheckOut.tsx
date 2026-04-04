"use client"

import React, { useContext, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { AddressContext } from "@/components/context/AddressContext"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, CreditCard, Banknote, CheckCircle2, Loader2, ChevronRight } from "lucide-react"

type Props = { cartId: string }

const STEPS = ["address", "payment", "success"] as const
type Step = typeof STEPS[number]

export default function CheckOut({ cartId }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const { selectedAddress } = useContext(AddressContext)

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("address")
  const [loadingMethod, setLoadingMethod] = useState<"visa" | "cash" | null>(null)

  // Form state
  const [form, setForm] = useState({
    details: selectedAddress?.details ?? "",
    city: selectedAddress?.city ?? "",
    phone: selectedAddress?.phone ?? "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleNext() {
    if (!form.details || !form.city || !form.phone) {
      toast.error("Please fill in all fields")
      return
    }
    const phoneRegex = /^01[0-9]{9}$/
    if (!phoneRegex.test(form.phone)) {
      toast.error("Invalid Egyptian phone number")
      return
    }
    setStep("payment")
  }

  async function handleCheckout(method: "visa" | "cash") {
    setLoadingMethod(method)

    const shippingAddress = {
      details: form.details,
      city: form.city,
      phone: form.phone,
    }

    try {
      const url = method === "visa"
        ? `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`
        : `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: session?.token as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingAddress }),
      })

      const data = await response.json()

      if (method === "visa" && data.session?.url) {
        window.location.href = data.session.url
        return
      }

      if (method === "cash") {
        setStep("success")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoadingMethod(null)
    }
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setTimeout(() => setStep("address"), 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full mt-3 h-12 rounded-full font-semibold bg-black text-white dark:bg-white dark:text-black">
          Proceed to Checkout
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">

        {/* ===== STEP INDICATOR ===== */}
        {step !== "success" && (
          <div className="flex items-center px-6 pt-6 pb-4 border-b gap-2">
            {[
              { key: "address", label: "Address", num: 1 },
              { key: "payment", label: "Payment", num: 2 },
            ].map((s, i) => (
              <React.Fragment key={s.key}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s.key
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : step === "payment" && s.key === "address"
                      ? "bg-green-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    }`}>
                    {step === "payment" && s.key === "address" ? "✓" : s.num}
                  </div>
                  <span className={`text-sm font-medium ${step === s.key ? "text-black dark:text-white" : "text-zinc-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i === 0 && <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700 mx-2" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ===== STEP 1: ADDRESS ===== */}
          {step === "address" && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-5 space-y-5">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-zinc-400" />
                <h2 className="font-bold text-lg">Shipping Address</h2>
              </div>

              {/* DETAILS */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Street Address</label>
                <input
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  placeholder="Street, building, floor..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-black dark:focus:border-white transition" />
              </div>

              {/* CITY */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Cairo, Alexandria..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-black dark:focus:border-white transition" />
              </div>

              {/* PHONE */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-black dark:focus:border-white transition" />
                <p className="text-xs text-zinc-400">Egyptian number only (01x)</p>
              </div>

              <Button
                onClick={handleNext}
                className="w-full h-12 rounded-full font-semibold flex items-center gap-2">
                Continue to Payment
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          )}

          {/* ===== STEP 2: PAYMENT ===== */}
          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={18} className="text-zinc-400" />
                <h2 className="font-bold text-lg">Payment Method</h2>
              </div>

              {/* ADDRESS SUMMARY */}
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 text-sm space-y-1">
                <p className="font-semibold text-xs text-zinc-400 uppercase tracking-wider mb-2">Delivering to</p>
                <p className="font-medium">{form.details}</p>
                <p className="text-zinc-500">{form.city} · {form.phone}</p>
              </div>

              {/* CASH */}
              <button
                onClick={() => handleCheckout("cash")}
                disabled={loadingMethod !== null}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition group" >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                    <Banknote size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-xs text-zinc-400">Pay when you receive</p>
                  </div>
                </div>
                {loadingMethod === "cash" ? (
                  <Loader2 size={16} className="animate-spin text-zinc-400" />
                ) : (
                  <ChevronRight size={16} className="text-zinc-300" />
                )}
              </button>

              {/* VISA */}
              <button
                onClick={() => handleCheckout("visa")}
                disabled={loadingMethod !== null}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                    <CreditCard size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Pay with Visa</p>
                    <p className="text-xs text-zinc-400">Secure online payment</p>
                  </div>
                </div>
                {loadingMethod === "visa" ? (
                  <Loader2 size={16} className="animate-spin text-zinc-400" />
                ) : (
                  <ChevronRight size={16} className="text-zinc-300" />
                )}
              </button>

              <button
                onClick={() => setStep("address")}
                className="text-sm text-zinc-400 hover:text-black dark:hover:text-white transition w-full text-center pt-1">
                ← Back to address
              </button>
            </motion.div>
          )}

          {/* ===== STEP 3: SUCCESS ===== */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-10 flex flex-col items-center text-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center" >
                <CheckCircle2 size={40} className="text-green-500" />
              </motion.div>

              <div>
                <h2 className="text-xl font-extrabold mb-1">Order Placed! 🎉</h2>
                <p className="text-sm text-zinc-500 max-w-xs">
                  Your cash on delivery order has been confirmed. You can track it from My Orders.
                </p>
              </div>

              <Button
                className="mt-2 w-full h-12 rounded-full font-semibold"
                onClick={() => {
                  setOpen(false)
                  router.push("/allorders")
                }}>
                View My Orders
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}