// MobileSearchOverlay.tsx
"use client"

import { Search, X, Clock, TrendingUp, ArrowUpLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ProductI } from "@/interfaces/product"
import { MobileSearchOverlayProps } from "@/interfaces/mobileSearch"
import { motion, AnimatePresence } from "framer-motion"

const TRENDING = ["iPhone", "Nike shoes", "Laptop", "Headphones", "Watch"]
const RECENT_KEY = "recent_searches"

function getRecent(): string[] {
    if (typeof window === "undefined") return []
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") }
    catch { return [] }
}

function saveRecent(query: string) {
    const prev = getRecent().filter((q) => q !== query)
    localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, 5)))
}

function removeRecent(query: string) {
    localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter((q) => q !== query)))
}


export function MobileSearchOverlay({ isOpen, onClose, topOffset = 64 }: MobileSearchOverlayProps) {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [products, setProducts] = useState<ProductI[]>([])
    const [filtered, setFiltered] = useState<ProductI[]>([])
    const [recent, setRecent] = useState<string[]>([])

    // ✅ KEY FIX: track the visual viewport height (shrinks when keyboard opens)
    const [viewportHeight, setViewportHeight] = useState<number>(
        typeof window !== "undefined" ? window.innerHeight : 0
    )

    const inputRef = useRef<HTMLInputElement>(null)

    /* ── Fetch products ── */
    useEffect(() => {
        fetch("https://ecommerce.routemisr.com/api/v1/products?limit=100")
            .then((r) => r.json())
            .then((d) => setProducts(d.data))
    }, [])

    /* ── visualViewport listener — updates height when keyboard appears/disappears ── */
    useEffect(() => {
        const vv = window.visualViewport
        if (!vv) return

        const update = () => setViewportHeight(vv.height)
        vv.addEventListener("resize", update)
        update() // set initial value

        return () => vv.removeEventListener("resize", update)
    }, [])

    /* ── Open / close animation ── */
    useEffect(() => {
        if (isOpen) {
            setRecent(getRecent())
            setTimeout(() => inputRef.current?.focus(), 150)
        } else {
            setTimeout(() => { setQuery(""); setFiltered([]) }, 300)
        }
    }, [isOpen])

    /* ── Debounced search ── */
    useEffect(() => {
        const t = setTimeout(() => {
            if (!query.trim()) { setFiltered([]); return }
            setFiltered(
                products
                    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 8)
            )
        }, 300)
        return () => clearTimeout(t)
    }, [query, products])

    /* ── Lock body scroll ── */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
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
        // ✅ بعد ما يختار suggestion، الـ keyboard يفضل مفتوح
        setTimeout(() => inputRef.current?.focus(), 50)
    }

    function handleDeleteRecent(e: React.MouseEvent, text: string) {
        e.stopPropagation()
        removeRecent(text)
        setRecent(getRecent())
    }


    const showSuggestions = !query.trim()
    const showResults = !!query.trim() && filtered.length > 0
    const showNoResults = !!query.trim() && filtered.length === 0

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.99 }}
                    transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                    className="fixed inset-x-0 z-[9999] flex flex-col bg-white dark:bg-zinc-950"
                    style={{ top: topOffset, height: `calc(100dvh - ${topOffset}px)` }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/10 shrink-0">
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
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
                                enterKeyHint="search"
                            />
                            {query && (
                                <button type="button" onClick={() => setQuery("")} className="shrink-0">
                                    <X size={14} className="text-gray-400" />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">

                        {/* Suggestions */}
                        {showSuggestions && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                                className="px-4 pt-4 space-y-5"
                            >
                                {recent.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent</h3>
                                            <button onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]) }} className="text-xs text-gray-400 hover:text-gray-600 transition">
                                                Clear all
                                            </button>
                                        </div>
                                        <ul className="space-y-0.5">
                                            {recent.map((item, i) => (
                                                <motion.li
                                                    key={item}
                                                    initial={{ opacity: 0, x: -6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.12 + i * 0.04, duration: 0.18 }}
                                                    onClick={() => handleSelectSuggestion(item)}
                                                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                                                >
                                                    <Clock size={15} className="text-gray-400 shrink-0" />
                                                    <span className="flex-1 text-sm">{item}</span>
                                                    <button onClick={(e) => handleDeleteRecent(e, item)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                        <X size={12} className="text-gray-400" />
                                                    </button>
                                                    <ArrowUpLeft size={13} className="text-gray-300 shrink-0" />
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trending</h3>
                                    <ul className="space-y-0.5">
                                        {TRENDING.map((item, i) => (
                                            <motion.li
                                                key={item}
                                                initial={{ opacity: 0, x: -6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.14 + i * 0.05, duration: 0.18 }}
                                                onClick={() => handleSelectSuggestion(item)}
                                                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                            >
                                                <TrendingUp size={15} className="text-green-500 shrink-0" />
                                                <span className="flex-1 text-sm">{item}</span>
                                                <ArrowUpLeft size={13} className="text-gray-300 shrink-0" />
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {/* Results */}
                        {showResults && (
                            <div>
                                <p className="px-4 py-3 text-xs text-gray-400">
                                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
                                </p>
                                <ul>
                                    {filtered.map((p, i) => (
                                        <motion.li
                                            key={p._id}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04, duration: 0.18 }}
                                            onClick={() => handleSelectProduct(p._id)}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors active:bg-gray-100 dark:active:bg-white/10"
                                        >
                                            <img src={p.imageCover} alt={p.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                                            <div className="flex flex-col min-w-0 gap-0.5">
                                                <span className="text-sm font-medium leading-snug line-clamp-2">{p.title}</span>
                                                <span className="text-sm text-green-600 font-semibold">${p.price}</span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* No Results */}
                        {showNoResults && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center py-20 px-8 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white mb-1">No results found</p>
                                <p className="text-sm text-gray-400">Try a different keyword</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}