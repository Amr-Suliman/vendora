import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card/ProductCard"
import { BrandI } from "@/interfaces/brand"

const API_URL = "https://ecommerce.routemisr.com/api/v1"

export default async function BrandProducts({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch all brands
  const brandRes = await fetch(`${API_URL}/brands`, { cache: "no-store" })
  if (!brandRes.ok) throw new Error("Failed to fetch brands")

  const brand: BrandI | undefined = (await brandRes.json()).data.find(
    (b: BrandI) => b.slug === slug
  )
  if (!brand) notFound()

  // Fetch products by brand
  const productsRes = await fetch(`${API_URL}/products?brand=${brand._id}`, { cache: "no-store" })
  if (!productsRes.ok) throw new Error("Failed to fetch products")

  const products = (await productsRes.json()).data || []

  return (
    <div className="container mt-5 mb-15">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <p className="text-muted-foreground mt-1">Explore all products from {brand.name}</p>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found for this brand.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  )
}