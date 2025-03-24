export interface Patient {
    hospital_number: string
  }
  
  export interface BillItem {
    description: string;
    amount
  }
  
  export interface Invoice {
    invoiceNumber: number;
    date: Date;
    items: BillItem[];
    patient: Patient;
    totalAmount: number;
    status: "paid" | "pending" | "cancelled" ;
  }