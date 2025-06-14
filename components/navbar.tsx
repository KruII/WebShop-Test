"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCartStore } from "@/lib/store"
import { useWishlist } from "@/lib/wishlist-store"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { WishlistDrawer } from "@/components/wishlist-drawer"   // ✔ poprawny import

export function Navbar() {
  const { getTotalItems, openCart } = useCartStore()
  const totalItems = getTotalItems()

  const { toggleOpen, items } = useWishlist()
  const totalFavs = Object.keys(items).length

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">

        {/* ---------- logo + linki ---------- */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">DropMaster</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
          </nav>
        </div>

        {/* ---------- prawa strona ---------- */}
        <div className="flex items-center gap-4">
          {/* search (desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="w-64" />
          </div>

          <ThemeToggle />

          {/* ---------- Wishlist ---------- */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleOpen}               // otwiera WishlistDrawer
            className="relative"
            aria-label={`Wishlist with ${totalFavs} items`}
          >
            <Heart className="h-5 w-5" />
            {totalFavs > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {totalFavs}
              </span>
            )}
          </Button>

          {/* ---------- Koszyk ---------- */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {/* ---------- menu mobilne ---------- */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              {/* linki + search w mobile */}
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Drawer wishlisty – tylko raz, poza główną siatką */}
      <WishlistDrawer />
    </header>
  )
}
