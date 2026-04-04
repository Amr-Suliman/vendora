import { CartResponse } from "@/interfaces";
import { NextResponse } from "next/server";
import { getUserToken } from "@/Helpers/getUserToken";

export async function GET() {
  const token = await getUserToken();

  // Return 401 if no token found
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Prevent Next.js from caching the response on production
    const response = await fetch(`${process.env.API_URL}/cart`, {
      headers: { token },
      cache: "no-store",
    });

    // Return error if API response is not ok
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: response.status });
    }

    const data: CartResponse = await response.json();
    return NextResponse.json(data);

  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}