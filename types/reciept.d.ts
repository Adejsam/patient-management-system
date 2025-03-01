export interface BillItem {
    description: string;
    amount: number;
  }
  
  export interface Patient {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }
  
  export interface Receipt {
    id: string
    receiptNumber: string;
    date: Date;
    items: BillItem[];
    totalAmount: number;
    status: "paid" | "partially paid";
    balanceAmount: number | null;
    patient: Patient;
    paymentMethod: "cash" | "card" | "bank-transfer";
  }