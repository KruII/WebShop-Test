"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Trash2, ShoppingCart } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-store"
import { useCartStore } from "@/lib/store"

export function WishlistDrawer() {
  const { open, toggleOpen, items, remove } = useWishlist()
  const { addItem } = useCartStore()

  const list = Object.values(items)

  const handleAdd = (id: number) => {
    const p = items[id]
    addItem({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
    })
  }

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetContent className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <X className="h-5 w-5 cursor-pointer" onClick={toggleOpen} />
            Wishlist ({list.length})
          </SheetTitle>
        </SheetHeader>

        {/* ---------- lista ---------- */}
        {list.length ? (
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                {/* kliknięcie obrazka / tytułu → strona produktu */}
                <Link href={`/product/${item.slug}`} onClick={toggleOpen} className="flex items-center gap-3 flex-1">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                </Link>

                {/* add to cart */}
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Add to cart"
                  onClick={() => handleAdd(item.id)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>

                {/* remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove from wishlist"
                  onClick={() => remove(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Your wishlist is empty.
          </p>
        )}

        <Button className="w-full mt-4" onClick={toggleOpen}>
          Continue Shopping
        </Button>
      </SheetContent>
    </Sheet>
  )
}
