import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    // إيميل ترحيب للمشترك
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to VEND◯RA Newsletter 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 32px;">
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -1px;">VEND◯RA</h1>
          <h2 style="font-size: 20px;">Welcome aboard! 🎁</h2>
          <p style="color: #666;">You're now subscribed to our newsletter. You'll be the first to know about our latest offers and new arrivals.</p>
          <a href="https://vendora.com/products" style="display:inline-block; margin-top:16px; background:#000; color:#fff; padding:12px 24px; border-radius:999px; text-decoration:none; font-weight:600;">
            Shop Now →
          </a>
          <p style="margin-top:32px; font-size:12px; color:#999;">You can unsubscribe at any time.</p>
        </div>
      `,
    })

    // إيميل تاني ليك إنت
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "amrelgohary573@gmail.com",
      subject: "New Newsletter Subscriber 📬",
      html: `
        <div style="font-family: sans-serif; padding: 24px;">
          <h2>New Subscriber!</h2>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}