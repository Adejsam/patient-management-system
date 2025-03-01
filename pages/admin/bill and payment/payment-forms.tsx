import { z } from "zod";

export const billItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
});

export const patientSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const receiptFormSchema = z.object({
  receiptNumber: z.string().min(1, "Receipt number is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  items: z.array(billItemSchema).min(1, "At least one item is required"),
  status: z.enum(["paid", "partially paid"]),
  balanceAmount: z.number().nullable(),
  patient: patientSchema,
  paymentMethod: z.enum(["cash", "card", "bank-transfer"]),
});

export const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  items: z.array(billItemSchema).min(1, "At least one item is required"),
  patient: patientSchema,
  paymentTerms: z.enum(["net-15", "net-30", "net-45", "net-60"]),
});

export type BillItem = z.infer<typeof billItemSchema>;
export type Patient = z.infer<typeof patientSchema>;
export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;