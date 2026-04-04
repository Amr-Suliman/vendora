// components/SearchInput.tsx
"use client"

import { Search, X, Clock, TrendingUp, ArrowUpLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import { ProductI } from "@/interfaces/product";


const TRENDING = ["iPhone", "Nike shoes", "Laptop", "Headphones", "Watch"]
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

function removeRecent(query: string) {
  const next = getRecent().filter((q) => q !== query)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

/* ─────────────────────────────────────────
   DESKTOP: same as before — inline dropdown
───────────────────────────────────────── */
export default function DesktopSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<ProductI[]>([])
  const [filtered, setFiltered] = useState<ProductI[]>([])
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
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${i === activeIndex ? "bg-gray-100 dark:bg-white/10" : "hover:bg-gray-50 dark:hover:bg-white/5"
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

/* ─────────────────────────────────────────
   MOBILE: Full Screen Overlay
───────────────────────────────────────── */
interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<ProductI[]>([])
  const [filtered, setFiltered] = useState<ProductI[]>([])
  const [recent, setRecent] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch products once
  useEffect(() => {
    fetch("https://ecommerce.routemisr.com/api/v1/products?limit=100")
      .then((r) => r.json())
      .then((d) => setProducts(d.data))
  }, [])

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setRecent(getRecent())
      // Delay focus slightly so animation starts first
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      // Wait for close animation before unmounting
      const t = setTimeout(() => {
        setIsVisible(false)
        setQuery("")
        setFiltered([])
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (!query.trim()) { setFiltered([]); return }
      setFiltered(
        products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
      )
    }, 300)
    return () => clearTimeout(t)
  }, [query, products])

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  function handleSelectProduct(id: string) {
    router.push(`/products/${id}`)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    saveRecent(query)
    router.push(`/search?query=${query}`)
    onClose()
  }

  function handleSelectSuggestion(text: string) {
    setQuery(text)
    inputRef.current?.focus()
  }

  function handleDeleteRecent(e: React.MouseEvent, text: string) {
    e.stopPropagation()
    removeRecent(text)
    setRecent(getRecent())
  }

  if (!isVisible) return null

  const showSuggestions = !query.trim()
  const showResults = query.trim() && filtered.length > 0
  const showNoResults = query.trim() && filtered.length === 0

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-zinc-950 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/10">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-gray-100 dark:bg-white/10 rounded-full px-4 py-2.5 gap-2">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="bg-transparent outline-none text-sm w-full"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="shrink-0">
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </form>
      </div>

      {/* ── Body (scrollable) ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">

        {/* Suggestions (recent + trending) */}
        {showSuggestions && (
          <div className="px-4 pt-4 space-y-5">

            {/* Recent Searches */}
            {recent.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent</h3>
                  <button
                    onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]) }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                    Clear all
                  </button>
                </div>
                <ul className="space-y-0.5">
                  {recent.map((item) => (
                    <li
                      key={item}
                      onClick={() => handleSelectSuggestion(item)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                    >
                      <Clock size={15} className="text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm">{item}</span>
                      <button
                        onClick={(e) => handleDeleteRecent(e, item)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <X size={12} className="text-gray-400" />
                      </button>
                      <ArrowUpLeft size={13} className="text-gray-300 shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trending */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trending</h3>
              <ul className="space-y-0.5">
                {TRENDING.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleSelectSuggestion(item)}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <TrendingUp size={15} className="text-green-500 shrink-0" />
                    <span className="flex-1 text-sm">{item}</span>
                    <ArrowUpLeft size={13} className="text-gray-300 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div>
            <p className="px-4 py-3 text-xs text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>
            <ul>
              {filtered.map((p) => (
                <li
                  key={p._id}
                  onClick={() => handleSelectProduct(p._id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors active:bg-gray-100 dark:active:bg-white/10"
                >
                  <img
                    src={p.imageCover}
                    alt={p.title}
                    className="w-14 h-14 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex flex-col min-w-0 gap-0.5">
                    <span className="text-sm font-medium leading-snug line-clamp-2">{p.title}</span>
                    <span className="text-sm text-green-600 font-semibold">${p.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Results */}
        {showNoResults && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">No results found</p>
            <p className="text-sm text-gray-400">Try a different keyword</p>
          </div>
        )}

      </div>
    </div>
  )
}