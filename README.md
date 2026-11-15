# Saleem & Sons Store

A premium, responsive Next.js storefront concept with a warm espresso / alabaster / antique-gold visual system. It is built as a single-page shopping experience so the core brand story, collection, materials and bag flow can be explored in one continuous editorial journey.

## Included

- Next.js App Router + React + TypeScript
- Tailwind CSS 4 (with the visual system implemented in `app/globals.css`)
- Motion for entrance, reveal, product filtering, drawer and modal transitions
- Three.js / React Three Fiber / Drei draggable 3D carryall scene, with material switching
- Lenis smooth scrolling, responsive layouts and reduced-motion CSS fallback
- Category filters, product quick views, saved-item toggles, search drawer, PKR/USD display selector
- Persistent shopping bag with quantity controls
- Zod-validated demo checkout API at `POST /api/checkout`
- Newsletter interaction (front-end demo only)

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm run start
```

## Important before launch

This is a functional storefront prototype, not a production order-management system. The inventory in `lib/products.ts`, prices, product names, materials, brand-history copy, contact details and currency conversion are demonstration content. Replace them with approved Saleem & Sons information.

The checkout endpoint validates the submitted customer fields and basket, calculates a quote and returns a demo reference. It intentionally does **not** save customer information, create a live order, take payment or notify fulfilment. Before accepting customers, connect:

1. A database (e.g. PostgreSQL / Prisma or Drizzle) for catalogue, inventory, customers and orders.
2. A payment provider suitable for your market and merchant account.
3. Shipping rates, address validation, order notifications and admin order management.
4. A verified business phone / WhatsApp number and store email.
5. A live PKR/USD exchange-rate source if you intend to show converted prices. The USD display currently uses a fixed illustrative rate of Rs. 280 per USD.

The newsletter form currently confirms locally and does not submit addresses to a mailing platform.

## Main files

- `components/storefront.tsx` — all storefront interactions and sections
- `components/hero-scene.tsx` — 3D scene and material finishes
- `components/product-art.tsx` — replaceable demo product illustrations
- `lib/products.ts` — editable demo catalogue, categories and heritage timeline
- `app/api/checkout/route.ts` — validated demo checkout API
- `app/globals.css` — design tokens, layout, responsive rules and motion styling
- `.env.example` — placeholders for future integrations

## Brand / product content

The current sample catalogue depicts crafted carry goods, a journal and a desk object only to give the prototype believable demo inventory. It is not a claim about the actual Saleem & Sons product range. To change the collection, edit the `products` and `categories` arrays in `lib/products.ts`, then replace the `ProductArt` illustrations and the 3D model with product-accurate photography or GLB assets.
