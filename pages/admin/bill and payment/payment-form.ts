// src/admin/bill-and-payment/payment-forms.ts

import { CommonFormValues } from "../../../types/bill";

export interface InvoiceFormValues extends CommonFormValues {
  formType: "invoice";
  invoiceNumber: string;
}

export interface ReceiptFormValues extends CommonFormValues {
  formType: "receipt";
  receiptNumber: string;
  status: "paid" | "partially paid";
  balanceAmount: number | null;
  paymentMethod: "cash" | "credit-card" | "bank-transfer";
}
