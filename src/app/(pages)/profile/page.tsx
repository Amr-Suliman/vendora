import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"
import ProfileHeader from "../../../components/profileHeader/ProfileHeader"
import ProfileActions from "../../../components/profileAction/ProfileActions"
import RecentOrders from "../../../components/recentOrders/RecentOrders"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen dark:bg-zinc-950">
      <div className="container mx-auto pt-8 pb-20 px-4 sm:px-6 lg:px-0 max-w-5xl">

        {/* PROFILE HEADER */}
        <ProfileHeader name={session.user.name!} email={session.user.email!} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Actions */}
          <div className="lg:col-span-1">
            <ProfileActions />
          </div>

          {/* RIGHT — Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders userId={session.user._id} token={session.token} />
          </div>
        </div>
      </div>
    </div>
  )
}