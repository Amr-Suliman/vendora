import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card/ProductCard"

const API_URL = "https://ecommerce.routemisr.com/api/v1"

export default async function SubCategoryProducts({ params }: { params: { slug: string; subSlug: string } }) {

  // Fetch category by slug
  const category = (await (await fetch(`${API_URL}/categories`, { cache: "no-store" })).json()).data.find(
    (c: any) => c.slug === params.slug
  )
  if (!category) notFound()

  // Fetch subcategory by slug
  const subcategory = (await (await fetch(`${API_URL}/subcategories?category=${category._id}`, { cache: "no-store" })).json()).data.find(
    (s: any) => s.slug === params.subSlug
  )
  if (!subcategory) notFound()

  // Fetch products by subcategory
  const products = (await (await fetch(`${API_URL}/products?subcategory=${subcategory._id}`, { cache: "no-store" })).json()).data || []

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-8">{subcategory.name}</h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
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