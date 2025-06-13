import { z } from "zod"

export const checkoutSchema = z.object({
  // Address step
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number must be at least 9 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().min(2, "Country must be selected"),

  // Shipping step
  shippingMethod: z.enum(["standard", "express", "overnight"]),

  // Payment step
  paymentMethod: z.enum(["card", "paypal", "bnpl"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
