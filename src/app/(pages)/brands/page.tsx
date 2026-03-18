import Link from "next/link"
import { BrandI } from "@/interfaces"

export default async function Brands() {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/brands",
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) throw new Error("Failed to fetch brands")

  const brands: BrandI[] = (await response.json()).data

  return (
    <div className="container mx-auto pb-20 pt-8 px-2 sm:px-6 lg:px-0">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase mb-2">Explore</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Our Brands</h1>
        <div className="mt-3 w-12 h-[2px] bg-black dark:bg-white rounded-full" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.map((brand) => (
          <Link key={brand._id} href={`/brands/${brand.slug}`} className="group">
            <div className="relative flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-55 hover:border-black dark:hover:border-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

              {/* Brand image */}
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-21 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />

              {/* Brand name — visible on hover */}
              <p className="absolute bottom-7 left-0 right-0 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 opacity-0 translate-y-1 group-hover:opacity-200 group-hover:translate-y-0 transition-all duration-500">
                {brand.name}
              </p>

            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}