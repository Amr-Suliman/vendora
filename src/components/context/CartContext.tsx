'use client'

import { CartResponse } from "@/interfaces"
import { createContext, ReactNode, useEffect, useState } from "react"

type CartContextType = {
    cartData: CartResponse | null
    setCartData: (value: CartResponse | null) => void
    isLoading: boolean
    setIsLoading: (value: boolean) => void
    getCart: () => Promise<void>
    isInCart: (productId: string) => boolean  // ← ضيفها هنا
}

export const CartContext = createContext<CartContextType>({
    cartData: null,
    setCartData: () => { },
    isLoading: false,
    setIsLoading: () => { },
    getCart: async () => { },
    isInCart: () => false  // ← وهنا
})

export default function CartContextProvider({ children }: { children: ReactNode }) {
    const [cartData, setCartData] = useState<CartResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function getCart() {
        try {
            setIsLoading(true)
            const response = await fetch("/api/get-cart")
            if (!response.ok) {
                setCartData(null)
                return
            }
            const data: CartResponse = await response.json()
            setCartData(data)
        } catch (error) {
            console.error("Get Cart Error:", error)
            setCartData(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    const isInCart = (productId: string): boolean => {
        if (!cartData?.data?.products) return false
        return cartData.data.products.some(
            (item: any) => item.product._id === productId || item.product === productId
        )
    }

    return (
        <CartContext.Provider
            value={{
                cartData,
                setCartData,
                isLoading,
                setIsLoading,
                getCart,
                isInCart, 
            }}
        >
            {children}
        </CartContext.Provider>
    )
}