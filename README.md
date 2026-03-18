# 🛒 vendora — Modern E-Commerce Platform

A modern, scalable e-commerce web application built with **Next.js App Router**,
focused on **performance**, **security**, and **clean architecture**.

This project demonstrates real-world frontend practices used in production
applications, including **secure API handling**, **cart & orders flow**, and
**professional UI/UX** patterns.

---

## 🚀 Live Demo

🔗 [vendora.vercel.app](https://vendora.vercel.app)

---

## ✨ Features

- 🛍️ Product listing, filtering & search
- 🛒 Cart with optimistic UI & undo support
- 🔐 Secure authentication (NextAuth.js)
- 💳 Checkout — Visa & Cash on Delivery
- 📦 Orders history & tracking
- ❤️ Wishlist management
- 📧 Newsletter subscription (Resend)
- 📬 Contact form with email delivery
- 🌙 Dark mode
- 📱 Fully responsive — mobile-first
- ⚡ Skeleton loading & smooth animations

---

## 🧱 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Auth | NextAuth.js |
| Email | Resend |
| Icons | Lucide React |
| State | Context API |

---

## 🔐 Security & Architecture Decisions

This project intentionally avoids exposing sensitive data on the client.

### ✅ Secure API Handling

- Tokens never exposed to the browser
- All authenticated requests via **Server Actions**
- API keys stored in `.env.local` only
- Protected routes with middleware
```ts
"use server";
export async function addToCartAction(productId: string) {
  // secure server-side request
}
```

---

## 📁 Project Structure
```
src/
├── app/               # Pages & API Routes
├── components/        # Reusable UI components
├── context/           # Global state (Cart, Wishlist)
├── interfaces/        # TypeScript types
├── data/              # Static data
└── lib/               # Utilities
```

---

## 🛠️ Getting Started
```bash
git clone https://github.com/your-username/shopmart
cd shopmart
npm install
cp .env.example .env.local
npm run dev
```

---

## 👨‍💻 Author

**Amr Elgohary** — [LinkedIn](https://linkedin.com/in/amr-suleiman) · [GitHub](https://github.com/Amr-Suliman)