"use client"

import { useContext, useEffect, useState } from "react"
import { AddressContext, Address } from "@/components/context/AddressContext"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Props = {
  editAddress?: Address
  open?: boolean
  setOpen?: (v: boolean) => void
  children?: React.ReactNode
}

export default function AddressForm({
  editAddress,
  open,
  setOpen,
  children,
}: Props) {
  const { addAddress, updateAddress } = useContext(AddressContext)

  const [form, setForm] = useState({
    details: "",
    city: "",
    phone: "",
  })

  useEffect(() => {
    if (editAddress) {
      setForm({
        details: editAddress.details,
        city: editAddress.city,
        phone: editAddress.phone,
      })
    }
  }, [editAddress])

  async function handleSubmit() {
    if (editAddress) {
      await updateAddress(editAddress._id, form)
      toast.success("Address updated")
    } else {
      await addAddress(form)
      toast.success("Address added")
    }

    setForm({ details: "", city: "", phone: "" })
    setOpen?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Add New Address</Button>}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="mb-3">Address</Label>
            <Input
              value={form.details}
              onChange={(e) =>
                setForm({ ...form, details: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-3">City</Label>
            <Input
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-3">Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            {editAddress ? "Save Changes" : "Add Address"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}