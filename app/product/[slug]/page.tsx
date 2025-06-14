/* SERVER COMPONENT */

import { prisma } from "@/lib/prisma"
import ClientPart from "./product-client"

interface Props {
  params: Promise<{ slug: string }> | { slug: string }  // ⬅️ może być Promise
}

export default async function ProductPage({ params }: Props) {
  // 1. awaituj paramy
  const { slug } = await params

  // 2. pobierz produkt
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return <h2 className="text-center py-20">Product not found</h2>
  }

  // 3. przekaż do komponentu klienckiego
  return <ClientPart product={product} />
}
