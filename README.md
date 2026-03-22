# 🧶 Crochet Shop

A cute, handmade crochet accessories e-commerce website built with React, Tailwind CSS, Framer Motion, and Lovable Cloud (Supabase).

## ✨ Features

- **Animated single-page storefront** with bubbly spring-physics animations
- **Dynamic product catalog** fetched from the database
- **Cart system** with confetti on add-to-cart
- **Checkout flow** with UPI payment integration
- **Contact form** that saves messages to the database
- **Admin dashboard** at `/admin` for managing orders, products, and messages
- **Mobile responsive** throughout

## 🎨 Design

- **Color palette:** Cream, Dusty Rose, Sage Green, Butter Yellow, Lavender, Terracotta
- **Fonts:** Baloo 2 (headings), Nunito (body), DM Sans (prices)
- **Animations:** Framer Motion scroll-triggered entrances, floating emojis, confetti bursts

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion + canvas-confetti
- **Backend:** Lovable Cloud (Supabase) — database, auth, edge functions
- **State Management:** React Context API

## 📦 Database Tables

| Table | Purpose |
|-------|---------|
| `products` | Product catalog with stock tracking |
| `orders` | Customer orders with payment status |
| `order_items` | Line items linked to orders and products |
| `contact_messages` | Contact form submissions |

## 🚀 Running Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/akanksha23056/crochet-shop.git
   cd crochet-shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project URL and anon key in `.env`.

4. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Admin Access

Navigate to `/admin` and enter the admin password to manage:
- Orders (view, confirm, mark as shipped)
- Products (add, edit, delete, manage stock)
- Contact messages

## 📄 License

MIT
