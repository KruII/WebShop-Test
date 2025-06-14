"use client";
import { useState } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function UserLookup() {
  const [mode, setMode]   = useState<"email" | "id">("email");
  const [value, setValue] = useState("");

  const key = value
    ? `/api/admin/user-products?${mode}=${encodeURIComponent(value)}`
    : null;
  const { data, error } = useSWR(key, fetcher);

  return (
    <CardContent className="space-y-4">
      {/* selector + input */}
      <div className="flex gap-2">
        <Select value={mode} onValueChange={(v) => setMode(v as any)}>
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">email</SelectItem>
            <SelectItem value="id">user ID</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={mode === "email" ? "Type user email…" : "Type user id…"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {error && <p className="text-destructive text-sm">Error loading data</p>}

      {data?.products?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Product</th>
                <th className="text-right">Qty</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p: any) => (
                <tr key={p.productId} className="border-b last:border-none">
                  <td className="py-2">{p.name}</td>
                  <td className="text-right">{p.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {value && !data?.products?.length && !error && (
        <p className="text-muted-foreground text-sm">No orders for this user</p>
      )}
    </CardContent>
  );
}
