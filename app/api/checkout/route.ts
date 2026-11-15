import { NextResponse } from "next/server";
import { z } from "zod";
import { products } from "@/lib/products";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().min(7).max(24),
    city: z.string().trim().min(2).max(60),
    address: z.string().trim().min(8).max(240),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(30),
});

/**
 * Demo checkout endpoint. It validates the basket and calculates a quote, but
 * intentionally does not create a live order, charge a card or store PII.
 * Connect a database and payment/fulfilment provider before production use.
 */
export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const lines = payload.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) throw new Error(`Unknown product: ${item.productId}`);
      return {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    });
    const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
    const reference = `SSS-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      mode: "demo",
      reference,
      currency: "PKR",
      subtotal,
      lines,
      message: "Quote calculated. Connect live order storage and payment before launch.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid checkout request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
