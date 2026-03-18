import { ProductI } from "@/interfaces"
import ProductsClient from "./ProductsClient"

export default async function ProductsPage() {
  const res = await fetch(
    "https://ecommerce.routemisr.com/api/v1/products",
    { cache: "no-store" }
  )

  const json = await res.json()
  const products: ProductI[] = json.data || []

  return <ProductsClient products={products} />
}