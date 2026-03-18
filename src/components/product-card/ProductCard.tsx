'use client'

import Image from "next/image"
import Link from "next/link"

import WishList from "@/components/wishlist/WishList"
import AddToCart from "@/components/addToCart/AddToCart"
import ProductRating from "@/components/productRating/ProductRating"
import { ProductI } from "@/interfaces"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"


export default function ProductCard({ product }: { product: ProductI }) {
  return (
    <Card className="group w-full border-none shadow-none flex flex-col h-full dark:bg-black">

      {/* IMAGE */}
      <Link href={`/products/${product._id}`}>
        <div className="relative rounded-lg overflow-hidden p-3 shadow-sm hover:shadow-md transition">
          <WishList productId={product._id} />
          <Image
            src={product.imageCover}
            alt={product.title}
            width={220}
            height={220}
            className="w-full h-70 sm:h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* INFO */}
      <CardHeader className="flex flex-col items-center justify-center gap-2 -mb-3 flex-1">
        <CardTitle className="font-semibold text-center">
          {product.brand?.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-1 text-center">
          {product.title}
        </CardDescription>
      </CardHeader>

      {/* PRICE + RATING */}
      <CardContent className="flex flex-col items-center gap-2 mt-auto">
        <div className="flex items-center gap-8">
          <ProductRating
            rating={product.ratingsAverage}
            count={product.ratingsQuantity}
          />
          <p className="font-bold text-lg">
            ${product.price}
          </p>
        </div>
        <div className="w-70">
          <AddToCart productId={product._id} />
        </div>
      </CardContent>

    </Card>
  )
}