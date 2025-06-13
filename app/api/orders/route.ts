import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"   // 👈

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const status = searchParams.get("status") ?? "all"
  const limit  = Math.min(Number(searchParams.get("limit")  ?? 20), 100)
  const offset = Math.max(Number(searchParams.get("offset") ?? 0),  0)
  const sort   = searchParams.get("sort")    ?? "newest"

  /* ---------- orderBy z jawnie zadanym typem ---------- */
  let orderBy: Prisma.OrderOrderByWithRelationInput

  if (sort === "total-asc")      orderBy = { total:     "asc"  }
  else if (sort === "total-desc")orderBy = { total:     "desc" }
  else if (sort === "oldest")    orderBy = { orderDate: "asc"  }
  else                           orderBy = { orderDate: "desc" }  // newest

  /* ---------- filtr ---------- */
  const where: Prisma.OrderWhereInput = {}
  if (status !== "all") where.status = status

  /* ---------- zapytania ---------- */
  const [ total, orders ] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: { details: { include: { product: true } } },
    }),
  ])

  return NextResponse.json({ total, orders })
}
