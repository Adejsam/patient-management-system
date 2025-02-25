import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";

import pdfMakeImport from "pdfmake/build/pdfmake";
import pdfFontsImport from "pdfmake/build/vfs_fonts";

interface BillItem {
  description: string;
  amount: number;
}

interface Bill {
  id: number;
  date: string;
  items: BillItem[];
  status: "unpaid" | "partially paid" | "paid";
}

const PaymentHistory: React.FC = () => {
  useTheme();
  const [bills, setBills] = useState<Bill[]>([]);
  const pdfMakeRef = useRef<typeof pdfMakeImport | null>(null);

  useEffect(() => {
    setBills([
      {
        id: 1,
        date: "2025-01-15",
        items: [
          { description: "Consultation Fee", amount: 100 },
          { description: "X-Ray", amount: 50 },
        ],
        status: "paid",
      },
      {
        id: 2,
        date: "2025-01-20",
        items: [
          { description: "Lab Test", amount: 200 },
          { description: "Blood Test", amount: 100 },
        ],
        status: "partially paid",
      },
      {
        id: 3,
        date: "2025-01-25",
        items: [{ description: "Medication", amount: 150 }],
        status: "paid",
      },
    ]);
  }, []);

  useEffect(() => {
    if (!pdfMakeRef.current) {
      const pdfMakeInstance = pdfMakeImport;
      const pdfFontsModule = pdfFontsImport as unknown as { pdfMake: { vfs: Record<string, string> } };

      if (pdfMakeInstance && pdfFontsModule.pdfMake) {
        pdfMakeInstance.vfs = pdfFontsModule.pdfMake.vfs;
        pdfMakeRef.current = pdfMakeInstance;
      }
    }
  }, []);

  const handlePrint = (bill: Bill) => {
    if (!pdfMakeRef.current) {
      console.error("pdfMake is not loaded yet.");
      return;
    }

    const totalAmount = bill.items.reduce((sum, item) => sum + item.amount, 0);

    const docDefinition = {
      content: [
        { text: "Receipt", style: "header" },
        { text: `Patient Name: John Doe`, style: "subheader" },
        { text: `Receipt Number: ${bill.id}`, style: "subheader" },
        { text: `Date: ${bill.date}`, style: "subheader" },
        { text: `Hospital Name: XYZ Hospital`, style: "subheader" },
        { text: `Hospital Address: 123 Main St, City, Country`, style: "subheader" },
        { text: `Hospital Number: +1234567890`, style: "subheader" },
        { text: " " },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: [
              [{ text: "Description", bold: true }, { text: "Amount (₦)", bold: true }],
              ...bill.items.map((item) => [item.description, `₦${item.amount}`]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        { text: `Total Amount: ₦${totalAmount}`, style: "total", margin: [0, 10, 0, 0] },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, margin: [0, 5, 0, 5] },
        total: { fontSize: 14, bold: true },
      },
    };

    pdfMakeRef.current.createPdf(docDefinition).download(`Receipt_${bill.id}.pdf`);
  };

  return (
    <PatientLayout>
      <Seo title="Payment History" />
      <Header title="Payment History" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl font-bold pt-7 mb-2 pl-4">
          Your <span className="text-primary">Payment History</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight">View Your Paid Bills</h2>
        <div className="p-4 my-5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 pt-4 pb-8">
            {bills.filter((bill) => bill.status !== "unpaid").map((bill) => (
              <div key={bill.id} className="border p-4 rounded-lg shadow-md relative">
                <p className="pb-2">
                  <strong>Date:</strong> {bill.date}
                </p>
                <p className="pb-2">
                  <strong>Total Amount:</strong> ₦
                  {bill.items.reduce((sum, item) => sum + item.amount, 0)}
                </p>
                <button
                  onClick={() => handlePrint(bill)}
                  className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Print Receipt
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PaymentHistory;
