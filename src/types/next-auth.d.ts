import { UserResponse } from "@/interfaces"

declare module "next-auth" {
  interface Session {
    user: UserResponse & { _id: string }
    token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserResponse & { _id: string }
    token: string
  }
}