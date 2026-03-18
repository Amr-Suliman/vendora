"use client"

import { useContext } from "react"
import { MapPin } from "lucide-react"
import AddressForm from "@/components/address/AddressForm"
import AddressCard from "@/components/address/AddressCard"
import { AddressContext } from "@/components/context/AddressContext"

export default function AddressesPage() {
  const { addresses } = useContext(AddressContext)

  return (
    <div className="container max-w-6xl mx-auto py-20 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your delivery addresses
          </p>
        </div>
        <AddressForm />
      </div>

      {/* EMPTY STATE */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-2xl p-12 text-center bg-muted/40">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <MapPin size={28} className="text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold mb-1">No addresses yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mb-2">
            Add your first delivery address to continue checkout and get your orders delivered smoothly.
          </p>
          <p className="text-xs text-muted-foreground">
            You can add multiple delivery locations
          </p>
        </div>

      ) : (
        /* ADDRESSES GRID */
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard key={address._id} address={address} />
          ))}
        </div>
      )}

    </div>
  )
}