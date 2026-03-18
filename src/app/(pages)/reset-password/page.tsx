"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, KeyRound, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  password: z.string().min(6, "Minimum 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormFields = z.infer<typeof formSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail")
    if (!storedEmail) {
      toast.error("Invalid reset flow")
      router.replace("/forgot-password")
      return
    }
    setEmail(storedEmail)
  }, [router])

  async function onSubmit(values: FormFields) {
    if (!email) return
    setIsLoading(true)
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword: values.password }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to reset password")
        return
      }
      toast.success("Password reset successfully ✅")
      localStorage.removeItem("resetEmail")
      setTimeout(() => signOut({ callbackUrl: "/login" }), 800)
    } catch {
      toast.error("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 -mt-5 bg-white dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
            Security
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Reset Password
          </h1>
          <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Enter your new password below.
          </p>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL — read only */}
            <FormItem>
              <FormLabel className="text-sm font-semibold">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    value={email ?? ""}
                    disabled
                    className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 cursor-not-allowed"
                  />
                </div>
              </FormControl>
            </FormItem>

            {/* NEW PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="password"
                        className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white transition"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="password"
                        className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white transition"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

          </form>
        </Form>
      </motion.div>
    </div>
  )
}