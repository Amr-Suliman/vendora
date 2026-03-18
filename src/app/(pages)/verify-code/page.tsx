"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
  resetCode: z.string().min(4, "Code must be at least 4 digits").max(6, "Code must be 6 digits"),
})

type FormFields = z.infer<typeof formSchema>

export default function VerifyCodePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { resetCode: "" },
  })

  async function onSubmit(values: FormFields) {
    setIsLoading(true)
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetCode: values.resetCode }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Invalid reset code")
        return
      }
      toast.success("Code verified successfully ✅")
      setTimeout(() => router.push("/reset-password"), 800)
    } catch {
      toast.error("Network error, try again")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 -mt-10 bg-white dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
            Verification
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Enter reset code
          </h1>
          <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Enter the 6-digit code we sent to your email.
          </p>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField
              control={form.control}
              name="resetCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Reset Code</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="123456"
                        className="pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white transition text-center tracking-[0.5em] text-lg font-bold"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

          </form>
        </Form>

        {/* BACK */}
        <div className="flex items-center justify-between mt-6">
          <Link
            href="/forgot-password"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:hover:text-white transition"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <Link
            href="/forgot-password"
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition"
          >
            Didn't receive the code? <span className="font-semibold underline underline-offset-4">Send again</span>
          </Link>
        </div>

      </motion.div>
    </div>
  )
}