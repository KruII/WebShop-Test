"use client"

import { motion } from "framer-motion"
import { Truck, RotateCcw, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const features = [
  {
    icon: Truck,
    title: "Dostawa 24h",
    description: "Szybka dostawa w ciągu 24 godzin na terenie całego kraju",
  },
  {
    icon: RotateCcw,
    title: "100 dni zwrotu",
    description: "Pełne prawo zwrotu produktu w ciągu 100 dni od zakupu",
  },
  {
    icon: CreditCard,
    title: "Płatność BNPL",
    description: "Kup teraz, zapłać później - elastyczne opcje płatności",
  },
]

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Witaj w <span className="text-primary">DropMaster</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Odkryj premium produkty z szybką dostawą, 100-dniowym prawem zwrotu i elastycznymi opcjami płatności.
              Twoje zakupy nigdy nie były tak proste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/products">Przeglądaj Produkty</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/about">Dowiedz się więcej</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Dlaczego DropMaster?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferujemy najlepsze warunki zakupów online z pełnym wsparciem dla naszych klientów
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Gotowy na zakupy?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Dołącz do tysięcy zadowolonych klientów i odkryj nasze premium produkty już dziś
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/products">Rozpocznij zakupy</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
