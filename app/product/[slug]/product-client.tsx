"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import type { Product } from "@/components/product-card"

export default function ProductClient({ product }: { product: Product }) {
  const [sel, setSel]   = useState(0)
  const [qty, setQty]   = useState(1)
  const addItem         = useCartStore((s) => s.addItem)

  const addToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image ?? product.images?.[0] ?? "/placeholder.svg",
      })
    }
  }

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images?.[sel] ?? "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setSel(i)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  sel === i ? "border-primary" : "border-muted"
                }`}
              >
                <Image src={img} alt={`${product.name} ${i + 1}`} width={200} height={200} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            ))}
            <span className="text-sm text-muted-foreground">
              ({product.rating.toFixed(1)}) {product.reviewCount} reviews
            </span>
          </div>

          <p className="text-4xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Qty + buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <Button size="sm" variant="ghost" disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}>-</Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
                <Button size="sm" variant="ghost" onClick={() => setQty(qty + 1)}>+</Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={addToCart} size="lg" className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg"><Heart className="h-5 w-5 mr-2" />Wishlist</Button>
              <Button variant="outline" size="lg"><Share2 className="h-5 w-5 mr-2" />Share</Button>
            </div>
          </div>

          <Separator />

          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">SKU:</span><span>{product.id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span>{product.category}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Availability:</span><span className="text-green-600">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
