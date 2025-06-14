"use client";
import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ChartsSection({
  data,
}: {
  data: {
    monthly: { ym: string; total: number }[];
    bestProducts: { name: string; qty: number }[];
    paymentMethods: { method: string; count: number }[];
    countries: { country: string; count: number }[];
  };
}) {
  const [range, setRange] = useState<"3" | "6" | "12">("12");
  const monthlySlice = useMemo(() => data.monthly.slice(-Number(range)), [range, data.monthly]);
  const COLORS = ["#4299e1", "#68d391", "#ed8936", "#f56565", "#9f7aea", "#ecc94b"];

  return (
    <div className="space-y-6">
      {/* range selector */}
      <div className="flex justify-end">
        <Select value={range} onValueChange={(v)=>setRange(v as any)}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">last 3 months</SelectItem>
            <SelectItem value="6">last 6 months</SelectItem>
            <SelectItem value="12">last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* revenue trend */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
          <CardContent className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlySlice}><XAxis dataKey="ym"/><YAxis/><Tooltip formatter={(v:number)=>`$${v.toFixed(2)}`}/><Area type="monotone" dataKey="total" stroke="#4299e1" fill="#4299e1" fillOpacity={0.3}/></AreaChart></ResponsiveContainer></CardContent>
        </Card>

        {/* top products */}
        <Card><CardHeader><CardTitle>Top products</CardTitle></CardHeader><CardContent className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.bestProducts} layout="vertical" margin={{ left:40 }}><XAxis type="number"/><YAxis type="category" dataKey="name" width={150}/><Tooltip/><Bar dataKey="qty" fill="#68d391"/></BarChart></ResponsiveContainer></CardContent></Card>

        {/* payment methods */}
        <Card><CardHeader><CardTitle>Payment methods</CardTitle></CardHeader><CardContent className="h-72 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.paymentMethods} dataKey="count" nameKey="method" outerRadius={80} label={({percent})=>`${(percent*100).toFixed(0)}%`}>{data.paymentMethods.map((_,idx)=><Cell key={idx} fill={COLORS[idx%COLORS.length]}/> )}</Pie><Legend/><Tooltip/></PieChart></ResponsiveContainer></CardContent></Card>

        {/* customers by country 
        <Card><CardHeader><CardTitle>Customers by country</CardTitle></CardHeader><CardContent className="h-72 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.countries} dataKey="count" nameKey="country" outerRadius={80} label={({percent})=>`${(percent*100).toFixed(0)}%`}>{data.countries.map((_,idx)=><Cell key={idx} fill={COLORS[idx%COLORS.length]}/> )}</Pie><Legend/><Tooltip/></PieChart></ResponsiveContainer></CardContent></Card>
        */}
      </div>
    </div>
  );
}