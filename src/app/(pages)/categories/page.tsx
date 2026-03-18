import Link from "next/link"
import Image from "next/image"
import { CategoryI } from "@/interfaces/category"

export default async function CategoriesPage() {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch categories")

  const categories: CategoryI[] = (await res.json()).data

  return (
    <div className="container pt-3 py-16 sm:py-20 lg:pt-5 px-2 sm:px-6 lg:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Categories</h1>

      {/* Masonry layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/categories/${cat.slug}`} className="block break-inside-avoid group">
            <div className="relative overflow-hidden rounded-2xl border">

              <Image
                src={cat.image}
                alt={cat.name}
                width={600}
                height={400}
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"/>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/50">
                <h2 className="text-white text-lg sm:text-xl font-bold text-center px-4">{cat.name}</h2>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}