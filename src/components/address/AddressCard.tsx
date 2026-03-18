"use client"

import { AddressContext } from "@/components/context/AddressContext"
import { Address } from "@/components/context/AddressContext"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, CheckCircle } from "lucide-react"
import { useContext, useState } from "react"
import AddressForm from "./AddressForm"
import { toast } from "sonner"

type Props = {
    address: Address
}

export default function AddressCard({ address }: Props) {
    const {
        selectedAddress,
        setSelectedAddress,
        deleteAddress,
    } = useContext(AddressContext)

    const [editOpen, setEditOpen] = useState(false)

    const isSelected = selectedAddress?._id === address._id

    async function handleDelete() {
        await deleteAddress(address._id)
        toast.success("Address deleted")
    }

    return (
        <div
            className={`relative border rounded-xl p-5 space-y-4 transition
      ${isSelected ? "border-black dark:border-white ring-1 ring-black" : ""}`}>
            {/* SELECTED BADGE */}
            {isSelected && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-green-600">
                    <CheckCircle size={14} /> Selected
                </span>
            )}

            {/* INFO */}
            <div>
                <p className="font-semibold text-lg">{address.city}</p>
                <p className="text-sm text-muted-foreground">
                    {address.details}
                </p>
                <p className="text-sm mt-1">{address.phone}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between gap-2">
                <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedAddress(address)}>
                    {isSelected ? "Selected" : "Select"}
                </Button>

                <div className="flex gap-2">
                    {/* EDIT */}
                    <AddressForm
                        editAddress={address}
                        open={editOpen}
                        setOpen={setEditOpen}>
                        <button className="p-2 hover:bg-muted rounded-md">
                            <Edit2 size={16} />
                        </button>
                    </AddressForm>

                    {/* DELETE */}
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}