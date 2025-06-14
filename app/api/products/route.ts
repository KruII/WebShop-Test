import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"      // 👈 typy Prisma

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  /* query params */
  const category = searchParams.get("category") ?? "all"
  const search   = searchParams.get("search")   ?? ""
  const limit    = Math.min(Number(searchParams.get("limit")  ?? 20), 100)
  const offset   = Math.max(Number(searchParams.get("offset") ?? 0),  0)
  const sort     = searchParams.get("sort")     ?? "price-asc"

  /* ---------- orderBy ---------- */
  let orderBy: Prisma.ProductOrderByWithRelationInput

  if (sort === "price-desc")      orderBy = { price:  "desc" }
  else if (sort === "rating")     orderBy = { rating: "desc" }
  else                            orderBy = { price:  "asc" }   // "price-asc" lub cokolwiek innego

  /* ---------- filters ---------- */
  const where: Prisma.ProductWhereInput = {}

  if (category !== "all") where.category = category

  if (search) {
    where.OR = [
      { name:        { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  /* ---------- query db ---------- */
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    }),
  ])

  return NextResponse.json({ total, products })
}
