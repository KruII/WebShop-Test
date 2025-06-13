// /app/api/products/[slug]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface Context {
  params: { slug: string }
}

export async function GET(_: Request, { params }: Context) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}
