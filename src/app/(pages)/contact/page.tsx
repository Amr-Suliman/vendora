"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Send, Mail, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()

      toast.success("Message sent successfully! ✅")
      setForm({ name: "", email: "", message: "" })
    } catch {
      toast.error("Failed to send message ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-lg pt-10 pb-20 px-2 mt-5">

      {/* HEADER */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
          Get in touch
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Contact Support</h1>
        <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
          Having an issue? Send us a message and we'll get back to you as soon as possible.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-black dark:focus:border-white transition"/>
        </div>

        {/* EMAIL */}
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-black dark:focus:border-white transition"/>
        </div>

        {/* MESSAGE */}
        <div className="relative">
          <MessageSquare size={16} className="absolute left-4 top-4 text-zinc-400" />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={5}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-black dark:focus:border-white transition resize-none"/>
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </Button>

      </form>
    </div>
  )
}