import { NextResponse } from "next/server";
// prisma

export async function GET() {
  const users = {
    message: "success",
    users: [
      { id: 111, name: "amr", age: 20 },
      { id: 222, name: "muhammed", age: 20 },
      { id: 333, name: "Ahmed", age: 20 },
    ],
  };
  return NextResponse.json(users);
}
