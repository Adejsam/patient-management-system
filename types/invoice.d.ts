export interface Patient {
    hospital_number: string
  }
  
  export interface BillItem {
    description: string;
    amount
  }
  
  export interface Invoice {
    id: string;
    invoiceNumber: string;
    date: Date;
    items: BillItem[];
    patient: Patient;
    status: string;
    totalAmount: number;
  }