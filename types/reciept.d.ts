export interface BillItem {
    description: string;
    amount: number;
  }
  
  export interface Patient {
    hospital_number: string;
  }
  
  export interface Receipt {
    id: string
    receiptNumber: string;
    date: Date;
    items: BillItem[];
    totalAmount: number;
    status: "paid" | "partially paid" | "cancelled";
    balanceAmount: number | null;
    patient: Patient;
    paymentMethod: "cash" | "card" | "bank-transfer";
  }