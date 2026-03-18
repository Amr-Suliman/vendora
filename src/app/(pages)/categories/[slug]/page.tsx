import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card/ProductCard"
import { CategoryI } from "@/interfaces/category"

const API_URL = "https://ecommerce.routemisr.com/api/v1"

export default async function CategoryProducts({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch category by slug
  const catRes = await fetch(`${API_URL}/categories`, { cache: "no-store" })
  if (!catRes.ok) throw new Error("Failed to fetch categories")

  const category: CategoryI | undefined = (await catRes.json()).data.find(
    (cat: CategoryI) => cat.slug === slug
  )
  if (!category) notFound()

  // Fetch products by category
  const productsRes = await fetch(`${API_URL}/products?category=${category._id}`, { cache: "no-store" })
  if (!productsRes.ok) throw new Error("Failed to fetch products")

  const products = (await productsRes.json()).data || []

  return (
    <div className="container pt-5 pb-20">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-1">Explore all products in {category.name}</p>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found in this category.</p>
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