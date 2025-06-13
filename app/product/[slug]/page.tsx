/* SERVER COMPONENT */
import { prisma } from "@/lib/prisma"
import ClientPart from "./product-client"

interface Props {
  params: { slug: string }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) {
    // Next.js 14:
    return <h2 className="text-center py-20">Product not found</h2>
  }

  return <ClientPart product={product} />
}
