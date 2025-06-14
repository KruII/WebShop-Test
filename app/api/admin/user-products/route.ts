import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")?.trim()
  const id    = Number(searchParams.get("id"))

  let userId: number | null = null

  if (email) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) userId = user.id
  } else if (!Number.isNaN(id)) {
    userId = id
  }

  if (!userId) return NextResponse.json({ products: [] })

  const rows = await prisma.$queryRaw<
    Array<{ productId: number; name: string; qty: number }>
  >`
    SELECT p.id AS "productId",
           p."name",
           SUM(od.quantity)::int AS qty
    FROM   "Order"       o
      JOIN "OrderDetail" od ON od."orderId"   = o.id
      JOIN "Product"     p  ON p.id           = od."productId"
    WHERE  o."userId" = ${userId}
    GROUP  BY p.id, p."name"
    ORDER  BY qty DESC`;

  return NextResponse.json({ products: rows })
}
