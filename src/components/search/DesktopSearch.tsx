"use client"

import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Product = {
  _id: string
  title: string
  imageCover: string
  price: number
}

const RECENT_KEY = "recent_searches"

function getRecent(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")
  } catch {
    return []
  }
}

function saveRecent(query: string) {
  const prev = getRecent().filter((q) => q !== query)
  const next = [query, ...prev].slice(0, 5)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

export default function DesktopSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("https://ecommerce.routemisr.com/api/v1/products?limit=100")
      .then((r) => r.json())
      .then((d) => setProducts(d.data))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!query.trim()) { setFiltered([]); setOpen(false); return }
      setFiltered(products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6))
      setOpen(true)
    }, 300)
    return () => clearTimeout(t)
  }, [query, products])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!filtered.length) return
    if (e.key === "ArrowDown") setActiveIndex((p) => (p + 1) % filtered.length)
    if (e.key === "ArrowUp") setActiveIndex((p) => (p <= 0 ? filtered.length - 1 : p - 1))
    if (e.key === "Enter" && activeIndex >= 0) {
      router.push(`/products/${filtered[activeIndex]._id}`)
      setOpen(false)
    }
    if (e.key === "Escape") setOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    saveRecent(query)
    router.push(`/search?query=${query}`)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative hidden md:block">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-gray-100 dark:bg-white/10 rounded-full px-4 py-2 w-[320px] lg:w-[420px]"
      >
        <Search size={16} className="text-gray-400 mr-2 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products..."
          className="bg-transparent outline-none text-sm w-full"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setOpen(false) }}>
            <X size={14} className="text-gray-400 hover:text-gray-600 transition" />
          </button>
        )}
      </form>

      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-3 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2">
          {filtered.map((p, i) => (
            <div
              key={p._id}
              onClick={() => { router.push(`/products/${p._id}`); setOpen(false) }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                i === activeIndex ? "bg-gray-100 dark:bg-white/10" : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <img src={p.imageCover} className="w-10 h-10 object-cover rounded-lg" alt={p.title} />
              <div className="flex flex-col min-w-0">
                <span className="text-sm truncate">{p.title}</span>
                <span className="text-xs text-green-600 font-medium">${p.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}