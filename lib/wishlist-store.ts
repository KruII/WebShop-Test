import { create } from "zustand"

export interface WishItem {
  id: number
  name: string
  price: number
  image: string
  slug: string
}

interface WishState {
  open: boolean
  items: Record<number, WishItem>
  /* istniejące */
  toggleOpen: () => void
  add: (item: WishItem) => void
  remove: (id: number) => void
  /* NOWE ⬇⬇⬇ */
  has: (id: number) => boolean
  toggle: (item: WishItem) => void
}

export const useWishlist = create<WishState>((set, get) => ({
  open: false,
  items: {},

  toggleOpen: () => set(s => ({ open: !s.open })),

  add: (item) => set(s => ({ items: { ...s.items, [item.id]: item } })),

  remove: (id) => set(s => {
    const { [id]: _, ...rest } = s.items
    return { items: rest }
  }),

  /* ---------- nowe helpery ---------- */
  has: (id) => !!get().items[id],

  toggle: (item) => {
    const { has, add, remove } = get()
    has(item.id) ? remove(item.id) : add(item)
  },
}))
