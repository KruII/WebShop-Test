/* prisma/seed-orders.ts --------------------------------------------------- */
import { faker } from '@faker-js/faker'
import { PrismaClient, OrderStatus } from '@prisma/client'

const prisma = new PrismaClient()

const ORDER_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
]

const PAYMENT_METHODS = ['card', 'paypal', 'apple_pay', 'google_pay']

async function main() {
  /* 1️⃣  pobieramy produkty */
  const products = await prisma.product.findMany({ select: { id: true, price: true } })
  if (!products.length) throw new Error('No products found – run product seed first')

  /* 2️⃣  seedujemy ~1000 userów */
  const users = await prisma.$transaction(async (tx) => {
    const data = Array.from({ length: 1_000 }).map(() => ({
      email: faker.internet.email().toLowerCase(),
      country: faker.location.country(),
      ageRange: faker.helpers.arrayElement(['18-24', '25-34', '35-44', '45-54']),
      gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    }))
    await tx.user.createMany({ data, skipDuplicates: true })
    return tx.user.findMany({ select: { id: true } })
  })

  /* 3️⃣  zamówienia */
  const ordersToCreate = 5_000
  const orderBatchSize = 250      // duże batch-e są szybsze

  for (let batch = 0; batch < ordersToCreate; batch += orderBatchSize) {
    const ordersData = Array.from({ length: orderBatchSize }).map(() => {
      // losowy user + 1-4 produktów
      const user     = faker.helpers.arrayElement(users)
      const lines    = faker.helpers.arrayElements(products, { min: 1, max: 4 })
      const details  = lines.map((p) => {
        const qty   = faker.number.int({ min: 1, max: 5 })
        const total = p.price * qty
        return {
          productId: p.id,
          quantity:  qty,
          totalPrice: total,
        }
      })
      const orderTotal = details.reduce((sum, d) => sum + d.totalPrice, 0)

      return {
        userId: user.id,
        orderDate: faker.date.recent({ days: 90 }),
        status: faker.helpers.arrayElement(ORDER_STATUSES),
        total: orderTotal,
        details: { create: details },
        payments: {
          create: {
            amount: orderTotal,
            method: faker.helpers.arrayElement(PAYMENT_METHODS),
            status: 'paid',
            paymentDate: faker.date.recent({ days: 90 }),
          },
        },
      }
    })

    await prisma.order.createMany({
      data: ordersData.map(({ details, payments, ...rest }) => rest),
      skipDuplicates: true,
    })

    /* musimy osobno dodać details/payments, bo createMany nie obsługuje relacji */
    const createdIds = await prisma.order.findMany({
      orderBy: { id: 'desc' },
      take: orderBatchSize,
      select: { id: true },
    })

    await Promise.all(
      createdIds.map((o, idx) =>
        prisma.order.update({
          where: { id: o.id },
          data: {
            details: { create: ordersData[idx].details.create },
            payments: { create: ordersData[idx].payments.create },
          },
        }),
      ),
    )

    console.log(`✅  Inserted ${batch + orderBatchSize} / ${ordersToCreate} orders`)
  }

  console.log('🎉  Fake orders, details & payments seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
