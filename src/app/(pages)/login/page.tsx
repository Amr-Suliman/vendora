"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { KeyRound, Loader2, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum length is 6 characters"),
})

type FormFields = z.infer<typeof formSchema>

export default function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: FormFields) {
    setIsLoading(true)
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/products",
      redirect: true,
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-2 lg:mt-5 sm:px-2">
      {/* LEFT — Image Side */}
      <div className="hidden lg:flex relative overflow-hidden bg-black h-[600px] rounded-sm">
        <img
          src="/images/women/bc.webp"
          alt="Fashion"
          className="w-full h-full object-cover opacity-60"/>
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="text-white text-2xl font-extrabold tracking-wide">
            VEND◯RA
          </Link>
          <div>
            <p className="text-white/60 text-xs tracking-widest uppercase mb-3">
              Welcome back
            </p>
            <h2 className="text-white font-extrabold text-4xl xl:text-5xl leading-tight mb-4">
              Your style,<br />your story.
            </h2>
            <p className="text-white/60 text-sm max-w-xs">
              Sign in to access your orders, wishlist, and exclusive deals.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — Form Side */}
      <div className="flex items-center justify-center px-3 py-8 bg-white dark:bg-neutral-950">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* HEADER */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase -mt-15 mb-2">
              Sign in
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back
            </h1>
            <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Invalid email or password
              </p>
            </motion.div>
          )}

          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

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
                        <Input
                          placeholder="amr@example.com"
                          autoComplete="email"
                          className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white transition"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1.5">
                      <FormLabel className="text-sm font-semibold">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-zinc-400 hover:text-black dark:hover:text-white transition">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white transition"
                          {...field}/>
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
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

            </form>
          </Form>

          {/* REGISTER */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-black dark:text-white hover:underline underline-offset-4 transition">
              Create one
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  )
}