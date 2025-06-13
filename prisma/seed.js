import { faker } from '@faker-js/faker'
import slugify from 'slugify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES = ['Electronics', 'Home', 'Clothing', 'Accessories', 'Sports']

const main = async () => {
  const products = Array.from({ length: 1000 }).map(() => {
    const name = faker.commerce.productName()
    return {
      name,
      slug: slugify(name, { lower: true, strict: true }),
      price: Number(faker.commerce.price({ min: 10, max: 999, dec: 2 })),
      category: faker.helpers.arrayElement(CATEGORIES),
      description: faker.commerce.productDescription(),
      images: [
        faker.image.urlLoremFlickr({ category: 'product', width: 400, height: 400 }),
        faker.image.urlLoremFlickr({ category: 'product', width: 400, height: 400 }),
        faker.image.urlLoremFlickr({ category: 'product', width: 400, height: 400 }),
      ],
      stock: faker.number.int({ min: 5, max: 200 }),
      rating: Number(faker.number.float({ min: 2, max: 5, fractionDigits: 1 })),
      reviewCount: faker.number.int({ min: 0, max: 250 }),
    }
  })

  await prisma.product.createMany({ data: products, skipDuplicates: true })

  console.log(`✅ Inserted ${products.length} products`)
}

main().finally(() => prisma.$disconnect())
