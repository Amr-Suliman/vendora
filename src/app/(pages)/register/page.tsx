"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, User, Mail, KeyRound, Phone } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum length is 6 characters"),
  rePassword: z.string().min(6),
  phone: z.string().regex(/^01[0-2,5][0-9]{8}$/, "Invalid phone number"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
})

type FormFields = z.infer<typeof formSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
  })

  async function onSubmit(values: FormFields) {
    setIsLoading(true)
    setApiError(null)
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.message || "Something went wrong")
        return
      }
      router.push("/login")
    } catch {
      setApiError("Network error, try again")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 lg:mt-5">

      {/* LEFT — Image Side */}
      <div className="hidden lg:flex relative overflow-hidden bg-black h-[600px]">
        <img
          src="/images/women/bc.webp"
          alt="Fashion"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="text-white text-2xl font-extrabold tracking-wide">
            VEND◯RA
          </Link>
          <div>
            <p className="text-white/60 text-xs tracking-widest uppercase mb-3">
              Join us today
            </p>
            <h2 className="text-white font-extrabold text-4xl xl:text-5xl leading-tight mb-4">
              Start your<br />journey.
            </h2>
            <p className="text-white/60 text-sm max-w-xs">
              Create an account and get access to exclusive deals, wishlist, and more.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — Form Side */}
      <div className="flex items-center justify-center px-3 py-12 bg-white dark:bg-neutral-950 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* HEADER */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase -mt-15 mb-2">
              Get started
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Create account
            </h1>
            <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
          </div>

          {/* ERROR */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
            >
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {apiError}
              </p>
            </motion.div>
          )}

          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input placeholder="Amr Elgohary" className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input placeholder="amr@example.com" autoComplete="email" className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD + CONFIRM */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <Input type="password" className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Confirm</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <Input type="password" className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* PHONE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input placeholder="010xxxxxxxx" className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button
                type="submit"
                className="w-full h-12 rounded-full text-sm font-semibold mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

            </form>
          </Form>

          {/* LOGIN */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-black dark:text-white hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  )
}