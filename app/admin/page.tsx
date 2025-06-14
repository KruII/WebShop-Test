import { prisma } from "@/lib/prisma";
import { subMonths, startOfMonth, startOfDay } from "date-fns";
import ChartsSection from "./charts-client";        // charts (revenue, top products, payments, countries)
import OrdersTable   from "./orders-table";         // last 5 orders
import UserLookup    from "./user-products-client"; // client search (email ➜ product list)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 0;

export default async function AdminPage() {
  const now = new Date();

  /* ---------- summary ---------- */
  const [
    { _sum: { amount: rawTotal } },
    totalOrders,
    { _sum: { amount: monthTotal } },
    users,
  ] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.order.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paymentDate: { gte: startOfMonth(now) } },
    }),
    prisma.user.count(),
  ]);

  /* ---------- revenue trend ---------- */
  const monthlyRaw = await prisma.$queryRaw<Array<{ ym: string; total: number }>>`
    SELECT to_char(date_trunc('month', "paymentDate"), 'YYYY-MM') AS ym,
           SUM(amount)::numeric::float8 AS total
    FROM   "Payment"
    WHERE  "paymentDate" >= ${startOfDay(subMonths(now, 11))}
    GROUP  BY ym
    ORDER  BY ym`;

  /* ---------- top products ---------- */
  const topProductsRaw = await prisma.$queryRaw<Array<{ name: string; qty: number }>>`
    SELECT p."name", SUM(od.quantity)::int AS qty
    FROM   "OrderDetail" od
      JOIN "Product" p ON p.id = od."productId"
    GROUP  BY p."name"
    ORDER  BY qty DESC
    LIMIT 5`;

  /* ---------- payment breakdown ---------- */
  const paymentBreakdown = await prisma.payment.groupBy({ by: ["method"], _count: true });

  /* ---------- customers by country ---------- */
  const countryBreakdown = await prisma.user.groupBy({ by: ["country"], _count: true });

  // sort DESC by count and prepare top‑5 + "Other"
  const sortedCountries = countryBreakdown
    .map((c) => ({ country: c.country ?? "Unknown", count: c._count }))
    .sort((a, b) => b.count - a.count);

  const top5 = sortedCountries.slice(0, 5);
  const rest = sortedCountries.slice(5);
  const otherCount = rest.reduce((sum, r) => sum + r.count, 0);
  if (otherCount > 0) top5.push({ country: "Other", count: otherCount });

  const chartsData = {
    monthly:        monthlyRaw,
    bestProducts:   topProductsRaw,
    paymentMethods: paymentBreakdown.map((m) => ({ method: m.method, count: m._count })),
    countries:      top5,
  } as const;

  /* ---------- latest orders ---------- */
  const latest = await prisma.order.findMany({
    orderBy: { orderDate: "desc" },
    take: 5,
    include: { details: { include: { product: true } } },
  });

  return (
    <div className="container py-8 space-y-8">
      {/* metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric title="Total Revenue" value={`$${(rawTotal ?? 0).toFixed(2)}`} />
        <Metric title="This Month"    value={`$${(monthTotal ?? 0).toFixed(2)}`} />
        <Metric title="Total Orders"  value={totalOrders} />
        <Metric title="Registered Users" value={users} />
      </div>

      {/* charts (4 wiersze) */}
      <ChartsSection data={chartsData} />

      {/* user → ordered products */}
      <Card>
        <CardHeader><CardTitle>Products ordered by user</CardTitle></CardHeader>
        <CardContent><UserLookup /></CardContent>
      </Card>

      {/* latest orders */}
      <Card>
        <CardHeader><CardTitle>Latest Orders</CardTitle></CardHeader>
        <CardContent><OrdersTable orders={latest} /></CardContent>
      </Card>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="text-center">
      <CardHeader><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  );
}