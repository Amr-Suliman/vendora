"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import Link from "next/link"
import Image from "next/image"
import { CategoryI } from "@/interfaces/category"


const labels: Record<string, string> = {
    "men's-fashion": "New Season",
    "women's-fashion": "Trending Now",
    "electronics": "Latest Tech",
    "mobiles": "Top Picks",
    "beauty-and-health": "Best Sellers",
    "home": "New In",
    "books": "Must Read",
    "baby-and-toys": "Kids Zone",
    "supermarket": "Daily Deals",
    "music": "Top Charts",
}

export default function CategoriesSlider() {
    const [categories, setCategories] = useState<CategoryI[]>([])

    useEffect(() => {
        fetch("https://ecommerce.routemisr.com/api/v1/categories")
            .then(res => res.json())
            .then(json => setCategories(json.data))
    }, [])

    return (
        <div className="mb-10 mt-10">
            {/* HEADING */}
            <div className="flex flex-col items-center mb-8">
                <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">
                    Explore
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
                    Shop By Categories
                </h2>
                <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
            </div>

            {/* SLIDER */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Swiper
                    modules={[Autoplay, EffectCoverflow, Pagination]}
                    effect="coverflow"
                    centeredSlides
                    slidesPerView={1.3}
                    speed={1000}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    autoplay={{ delay: 1000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop
                    className="h-[300px] sm:h-[250px] md:h-[420px] pb-10"
                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        1024: { slidesPerView: 2 },
                    }}
                >
                    {categories.map((cat) => (
                        <SwiperSlide key={cat._id}>
                            <Link href={`/categories/${cat.slug}`} className="block w-full h-full">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* BADGE */}
                                <div className="absolute top-5 left-5 z-10">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase bg-white text-black px-3 py-1 rounded-full">
                                        {labels[cat.slug] ?? "Explore"}
                                    </span>
                                </div>

                                {/* TEXT */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
                                    <p className="text-white/60 text-xs tracking-widest uppercase mb-2">Category</p>
                                    <h3 className="text-white font-extrabold text-3xl sm:text-5xl leading-tight mb-4">
                                        {cat.name}
                                    </h3>
                                    <div className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-zinc-100 transition">
                                        Shop Now →
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}