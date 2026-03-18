"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Product = {
  _id: string
  title: string
  imageCover: string
  price: number
}

export default function SearchInput({ onClose, isMobile }: { onClose?: () => void, isMobile?: boolean }) {

  const router = useRouter()

  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    async function getProducts() {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/products?limit=100")
      const data = await res.json()
      setProducts(data.data)
    }
    getProducts()
  }, [])

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setFiltered([])
        return
      }
      const result = products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
      setFiltered(result.slice(0, 6))
      setOpen(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, products])

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  /* ================= KEYBOARD NAVIGATION ================= */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!filtered.length) return
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % filtered.length)
    }
    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => prev <= 0 ? filtered.length - 1 : prev - 1)
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      router.push(`/products/${filtered[activeIndex]._id}`)
      setOpen(false)
      onClose?.()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?query=${query}`)
    setOpen(false)
    onClose?.()
  }

  return (
    <div ref={searchRef} className={`relative ${isMobile ? "w-full" : "hidden md:block"}`}>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center bg-gray-100 dark:bg-white/10 rounded-full px-4 py-2 ${isMobile ? "w-full" : "w-[320px] lg:w-[420px]"}`}
      >
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products..."
          className="bg-transparent outline-none text-sm w-full"
          autoFocus={isMobile}
        />
      </form>

      {/* DROPDOWN */}
      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-3 w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2">
          {filtered.map((p, index) => (
            <div
              key={p._id}
              onClick={() => {
                router.push(`/products/${p._id}`)
                setOpen(false)
                onClose?.()
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                index === activeIndex
                  ? "bg-gray-100 dark:bg-white/10"
                  : "hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              <img src={p.imageCover} className="w-10 h-10 object-cover rounded" />
              <div className="flex flex-col">
                <span className="text-sm">{p.title}</span>
                <span className="text-xs text-green-600">{p.price} $</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}