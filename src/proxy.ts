import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = [
  "/cart",
  "/profile",
  "/allorders",
  "/wishlist",
  "/checkout",
];
const authPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-code",
  "/reset-password",
];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;

  // 🔒 protected pages
  if (protectedPages.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  // 🚫 auth-only pages
  if (authPages.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
