// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  /* -------- query params -------- */
  const category = searchParams.get("category") ?? "all"
  const search   = searchParams.get("search")   ?? ""
  const limit    = Math.min(Number(searchParams.get("limit")  ?? 20), 100)
  const offset   = Math.max(Number(searchParams.get("offset") ?? 0),  0)
  const sort     = searchParams.get("sort") ?? "price-asc"

  /* -------- order -------- */
  const orderBy =
    sort === "price-desc" ? { price:  "desc" } :
    sort === "rating"     ? { rating: "desc" } :
                            { price:  "asc"  }

  /* -------- filters -------- */
  const where: any = {}
  if (category !== "all") where.category = category
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  /* -------- query db -------- */
  const [ total, products ] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy, take: limit, skip: offset }),
  ])

  return NextResponse.json({ total, products })
}
