import { ProductI } from "./product"

export interface CartResponse {
  status: string
  message?: string
  numOfCartItems: number
  cartId: string | null
  data: CartData
}

export interface CartData {
  _id?: string
  cartOwner?: string
  products: CartItem[]
  createdAt?: string
  updatedAt?: string
  __v?: number
  totalCartPrice: number
}

export interface CartItem {
  count: number
  _id: string
  product: ProductI
  price: number
}

