import { DataTable } from "./data-table";
import { Receipt, columns } from "./column";
import { useEffect, useState } from "react";

function getData(): Promise<Receipt[]> {
  // Fetch data from your API here.
  return Promise.resolve([
    {
      id: "1",
      receiptNumber: "RCPT-0216298302",
      date: new Date("2025-01-01"),
      items: [
        {
          description: "Consultation Fee",
          amount: 5000,
        },
      ],
      totalAmount: 5000,
      status: "paid",
      balanceAmount: null,
      patient: {
        name: "Emeka Okafor",
        email: "emeka@example.com",
        phone: "+234-8023456789",
      },
      paymentMethod: "cash",
    },
    {
      id: "2",
      receiptNumber: "RCPT-0102826290",
      date: new Date("2025-02-02"),
      items: [
        {
          description: "Medicine",
          amount: 2000,
        },
      ],
      totalAmount: 2000,
      status: "partially paid",
      balanceAmount: 500,
      patient: {
        name: "Aisha Bello",
        email: "aisha@example.com",
        phone: "+234-8067891234",
      },
      paymentMethod: "card",
    },
    {
      id: "3",
      receiptNumber: "RCPT-3340972638",
      date: new Date("2025-02-03"),
      items: [
        {
          description: "Lab Tests",
          amount: 3000,
        },
      ],
      totalAmount: 3000,
      status: "paid",
      balanceAmount: null,
      patient: {
        name: "Chinedu Uche",
        email: "chinedu@example.com",
        phone: "+234-8095674321",
      },
      paymentMethod: "bank-transfer",
    },
    {
      id: "4",
      receiptNumber: "RCPT-9047293804",
      date: new Date("2025-03-01"),
      items: [
        {
          description: "Consultation Fee",
          amount: 5000,
        },
      ],
      totalAmount: 5000,
      status: "paid",
      balanceAmount: null,
      patient: {
        name: "Emeka Okafor",
        email: "emeka@example.com",
        phone: "+234-8023456789",
      },
      paymentMethod: "cash",
    },
    {
      id: "5",
      receiptNumber: "RCPT-50590367289",
      date: new Date("2025-02-22"),
      items: [
        {
          description: "Medicine",
          amount: 2000,
        },
      ],
      totalAmount: 2000,
      status: "partially paid",
      balanceAmount: 500,
      patient: {
        name: "Aisha Bello",
        email: "aisha@example.com",
        phone: "+234-8067891234",
      },
      paymentMethod: "card",
    },
    {
      id: "6",
      receiptNumber: "RCPT-6063273892",
      date: new Date("2025-02-05"),
      items: [
        {
          description: "Consultation Fee",
          amount: 5000,
        },
      ],
      totalAmount: 5000,
      status: "paid",
      balanceAmount: null,
      patient: {
        name: "Emeka Okafor",
        email: "emeka@example.com",
        phone: "+234-8023456789",
      },
      paymentMethod: "cash",
    },
    {
      id: "7",
      receiptNumber: "RCPT-5077812639",
      date: new Date("2025-02-25"),
      items: [
        {
          description: "Medicine",
          amount: 2000,
        },
      ],
      totalAmount: 2000,
      status: "partially paid",
      balanceAmount: 500,
      patient: {
        name: "Aisha Bello",
        email: "aisha@example.com",
        phone: "+234-8067891234",
      },
      paymentMethod: "card",
    },
  ]);
}

export default function Receipts() {
  const [data, setData] = useState<Receipt[]>([]);

  useEffect(() => {
    getData().then((receipts) => setData(receipts));
  }, []);

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl font-bold mb-4">Receipts</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
