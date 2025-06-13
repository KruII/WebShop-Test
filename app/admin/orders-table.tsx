"use client"
import { format } from "date-fns"
import type { Order, OrderStatus } from "@prisma/client"

type OrderRow = Order & {
  status: OrderStatus   // gdyby w modelu status opcjonalny ⇒ OrderStatus | null
  total:  number
  details: any[]
}

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
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
            <td>{format(new Date(o.orderDate), "yyyy-MM-dd")}</td>
            <td className="capitalize">{o.status}</td>
            <td className="text-right">${o.total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
