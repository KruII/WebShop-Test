import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { subDays, startOfMonth } from "date-fns"

export async function GET() {
  const [totalOrders, totalRevenue, monthRevenue, users] = await Promise.all([
    prisma.order.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paymentDate: { gte: startOfMonth(new Date()) } },
    }),
    prisma.user.count(),
  ])

  const last7 = await prisma.payment.groupBy({
    by: ["paymentDate"],
    _sum: { amount: true },
    where: { paymentDate: { gte: subDays(new Date(), 6) } },
  })

  return NextResponse.json({
    totalOrders,
    totalRevenue: totalRevenue._sum.amount ?? 0,
    monthRevenue: monthRevenue._sum.amount ?? 0,
    users,
    last7,
  })
}
