"use client"

import { createContext, ReactNode, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

/* ================= TYPES ================= */
export type Address = {
  _id: string
  name?: string
  details: string
  city: string
  phone: string
}

export type AddressFormData = Omit<Address, "_id">

type AddressContextType = {
  addresses: Address[]
  selectedAddress: Address | null
  setSelectedAddress: (address: Address | null) => void

  getAddresses: () => Promise<void>
  addAddress: (data: AddressFormData) => Promise<void>
  updateAddress: (id: string, data: AddressFormData) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
}

/* ================= CONTEXT ================= */
export const AddressContext = createContext<AddressContextType>({
  addresses: [],
  selectedAddress: null,
  setSelectedAddress: () => {},

  getAddresses: async () => {},
  addAddress: async () => {},
  updateAddress: async () => {},
  deleteAddress: async () => {},
})

/* ================= PROVIDER ================= */
export default function AddressContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { data: session } = useSession()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

  /* ================= GET ================= */
  async function getAddresses() {
    if (!session?.token) return

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/addresses",
        {
          headers: {
            token: session.token,
          },
        }
      )

      const data = await res.json()
      setAddresses(data.data || [])
    } catch (error) {
      console.error("Get addresses error:", error)
    }
  }

  /* ================= ADD ================= */
  async function addAddress(address: AddressFormData) {
    if (!session?.token) return

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: session.token,
          },
          body: JSON.stringify(address),
        }
      )

      const data = await res.json()
      setAddresses((prev) => [...prev, data.data])
    } catch (error) {
      console.error("Add address error:", error)
    }
  }

  /* ================= UPDATE ================= */
  async function updateAddress(id: string, address: AddressFormData) {
    if (!session?.token) return

    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/addresses/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: session.token,
          },
          body: JSON.stringify(address),
        }
      )

      const data = await res.json()

      setAddresses((prev) =>
        prev.map((a) => (a._id === id ? data.data : a))
      )

      if (selectedAddress?._id === id) {
        setSelectedAddress(data.data)
      }
    } catch (error) {
      console.error("Update address error:", error)
    }
  }

  /* ================= DELETE ================= */
  async function deleteAddress(id: string) {
    if (!session?.token) return

    try {
      await fetch(
        `https://ecommerce.routemisr.com/api/v1/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            token: session.token,
          },
        }
      )

      setAddresses((prev) => prev.filter((a) => a._id !== id))

      if (selectedAddress?._id === id) {
        setSelectedAddress(null)
      }
    } catch (error) {
      console.error("Delete address error:", error)
    }
  }

  useEffect(() => {
    getAddresses()
  }, [session])

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        getAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}