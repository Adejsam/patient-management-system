import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import LightLogo from "../../public/assets/icons/logo-full-light.png";
import DarkLogo from "../../public/assets/icons/logo-full.svg";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Printer, Download } from "lucide-react";
import { PDFInvoiceGenerator, InvoiceOrReceipt } from "../../services/PDFInvoiceGenerator";

const SAMPLE_INVOICES: InvoiceOrReceipt[] = [
  {
    receiptNumber: "INV-19438489",
    date: "2025-01-15",
    amount: "₦7500",
    status: "Paid",
    customerInfo: {
      name: "Mary Olusegun Aina",
      address: "123 Healthcare Ave, Medical City, MC 12345",
      email: "maryosegun@gmail.com",
    },
    services: [
      { description: "Consultation Fee", amount: "V3000", quantity: 1 },
      { description: "Lab Tests", amount: "V3000", quantity: 2 },
      { description: "Medication", amount: "₦1500", quantity: 1 },
    ],
  },
];

const SAMPLE_RECEIPTS: InvoiceOrReceipt[] = [
  {
    receiptNumber: "REC-9283754829",
    date: "2025-01-15",
    amount: "₦7500",
    method: "Credit Card",
    customerInfo: {
      name: "Mary Olusegun Aina",
      address: "13, german street Ikeja Lagos Nigeria",
      email: "maryosegun@gmail.com",
    },
    services: [
      { description: "Consultation Fee", amount: "V3000", quantity: 1 },
      { description: "Lab Tests", amount: "V3000", quantity: 2 },
      { description: "Medication", amount: "₦1500", quantity: 1 },
    ],
  },
];

export default function BillingPage() {
  const { resolvedTheme } = useTheme();

  const [view, setView] = useState<"invoices" | "receipts">("invoices");
  const pdfGenerator = new PDFInvoiceGenerator();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleGeneratePDF = async (data: InvoiceOrReceipt, type: string) => {
    const imgSrc = resolvedTheme === "dark" ? DarkLogo.src : LightLogo.src;

    try {
      const doc = await pdfGenerator.generatePDF(data, type, imgSrc);
      doc.save(`${data.receiptNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const renderBillingItem = (item: InvoiceOrReceipt) => (
    <div
      key={item.receiptNumber}
      className="border p-4 rounded-lg shadow-md flex flex-col space-y-2 mb-10">
      <div className="flex justify-between">
        <span className="font-semibold">Receipt Number:</span>
        <span>{item.receiptNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Customer Name:</span>
        <span>{item.customerInfo.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Date:</span>
        <span>{item.date}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Amount:         </span>
        <span>{item.amount}</span>
      </div>
      {item.status && (
        <div className="flex justify-between">
          <span className="font-semibold">Status:</span>
          <span>{item.status}</span>
        </div>
      )}
      {item.method && (
        <div className="flex justify-between">
          <span className="font-semibold">Payment Method:</span>
          <span>{item.method}</span>
        </div>
      )}
      <div className="flex space-x-2 mt-2">
        <Button
          className="flex-1"
          onClick={() => handleGeneratePDF(item, view === "invoices" ? "Invoice" : "Receipt")}>
          <Printer className="w-4 h-4 mr-2" /> Print
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => handleGeneratePDF(item, view === "invoices" ? "Invoice" : "Receipt")}>
          <Download className="w-4 h-4 mr-2" /> Download
        </Button>
      </div>
    </div>
  );

  return (
    <PatientLayout>
      <Seo title="Billing History" />
      <Header title="Billing History" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl font-bold pt-7 mb-2 pl-4">
          Your <span className="text-primary">Billing History</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight">
          View Your Invoices and Receipts
        </h2>
        <div className="p-4 my-5 w-full">
          <div className="flex space-x-4 mb-4">
            <Button
              variant={view === "invoices" ? "default" : "secondary"}
              onClick={() => setView("invoices")}
              className="rounded-lg">
              View Invoices
            </Button>
            <Button
              variant={view === "receipts" ? "default" : "secondary"}
              onClick={() => setView("receipts")}
              className="rounded-lg">
              View Receipts
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {(view === "invoices" ? SAMPLE_INVOICES : SAMPLE_RECEIPTS).map(renderBillingItem)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
