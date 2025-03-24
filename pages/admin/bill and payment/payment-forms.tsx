
import { z } from "zod";

export const billItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
});

export const patientSchema = z.object({
  hospital_number: z.string().min(1, "Patient name is required"),
});

export const receiptFormSchema = z.object({
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
  formType: z.enum(["invoice", "receipt"]).default("invoice"),
  date: z.date({
    required_error: "Date is required",
  }),
  items: z.array(billItemSchema).min(1, "At least one item is required"),
  patient: patientSchema,
  status: z.enum(["paid", "pending", "partially paid", "cancelled"]).default("pending"),
});

export type BillItem = z.infer<typeof billItemSchema>;
export type Patient = z.infer<typeof patientSchema>;
export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;