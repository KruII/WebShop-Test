import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus, Prisma } from "@prisma/client" // 👈 bez `type` przed OrderStatus


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const statusParam = searchParams.get("status") ?? "all"
  const limit       = Math.min(Number(searchParams.get("limit")  ?? 50), 100)
  const offset      = Math.max(Number(searchParams.get("offset") ?? 0),  0)
  const sort        = searchParams.get("sort")   ?? "newest"

  /* ---------- orderBy ---------- */
  let orderBy: Prisma.OrderOrderByWithRelationInput
  if (sort === "total-asc")      orderBy = { total: "asc" }
  else if (sort === "total-desc")orderBy = { total: "desc" }
  else if (sort === "oldest")    orderBy = { orderDate: "asc" }
  else                           orderBy = { orderDate: "desc" }

  /* ---------- where ---------- */
  const where: Prisma.OrderWhereInput = {}

  // tylko jeśli parametr jest zgodny z enumem
  if (
    statusParam !== "all" &&
    (Object.values(OrderStatus) as string[]).includes(statusParam.toUpperCase())
  ) {
    where.status = statusParam.toUpperCase() as OrderStatus
  }

  /* ---------- query ---------- */
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
