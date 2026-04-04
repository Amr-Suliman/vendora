"use client"

import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    motion,
    AnimatePresence,
} from "framer-motion"
import {
    Menu,
    X,
    ShoppingCart,
    User,
    Loader,
    Sun,
    Moon,
    LogOut,
    Search,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CartContext } from "../context/CartContext"
import { signOut, useSession } from "next-auth/react"
import AnnouncementBar from "@/components/layout/AnnouncementBar"
import DesktopSearch from "@/components/search/DesktopSearch";
import { MobileSearchOverlay } from "@/components/search/MobileSearchOverlay"
import { Heart } from "lucide-react"
import { ChevronDown } from "lucide-react"

const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "On Sale", href: "/on-sale" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Brands", href: "/brands" },
]

export default function Navbar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const { cartData, isLoading } = useContext(CartContext)

    // UI states
    const [menuOpen, setMenuOpen] = useState(false)
    const [userOpen, setUserOpen] = useState(false)
    const [shake, setShake] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [shopOpen, setShopOpen] = useState(false)

    // Announcement state
    const [announcementOpen, setAnnouncementOpen] = useState(true)
    const showAnnouncement = announcementOpen && status !== "authenticated"

    // Dark mode state
    const [mounted, setMounted] = useState(false)
    const [dark, setDark] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Refs
    const userRef = useRef<HTMLDivElement>(null)
    const firstItemRef = useRef<HTMLAnchorElement>(null)
    const shopRef = useRef<HTMLDivElement | null>(null)

    const [mobileShopOpen, setMobileShopOpen] = useState(false)


    // Close shop dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
                setShopOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Set mounted on client
    useEffect(() => setMounted(true), [])

    // Load saved theme or use system preference
    useEffect(() => {
        if (!mounted) return
        const saved = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setDark(saved ? saved === "dark" : prefersDark)
    }, [mounted])

    // Apply dark mode to document
    useEffect(() => {
        if (!mounted) return
        document.documentElement.classList.toggle("dark", dark)
        localStorage.setItem("theme", dark ? "dark" : "light")
    }, [dark, mounted])

    // Shake cart icon on new item
    useEffect(() => {
        if (cartData?.numOfCartItems) {
            setShake(true)
            const t = setTimeout(() => setShake(false), 400)
            return () => clearTimeout(t)
        }
    }, [cartData?.numOfCartItems])

    // Close user menu on outside click or ESC
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (userRef.current && !userRef.current.contains(e.target as Node)) {
                setUserOpen(false)
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setUserOpen(false)
        }
        if (userOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("keydown", handleEsc)
            setTimeout(() => firstItemRef.current?.focus(), 50)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEsc)
        }
    }, [userOpen])

    if (!mounted) return <div className="h-16" />

    return (
        <>
            {showAnnouncement && (
                <AnnouncementBar onClose={() => setAnnouncementOpen(false)} />
            )}

            {/* ================= NAVBAR ================= */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`fixed ${showAnnouncement ? "top-10" : "top-0"} left-0 z-40 w-full dark:bg-black/60 backdrop-blur-xl border-b border-black/5 dark:border-white/10`}>
                <div className="container mx-auto px-4 h-16 flex items-center gap-9">

                    {/* Left side */}
                    <div className="flex items-center gap-2">
                        <button
                            className="md:hidden pt-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => setMenuOpen(true)}>
                            <Menu size={26} />
                        </button>
                        <Link href="/" className="logo">VEND◯RA</Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            const active = pathname === link.href
                            if (link.name === "Shop") {
                                return (
                                    <div key={link.name} className="relative" ref={shopRef}>
                                        <button
                                            onClick={() => setShopOpen(!shopOpen)}
                                            className={`flex items-center transition ${active ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}>
                                            {link.name}
                                            <motion.span
                                                animate={{ rotate: shopOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-1 flex items-center"
                                            >
                                                <ChevronDown size={16} />
                                            </motion.span>
                                        </button>
                                        <AnimatePresence>
                                            {shopOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-8 left-0 bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-3 w-44 border">
                                                    <Link href="/products" onClick={() => setShopOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">All Products</Link>
                                                    <Link href="/categories/men's-fashion" onClick={() => setShopOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">Men</Link>
                                                    <Link href="/categories/women's-fashion" onClick={() => setShopOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">Women</Link>
                                                    <Link href="/categories/electronics" onClick={() => setShopOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">Electronics</Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            }
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative transition ${active ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}>
                                    {link.name}
                                    {active && (
                                        <motion.span layoutId="activeLink" className="absolute -bottom-1 left-0 w-full h-0.5 bg-black dark:bg-white" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 ml-auto">

                        {/* SearchInput Desktop */}
                        <DesktopSearch />
                        {/* Dark mode */}
                        <button onClick={() => setDark(!dark)} className="hidden md:block rounded-md hover:bg-black/5 dark:hover:bg-white/10">
                            {dark ? <Sun size={23} /> : <Moon size={23} />}
                        </button>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden md:flex hover:scale-110 transition">
                            <Heart size={22} />
                        </Link>

                        {/* Mobile Search Button */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileSearchOpen(p => !p)}>
                            <Search size={22} />
                        </button>

                        {/* Cart */}
                        {status === "authenticated" && (
                            <Link href="/cart" className="relative mt-0.5">
                                <motion.div
                                    animate={shake ? { rotate: [0, -10, 10, -10, 0] } : {}}
                                    transition={{ duration: 0.4 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </motion.div>

                                <div className="absolute -top-3 -right-2.5">
                                    {isLoading ? (
                                        <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-white/20 animate-pulse block" />
                                    ) : !!cartData?.numOfCartItems ? (
                                        <Badge className="rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {cartData.numOfCartItems}
                                        </Badge>
                                    ) : null}
                                </div>
                            </Link>
                        )}

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-2">
                            {status === "authenticated" && session?.user?.name && (
                                <button
                                    onClick={() => setMenuOpen(true)}
                                    className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                                    Hi, <span className="ml-1 font-semibold">{session.user.name.split(" ")[0]}</span>
                                </button>
                            )}

                            {/* USER MENU */}
                            <div ref={userRef} className="relative -mt-1 pl-1">
                                <button
                                    onClick={() => setUserOpen(p => !p)}
                                    className="cursor-pointer w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-sm font-bold hover:opacity-80 transition">
                                    {session?.user?.name?.[0] ?? <User size={16} />}
                                </button>

                                <AnimatePresence>
                                    {userOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.92, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.92, y: -10 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            className="absolute right-0 mt-2 z-50 w-56 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
                                            {status === "authenticated" ? (
                                                <>
                                                    <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900">
                                                        <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
                                                        <p className="text-xs text-zinc-400 truncate mt-0.5">{session?.user?.email}</p>
                                                    </div>
                                                    <div className="py-1.5">
                                                        <Link ref={firstItemRef} href="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                            <User size={15} className="text-zinc-400" />My Profile
                                                        </Link>
                                                        <Link href="/allorders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                            <ShoppingCart size={15} className="text-zinc-400" />My Orders
                                                        </Link>
                                                        <Link href="/wishlist" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                            <Heart size={15} className="text-zinc-400" />My Wishlist
                                                        </Link>
                                                        <Link href="/cart" onClick={() => setUserOpen(false)} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                            <div className="flex items-center gap-2.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-zinc-400">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                                </svg>
                                                                My Cart
                                                            </div>
                                                            {!!cartData?.numOfCartItems && (
                                                                <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                                                    {cartData.numOfCartItems}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </div>
                                                    <div className="h-px bg-black/5 dark:bg-white/10" />
                                                    <div className="py-1.5">
                                                        <button
                                                            onClick={() => { setUserOpen(false); signOut({ callbackUrl: "/" }) }}
                                                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" >
                                                            <LogOut size={15} />Logout
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="p-3 flex flex-col gap-2">
                                                    <Link ref={firstItemRef} href="/login" onClick={() => setUserOpen(false)} className="block text-center text-sm font-semibold py-2.5 rounded-xl border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Login</Link>
                                                    <Link href="/register" onClick={() => setUserOpen(false)} className="block text-center text-sm font-semibold py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">Register</Link>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            <MobileSearchOverlay
                isOpen={mobileSearchOpen}
                onClose={() => setMobileSearchOpen(false)}
            />

            <div className={`transition-all duration-300 ease-in-out ${showAnnouncement ? "h-[104px]" : "h-16"}`} />

            {/* ================= MOBILE DRAWER ================= */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            onClick={() => setMenuOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 260, damping: 30 }}
                            className="fixed left-0 top-0 z-50 h-full w-[80%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between px-6 h-20 border-b border-black/10 dark:border-white/10">
                                <Link href="/" onClick={() => setMenuOpen(false)} className="logo text-lg">VEND◯RA</Link>
                                <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition">
                                    <X size={20} />
                                </button>
                            </div>

                            {status === "authenticated" ? (
                                <div className="flex items-center gap-3 px-6 py-5 border-b border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900">
                                    <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {session?.user?.name?.[0] ?? <User size={16} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{session?.user?.name}</p>
                                        <p className="text-xs text-zinc-400 truncate">{session?.user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3 px-6 py-5 border-b border-black/10 dark:border-white/10">
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Login</Link>
                                    <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">Register</Link>
                                </div>
                            )}

                            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                                <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 px-3 mb-3">Navigation</p>
                                <ul className="flex flex-col gap-1 mb-6">
                                    {navLinks.map((link, i) => {
                                        const active = pathname === link.href
                                        if (link.name === "Shop") {
                                            return (
                                                <li key={link.name}>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -16 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 + i * 0.06, ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
                                                    >
                                                        <button
                                                            onClick={() => setMobileShopOpen(p => !p)}
                                                            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                        >
                                                            <span>Shop</span>
                                                            <motion.span
                                                                animate={{ rotate: mobileShopOpen ? 180 : 0 }}
                                                                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                                                className="flex items-center"
                                                            >
                                                                <ChevronDown size={16} />
                                                            </motion.span>
                                                        </button>

                                                        <AnimatePresence initial={false}>
                                                            {mobileShopOpen && (
                                                                <motion.ul
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                                                    className="overflow-hidden pl-4 mt-1 flex flex-col gap-1"
                                                                >
                                                                    {[
                                                                        { name: "All Products", href: "/products" },
                                                                        { name: "Men's Fashion", href: "/categories/men's-fashion" },
                                                                        { name: "Women's Fashion", href: "/categories/women's-fashion" },
                                                                        { name: "Electronics", href: "/categories/electronics" },
                                                                    ].map((sub, j) => (
                                                                        <motion.li
                                                                            key={sub.name}
                                                                            initial={{ opacity: 0, x: -8 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: j * 0.05, duration: 0.2 }}
                                                                        >
                                                                            <Link
                                                                                href={sub.href}
                                                                                onClick={() => { setMenuOpen(false); setMobileShopOpen(false) }}
                                                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition"
                                                                            >
                                                                                <span className="w-1 h-1 rounded-full bg-zinc-400 flex-shrink-0" />
                                                                                {sub.name}
                                                                            </Link>
                                                                        </motion.li>
                                                                    ))}
                                                                </motion.ul>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                </li>
                                            )
                                        }

                                        return (
                                            <li key={link.name}>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -16 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + i * 0.06, ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setMenuOpen(false)}
                                                        className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all ${active
                                                                ? "bg-black text-white dark:bg-white dark:text-black"
                                                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                                            }`}
                                                    >
                                                        {link.name}
                                                        {active && <span className="text-xs opacity-60">→</span>}
                                                    </Link>
                                                </motion.div>
                                            </li>
                                        )
                                    })}
                                </ul>

                                {status === "authenticated" && (
                                    <>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 px-3 mb-3">Account</p>
                                        <ul className="flex flex-col gap-1 mb-6">
                                            <li>
                                                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                    <User size={16} className="text-zinc-400" />My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                    <div className="flex items-center gap-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-zinc-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                        </svg>
                                                        My Cart
                                                    </div>
                                                    {!!cartData?.numOfCartItems && (
                                                        <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold px-2 py-0.5 rounded-full">{cartData.numOfCartItems}</span>
                                                    )}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                    <Heart size={16} className="text-zinc-400" />My Wishlist
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/allorders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                    <ShoppingCart size={16} className="text-zinc-400" />My Orders
                                                </Link>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 px-3 mb-3">Preferences</p>
                                <button
                                    onClick={() => setDark(!dark)}
                                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {dark ? <Sun size={16} className="text-zinc-400" /> : <Moon size={16} className="text-zinc-400" />}
                                        {dark ? "Light Mode" : "Dark Mode"}
                                    </div>
                                    <div className={`w-10 h-5 rounded-full transition-colors ${dark ? "bg-black dark:bg-white" : "bg-zinc-200"}`}>
                                        <div className={`w-4 h-4 mt-0.5 rounded-full bg-white dark:bg-black transition-transform mx-0.5 ${dark ? "translate-x-5" : "translate-x-0"}`} />
                                    </div>
                                </button>
                            </nav>

                            {status === "authenticated" && (
                                <div className="border-t border-black/10 dark:border-white/10 px-6 py-4">
                                    <button
                                        onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }) }}
                                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition w-full"
                                    >
                                        <LogOut size={16} />Logout
                                    </button>
                                </div>
                            )}

                            <div className="px-6 py-3 text-center text-xs text-zinc-400 border-t border-black/10 dark:border-white/10">
                                © {new Date().getFullYear()} VEND◯RA — All rights reserved.
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}