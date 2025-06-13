"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/store"

/* ⇢ typ zgodny z bazą */
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  image?: string            // fallback, gdyby istniało
  category: string
  rating: number
  reviewCount: number
  stock: number
}

interface Props {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image ?? product.images?.[0] ?? "/placeholder.svg",
    })
  }

  const cover = product.image ?? product.images?.[0] ?? "/placeholder.svg"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={cover}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAdd} className="w-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
