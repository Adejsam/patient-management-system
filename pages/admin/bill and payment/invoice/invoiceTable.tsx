import { DataTable } from "./data-table";
import { Invoice, columns } from "./column";
import { useEffect, useState } from "react";

function getData(): Promise<Invoice[]> {
  // Fetch data from your API here.
  return Promise.resolve([
    {
      id: "1",
      invoiceNumber: "INV-2015890231",
      date: new Date("2025-02-02"),
      patient: {
        id: "1",
        name: "Emeka Okafor",
      },
      items: [
        {
          description: "Consultation Fee",
          amount: 5000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 5000,
    },
    {
      id: "2",
      invoiceNumber: "INV-6023910372",
      date: new Date("2025-03-01"),
      patient: {
        id: "2",
        name: "Aisha Bello",
      },
      items: [
        {
          description: "Medicine",
          amount: 2000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 2000,
    },
    {
      id: "3",
      invoiceNumber: "INV-9231201943",
      date: new Date("2025-01-27"),
      patient: {
        id: "3",
        name: "Chinedu Uche",
      },
      items: [
        {
          description: "Lab Tests",
          amount: 3000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 3000,
    },
    {
      id: "4",
      invoiceNumber: "INV-9092389567",
      date: new Date("2025-01-24"),
      patient: {
        id: "2",
        name: "Aisha Bello",
      },
      items: [
        {
          description: "Medicine",
          amount: 2000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 2000,
    },
    {
      id: "5",
      invoiceNumber: "INV-9082735628",
      date: new Date("2025-03-03"),
      patient: {
        id: "3",
        name: "Chinedu Uche",
      },
      items: [
        {
          description: "Lab Tests",
          amount: 3000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 3000,
    },
    {
      id: "6",
      invoiceNumber: "INV-0128348902",
      date: new Date("2025-02-23"),
      patient: {
        id: "2",
        name: "Aisha Bello",
      },
      items: [
        {
          description: "Medicine",
          amount: 2000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 2000,
    },
    {
      id: "7",
      invoiceNumber: "INV-70734827390",
      date: new Date("2025-03-03"),
      patient: {
        id: "3",
        name: "Chinedu Uche",
      },
      items: [
        {
          description: "Lab Tests",
          amount: 3000,
        },
      ],
      paymentTerms: "Due in 30 days",
      status: "pending",
      totalAmount: 3000,
    },
  ]);
}

export default function Invoices() {
  const [data, setData] = useState<Invoice[]>([]);

  useEffect(() => {
    getData().then((invoices) => setData(invoices));
  }, []);

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
