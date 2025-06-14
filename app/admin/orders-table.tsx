/* app/admin/orders-table.tsx */
"use client"
import type { Order } from "@prisma/client"

export default function OrdersTable({ orders }: { orders: (Order & { details: any[] })[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="text-left border-b">
        <tr>
          <th className="py-2">Order #</th>
          <th>Date</th>
          <th>Status</th>
          <th className="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id} className="border-b last:border-none">
            <td className="py-2">{o.id}</td>

            {/* ✅ format w UTC, identyczny na serwerze i w przeglądarce */}
            <td>
              <time dateTime={o.orderDate.toISOString()}>
                {o.orderDate.toISOString().slice(0, 10)}  {/* yyyy-MM-dd */}
              </time>
            </td>

            <td className="capitalize">{o.status}</td>
            <td className="text-right">${o.total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
