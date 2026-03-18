import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Package, Heart, MapPin } from "lucide-react"

type Props = {
  name: string
  email: string
}

export default function ProfileHeader({ name, email }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white p-6 sm:p-8">

      {/* BG DECORATION */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/20">
            <AvatarFallback className="bg-white text-black text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-white/60 text-xs tracking-widest uppercase mb-1">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{name}</h1>
            <p className="text-white/50 text-sm mt-0.5">{email}</p>
          </div>
        </div>

        {/* STATS */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="text-center">
            <Package size={18} className="text-white/50 mx-auto mb-1" />
            <p className="text-xs text-white/50">Orders</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <Heart size={18} className="text-white/50 mx-auto mb-1" />
            <p className="text-xs text-white/50">Wishlist</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <MapPin size={18} className="text-white/50 mx-auto mb-1" />
            <p className="text-xs text-white/50">Addresses</p>
          </div>
        </div>

      </div>
    </div>
  )
}