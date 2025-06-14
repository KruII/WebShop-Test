"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Share2, ShoppingCart, Star } from "lucide-react"
import * as HoverCard from "@radix-ui/react-hover-card"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/store"
import { useWishlist } from "@/lib/wishlist-store"

export interface Product {
  id: number
  slug: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  rating: number
  reviewCount: number
  stock: number
  comments?: { user: string; text: string }[] /* opcjonalne */
  image?: string
}

interface Props {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: Props) {
  const addItem           = useCartStore(s => s.addItem)
  const { add, remove, items } = useWishlist()
  const wished = !!items[product.id]

  /* --- actions --- */
  const addToCart = () =>
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image ?? product.images?.[0] ?? "/placeholder.svg",
    })

  const share = async () => {
    const url = `${location.origin}/product/${product.slug}`
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
  }

  const toggleWish = () => {
    wished
      ? remove(product.id)
      : add({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: cover,
        })
  }


  /* --- card cover --- */
  const cover = product.image ?? product.images?.[0] ?? "/placeholder.svg"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <HoverCard.Root openDelay={150}>
        <HoverCard.Trigger asChild>
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

            <CardContent className="p-4 space-y-2">
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {/* ⭐ rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product.reviewCount})
                </span>
              </div>

              <p className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button onClick={addToCart} size="sm" className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-1" /> Cart
              </Button>
              <Button
                onClick={toggleWish}
                size="sm"
                variant={wished ? "default" : "outline"}
              >
                <Heart
                  className="h-4 w-4"
                  fill={wished ? "currentColor" : "none"}
                />
              </Button>
              <Button onClick={share} size="sm" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </HoverCard.Trigger>

        {/* ------------- HOVERCARD CONTENT ------------- */}
        <HoverCard.Content
          side="right"
          className="w-64 rounded-lg border bg-background p-4 shadow-xl space-y-3"
        >
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>

          <div className="text-sm flex items-center gap-2">
            <span className="font-medium">In stock:</span>
            <span className={product.stock ? "text-green-600" : "text-red-600"}>
              {product.stock}
            </span>
          </div>

          {/* Komentarze (max 3) */}
          {product.comments?.length ? (
            <div className="space-y-1">
              {product.comments.slice(0, 3).map((c, i) => (
                <p key={i} className="text-xs">
                  <span className="font-semibold">{c.user}:</span>{" "}
                  {c.text.slice(0, 60)}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No comments yet.</p>
          )}
        </HoverCard.Content>
      </HoverCard.Root>
    </motion.div>
  )
}
