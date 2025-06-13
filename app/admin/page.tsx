/* SERVER COMPONENT */
import { prisma } from "@/lib/prisma"
import OrdersTable from "./orders-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { headers } from "next/headers"

export default async function AdminPage() {
  const host      = (await headers()).get("host")!
  const protocol  = host.startsWith("localhost") ? "http" : "https"
  const baseUrl   = `${protocol}://${host}`
  // 1) summary – relatywny fetch (działa lokalnie i produkcyjnie)
  const summary: {
    totalOrders: number
    totalRevenue: number
    monthRevenue: number
    users: number
  } = await fetch(`${baseUrl}/api/admin/summary`, { cache: "no-store" }).then(r => r.json())

  // 2) ostatnie 5 zamówień
  const latest = await prisma.order.findMany({
    orderBy: { orderDate: "desc" },
    take: 5,
    include: { details: { include: { product: true } } },
  })

  return (
    <div className="container py-8 space-y-8">
      {/* METRYKI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric title="Total Revenue"     value={`$${summary.totalRevenue.toFixed(2)}`} />
        <Metric title="This Month"        value={`$${summary.monthRevenue.toFixed(2)}`} />
        <Metric title="Total Orders"      value={summary.totalOrders} />
        <Metric title="Registered Users"  value={summary.users} />
      </div>

      {/* Ostatnie zamówienia */}
      <Card>
        <CardHeader><CardTitle>Latest Orders</CardTitle></CardHeader>
        <CardContent><OrdersTable orders={latest} /></CardContent>
      </Card>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="text-center">
      <CardHeader><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  )
}
