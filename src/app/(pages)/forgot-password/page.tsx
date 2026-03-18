"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Mail, Loader2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type FormFields = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: FormFields) {
    setIsLoading(true)
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Something went wrong")
        return
      }
      localStorage.setItem("resetEmail", values.email)
      toast.success("Reset code sent to your email 📩")
      setTimeout(() => router.push("/verify-code"), 1000)
    } catch {
      toast.error("Network error, try again")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-2 -mt-10 bg-white dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
            Account Recovery
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Forgot password?
          </h1>
          <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Enter your email and we'll send you a reset code.
          </p>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-sm font-semibold"
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        </Form>

        {/* BACK TO LOGIN */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-zinc-500 hover:text-black dark:hover:text-white transition">
          <ArrowLeft size={14} />
          Back to login
        </Link>

      </motion.div>
    </div>
  )
}