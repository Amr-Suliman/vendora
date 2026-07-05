<p align="center">
  <img src="./assets/banner.png" alt="Vendora Banner" width="100%" />
</p>

<h1 align="center">Vendora</h1>

<p align="center">
A modern e-commerce platform built with <strong>Next.js 15</strong>, designed to deliver a fast, secure, and intuitive shopping experience.
</p>

<p align="center">
  <a href="https://vendora-store.vercel.app/">Live Demo</a>
  •
  <a href="#features">Features</a>
  •
  <a href="#tech-stack">Tech Stack</a>
  •
  <a href="#getting-started">Getting Started</a>
</p>

---

## Overview

Vendora is a full-stack e-commerce application built with modern web technologies and production-ready practices.

The project was developed with a strong focus on performance, scalability, maintainability, and user experience. It provides a complete shopping workflow, including authentication, product browsing, wishlist management, shopping cart, secure checkout, and order tracking.

Rather than being just a UI showcase, Vendora follows a clean architecture and patterns commonly used in real-world applications.

---

## Live Demo

**Website**

https://vendora-store.vercel.app/

---

## Preview

> Replace the following images with screenshots from your project.

<p align="center">
  <img src="./assets/home.png" width="100%" alt="Home Page">
</p>

<p align="center">
  <img src="./assets/products.png" width="100%" alt="Products Page">
</p>

<p align="center">
  <img src="./assets/cart.png" width="100%" alt="Shopping Cart">
</p>

<p align="center">
  <img src="./assets/checkout.png" width="100%" alt="Checkout">
</p>

---

# Features

### Shopping Experience

- Browse products
- Search products instantly
- Filter by category
- Product details page
- Responsive product gallery

### User Account

- Secure authentication
- Wishlist management
- Shopping cart
- Order history
- Profile management

### Checkout

- Visa payment
- Cash on Delivery
- Order confirmation

### User Experience

- Fully responsive layout
- Dark mode
- Skeleton loading
- Smooth animations
- Toast notifications
- Optimized image loading

---

# Tech Stack

| Category | Technology |
|------------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui |
| Animations | Framer Motion |
| Authentication | NextAuth.js |
| State Management | Context API |
| Email Service | Resend |
| Icons | Lucide React |

---

# Project Structure

```text
src
│
├── app
│
├── components
│
├── context
│
├── data
│
├── hooks
│
├── interfaces
│
├── lib
│
├── services
│
├── utils
│
└── middleware.ts
```

---

# Architecture

The application follows a modular architecture to improve scalability and maintainability.

- Component-based structure
- Reusable UI components
- Context API for global state
- Server Actions for authenticated requests
- Middleware route protection
- Environment variables for sensitive data
- Clear separation between UI and business logic

---

# Performance

The application is optimized using modern Next.js features.

- Server Components
- App Router
- Code Splitting
- Lazy Loading
- Image Optimization
- Fast Navigation
- Skeleton Screens

---

# Security

Security is handled using best practices.

- Secure authentication with NextAuth.js
- Protected routes
- Server-side actions
- Environment variables
- No sensitive credentials exposed to the client

---

# Getting Started

Clone the repository

```bash
git clone https://github.com/Amr-Suliman/vendora.git
```

Move into the project

```bash
cd vendora
```

Install dependencies

```bash
npm install
```

Create your environment file

```bash
cp .env.example .env.local
```

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# Environment Variables

Create a `.env.local` file.

```env
NEXTAUTH_URL=

NEXTAUTH_SECRET=

RESEND_API_KEY=

API_BASE_URL=
```

---

# Roadmap

- Product Reviews
- Ratings System
- Coupons & Discounts
- Admin Dashboard
- Product Recommendations
- Multi-language Support
- Inventory Management
- Stripe Integration

---

# Author

### Amr ElGohary

Frontend Developer passionate about building fast, scalable, and user-friendly web applications with modern technologies.

**GitHub**

https://github.com/Amr-Suliman

**LinkedIn**

https://linkedin.com/in/amr-suleiman

**Portfolio**

https://your-portfolio.vercel.app

---

<p align="center">
  <strong>If you found this project useful, consider giving it a ⭐ on GitHub.</strong>
</p>