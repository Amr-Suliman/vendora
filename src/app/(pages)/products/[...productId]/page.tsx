import { ProductI } from '@/interfaces'
import { Params } from 'next/dist/server/request/params'
import Image from 'next/image'
import ProductSlider from '@/components/productSlider/productSlider'
import ProductRating from '@/components/productRating/ProductRating'
import AddToCart from '@/components/addToCart/AddToCart'
import { PackageX, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default async function ProductDetails({ params }: { params: Params }) {

  let { productId } = await params

  const response = await fetch(
    'https://ecommerce.routemisr.com/api/v1/products/' + productId,
    { cache: 'no-store' }
  )

  const { data: product }: { data: ProductI } = await response.json()

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <PackageX size={28} className="text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold mb-1">Product not found</h2>
        <p className="text-sm text-zinc-400 mb-6 max-w-xs">
          This product doesn't exist or may have been removed.
        </p>
        <Link
          href="/products"
          className="flex items-center gap-2 text-sm font-semibold bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 rounded-full hover:opacity-80 transition">
          <ArrowLeft size={14} />
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-10 container mx-auto px-4 pb-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* LEFT – Images */}
        <div className="flex flex-col items-center w-full">
          <div className="border rounded-lg overflow-hidden w-full max-w-md flex items-center justify-center">
            <div className="px-5 sm:pl-18 md:pl-10 lg:pl-17">
              <ProductSlider
                images={product.images}
                altContent={product.title} />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="border rounded-md overflow-hidden cursor-pointer flex items-center justify-center">
                <Image
                  src={img}
                  alt={product.title}
                  width={85}
                  height={85}
                  className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="flex flex-col gap-5 pt-2">

          {/* BREADCRUMB */}
          <p className="text-sm text-muted-foreground">
            {product.category.name} / {product.brand.name}
          </p>

          {/* TITLE */}
          <h1 className="text-lg sm:text-2xl md:text-3xl  font-bold tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* RATING */}
          <ProductRating
            rating={product.ratingsAverage}
            count={product.ratingsQuantity}
          />

          {/* PRICE */}
          <p className="text-2xl font-bold">
            {product.price}.00 EGP
          </p>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* SIZE */}
          {(product.category.name === "Men's Fashion" ||
            product.category.name === "Women's Fashion") && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Select Size</p>
                <Select>
                  <SelectTrigger className="w-36 h-11 rounded-xl">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s">Small</SelectItem>
                    <SelectItem value="m">Medium</SelectItem>
                    <SelectItem value="l">Large</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* QUANTITY + ADD TO CART */}
          <div className="flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-full px-3 h-11">
              <button className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition text-lg font-bold">
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">1</span>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition text-lg font-bold">
                +
              </button>
            </div>

            {/* Add to Cart */}
            <div className="w-60">
              <AddToCart productId={product._id} />
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <h2 className="text-sm md:text-lg font-bold uppercase tracking-wider dark:text-zinc-200">
              Product Details
            </h2>
            <p className="text-sm md:text-base md:font-medium leading-relaxed dark:text-zinc-300">
              {product.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}