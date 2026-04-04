"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ProductI } from "@/interfaces"
import ProductCard from "@/components/product-card/ProductCard"
import { CategoryI } from "@/interfaces/category"
import "swiper/css"
import "swiper/css/effect-fade"
import CategoriesSlider from "@/components/home/CategoriesSlider"

export default function ProductsClient({ products }: { products: ProductI[] }) {
    const [categories, setCategories] = useState<CategoryI[]>([])

    useEffect(() => {
        fetch("https://ecommerce.routemisr.com/api/v1/categories")
            .then(res => res.json())
            .then(json => setCategories(json.data))
    }, [])

    return (
        <>
            {/* BANNER */}
            <div className="w-full py-5">
                <img
                    src="/images/women/hh.webp"
                    alt="image-banner"
                    className="w-full h-[160px] sm:h-[260px] md:h-[380px] lg:h-[420px] object-cover rounded-lg"
                />
            </div>

            {/* CATEGORIES */}
            <CategoriesSlider />

            {/* PRODUCTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 pb-20 px-1 sm:px-6 md:px-0">
                {products.map((product, i) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </>
    )
}