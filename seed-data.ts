import { drizzle } from "drizzle-orm/mysql2";
import { products, vouchers } from "./drizzle/schema";

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!);

  // Seed products
  await db.insert(products).values([
    {
      name: "Gemini Advanced",
      description: "Gemini Pro 2TB (Gemini Advanced + 2TB Google Drive + Notebook LM)",
      price: 2999, // $29.99
      category: "AI Tools",
      isActive: true,
    },
    {
      name: "Canva Pro",
      description: "Full access to Canva Pro features",
      price: 2999, // $29.99
      category: "Design Tools",
      isActive: true,
    },
    {
      name: "Canva Pro Edu",
      description: "Canva Pro with educational benefits",
      price: 1599, // $15.99
      category: "Design Tools",
      isActive: true,
    },
    {
      name: "Perplexity Pro",
      description: "Advanced AI search and research tool",
      price: 2999, // $29.99
      category: "AI Tools",
      isActive: true,
    },
  ]);

  // Seed vouchers
  await db.insert(vouchers).values([
    {
      code: "FRIDAY50",
      discountPercent: 50,
      isActive: true,
    },
    {
      code: "MONDAY60",
      discountPercent: 60,
      isActive: true,
    },
  ]);

  console.log("✅ Seed data inserted successfully!");
}

seed().catch(console.error);
