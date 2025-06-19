// src/admin/bill-and-payment/payment-forms.ts

import { CommonFormValues } from "../../../types/bill";
import { z } from "zod";

// BillItem type for use in DynamicFormItems
export type BillItem = {
  description: string;
  amount: number;
};

export interface InvoiceFormValues extends CommonFormValues {
  formType: "invoice";
  invoiceNumber: string;
}

export interface ReceiptFormValues extends CommonFormValues {
  formType: "receipt";
  receiptNumber?: string; // made optional to match schema
  status: "paid" | "partially paid" | "cancelled"; // added "cancelled"
  balanceAmount: number | null;
  paymentMethod: "cash" | "credit-card" | "bank-transfer" | "card"; // added "card"
}

// Zod schema for ReceiptFormValues
export const receiptFormSchema = z.object({
  formType: z.literal("receipt"),
  receiptNumber: z.string().optional(),
  date: z.union([z.date(), z.string()]), // allow string for compatibility with form serialization
  status: z.enum(["paid", "partially paid", "cancelled"]),
  balanceAmount: z.number().nullable(),
  paymentMethod: z.enum(["cash", "credit-card", "bank-transfer", "card"]),
  items: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
    })
  ),
  patient: z.object({
    hospital_number: z.string(),
  }),
});

// Zod schema for InvoiceFormValues (if needed)
export const invoiceFormSchema = z.object({
  formType: z.literal("invoice"),
  invoiceNumber: z.string(),
  date: z.union([z.date(), z.string()]), // allow string for compatibility with form serialization
  status: z.enum(["paid", "pending", "partially paid", "cancelled"]),
  items: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
    })
  ),
  patient: z.object({
    hospital_number: z.string(),
  }),
});
