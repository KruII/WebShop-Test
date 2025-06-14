"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import qs from "qs"
import { motion } from "framer-motion"
import { Search, Filter, ArrowDownUp } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ProductCard } from "@/components/product-card"
import { ProductGridSkeleton } from "@/components/loading-skeleton"

/* ------------ stałe ------------ */
const PAGE_SIZE = 52
const fetcher   = (url: string) => fetch(url).then(r => r.json())
const SORT_OPTS = {
  "price-asc":  { label: "Price ↑"  },
  "price-desc": { label: "Price ↓"  },
  rating:       { label: "Best rated" },
}

export default function ProductsPage() {
  /* UI state */
  const [search, setSearch]   = useState("")
  const [cat, setCat]         = useState("all")
  const [sort, setSort]       = useState<keyof typeof SORT_OPTS>("price-asc")
  const [page, setPage]       = useState(0)
  const [allData, setAll]     = useState<any[]>([])
  const [hasMore, setMore]    = useState(true)

  /* key dla SWR */
  const query = qs.stringify(
    { category: cat, search, sort, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    { addQueryPrefix: true, skipNulls: true }
  )

  const { isLoading } = useSWR(`/api/products${query}`, fetcher, {
    keepPreviousData: true,
    onSuccess: (resp) => {
      const { products: batch, total } = resp
      setAll(prev => (page === 0 ? batch : [...prev, ...batch]))
      setMore((page + 1) * PAGE_SIZE < total)
    },
  })

  /* listę kategorii wyciągamy z już pobranych rekordów */
  const categories = useMemo(() => {
    const set = new Set(allData.map((p: any) => p.category))
    return ["all", ...Array.from(set)]
  }, [allData])

  /* reset przy zmianie filtrow */
  const reset = () => {
    setPage(0)
    setAll([])
    setMore(true)
  }

  /* ------------ render ------------ */
  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* ---------- nagłówek + filtry ---------- */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Our Products</h1>
            <p className="text-muted-foreground">Discover our curated collection of premium products</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">

            {/* search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={e => { setSearch(e.target.value); reset() }}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            {/* category */}
            <Select value={cat} onValueChange={v => { setCat(v); reset() }}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* sort */}
            <Select value={sort} onValueChange={v => { setSort(v as any); reset() }}>
              <SelectTrigger className="w-full sm:w-40">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SORT_OPTS).map(([k, { label }]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ---------- licznik ---------- */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading && page === 0
              ? "Loading…"
              : `Showing ${allData.length}${hasMore ? "+" : ""} products`}
          </p>
        </div>

        {/* ---------- grid ---------- */}
        {isLoading && page === 0 ? (
          <ProductGridSkeleton />
        ) : allData.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allData.map((p: any, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={isLoading}
                  variant="secondary"
                >
                  {isLoading ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No products found matching your criteria
            </p>
            <Button onClick={() => { setSearch(""); setCat("all"); reset() }}>Clear Filters</Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
