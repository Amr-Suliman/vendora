"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { Session } from "next-auth"

const CART_URL = "https://ecommerce.routemisr.com/api/v2/cart"

// Add product to cart — requires authenticated session

export async function addToCartAction(productId: string) {
  const session = (await getServerSession(authOptions)) as Session

  if (!session?.user || !session.token) throw new Error("Unauthorized")

  const res = await fetch(CART_URL, {
    method: "POST",
    body: JSON.stringify({ productId }),
    headers: {
      token: session.token,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.message || "Something went wrong")

  return data
}