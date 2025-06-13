"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, CreditCard, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import { checkoutSchema, type CheckoutFormData } from "@/lib/schemas"

const steps = [
  { id: 1, name: "Address", icon: MapPin },
  { id: 2, name: "Shipping", icon: Truck },
  { id: 3, name: "Payment", icon: CreditCard },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: "standard",
      paymentMethod: "card",
    },
  })

  const watchedPaymentMethod = watch("paymentMethod")

  const onSubmit = async (data: CheckoutFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearCart()
    router.push("/order-confirmation")
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Address */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" {...register("address")} className={errors.address ? "border-red-500" : ""} />
                      {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} className={errors.city ? "border-red-500" : ""} />
                        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          {...register("postalCode")}
                          className={errors.postalCode ? "border-red-500" : ""}
                        />
                        {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select onValueChange={(value) => setValue("country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="PL">Poland</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue="standard"
                      onValueChange={(value) => setValue("shippingMethod", value as any)}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Standard Shipping</p>
                              <p className="text-sm text-muted-foreground">5-7 business days</p>
                            </div>
                            <p className="font-medium">Free</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Express Shipping</p>
                              <p className="text-sm text-muted-foreground">2-3 business days</p>
                            </div>
                            <p className="font-medium">$9.99</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <Label htmlFor="overnight" className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Overnight Shipping</p>
                              <p className="text-sm text-muted-foreground">Next business day</p>
                            </div>
                            <p className="font-medium">$24.99</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup defaultValue="card" onValueChange={(value) => setValue("paymentMethod", value as any)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bnpl" id="bnpl" />
                        <Label htmlFor="bnpl">Buy Now, Pay Later</Label>
                      </div>
                    </RadioGroup>

                    {watchedPaymentMethod === "card" && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" {...register("cardNumber")} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" {...register("expiryDate")} />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" {...register("cvv")} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input id="cardholderName" {...register("cardholderName")} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${getTotalPrice().toFixed(2)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>

                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>${(getTotalPrice() * 0.1).toFixed(2)}</p>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <p>${(getTotalPrice() * 1.1).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
