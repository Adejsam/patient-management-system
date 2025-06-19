import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import LightLogo from "../../public/assets/icons/logo-full-light.png";
import DarkLogo from "../../public/assets/icons/logo-full.svg";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Printer, Download } from "lucide-react";
import { PDFInvoiceGenerator } from "../../services/PDFInvoiceGenerator";
import axios from "axios";

interface APIInvoice {
  invoice_id: number;
  invoice_number: string;
  invoice_date: string;
  status: string;
  total_amount: string;
  items: Array<{
    item_id: number;
    description: string;
    amount: string;
  }>;
}

interface APIReceipt {
  receipt_id: number;
  receipt_number: string;
  receipt_date: string;
  status: string;
  total_amount: string;
  balance_amount: string;
  payment_method: string;
  items: Array<{
    item_id: number;
    description: string;
    amount: string;
  }>;
}

interface CustomerInfo {
  name: string;
  address: string;
  hospital_number: string;
}

export interface InvoiceOrReceipt {
  invoiceNumber?: string;
  receiptNumber?: string;
  customerInfo: CustomerInfo;
  date: string;
  amount: string;
  status?: string;
  method?: string;
  balanceAmount?: string;
  services?: Array<{
    description: string;
    amount: string;
  }>;
}

export default function BillingPage() {
  const { resolvedTheme } = useTheme();
  const [view, setView] = useState<"invoices" | "receipts">("invoices");
  const pdfGenerator = new PDFInvoiceGenerator();
  const [isMounted, setIsMounted] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceOrReceipt[]>([]);
  const [receipts, setReceipts] = useState<InvoiceOrReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [hospitalNumber, setHospitalNumber] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    // Get hospital number from local storage
    const storedHospitalNumber = localStorage.getItem("hospitalNumber");
    setHospitalNumber(storedHospitalNumber || "");

    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `http://localhost/hospital_api/patient_invoice.php?hospital_number=${hospitalNumber}`
        );
        const invoices = response.data.invoices.map((invoice: APIInvoice) => ({
          invoiceNumber: invoice.invoice_number,
          customerInfo: {
            name: response.data.patient.name,
            address: response.data.patient.address,
            hospital_number: response.data.patient.hospital_number,
          },
          date: invoice.invoice_date,
          amount: invoice.total_amount,
          status: invoice.status,
          services: invoice.items.map((item) => ({
            description: item.description,
            amount: item.amount,
          })),
        }));
        setInvoices(invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    const fetchReceipts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/hospital_api/patient_receipt.php?hospital_number=${hospitalNumber}`
        );
        const receipts = response.data.receipts.map((receipt: APIReceipt) => ({
          receiptNumber: receipt.receipt_number,
          customerInfo: {
            name: response.data.patient.name,
            address: response.data.patient.address,
            hospital_number: response.data.patient.hospital_number,
          },
          date: receipt.receipt_date,
          amount: receipt.total_amount,
          status: receipt.status,
          method: receipt.payment_method,
          balanceAmount: receipt.balance_amount,
          services: receipt.items.map((item) => ({
            description: item.description,
            amount: item.amount,
          })),
        }));
        setReceipts(receipts);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    Promise.all([fetchInvoices(), fetchReceipts()]).finally(() => setLoading(false));
  }, [hospitalNumber]);

  if (!isMounted) {
    return null;
  }

  const handleGeneratePDF = async (data: InvoiceOrReceipt, type: string) => {
    const imgSrc = resolvedTheme === "dark" ? DarkLogo.src : LightLogo.src;

    try {
      const doc = await pdfGenerator.generatePDF(data, type, imgSrc);
      doc.save(`${data.receiptNumber || data.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const renderBillingItem = (item: InvoiceOrReceipt) => (
    <div
      key={item.invoiceNumber || item.receiptNumber}
      className="border p-4 rounded-lg shadow-md flex flex-col space-y-2 mb-10">
      <div className="flex justify-between">
        <span className="font-semibold">
          {view === "invoices" ? "Invoice Number:" : "Receipt Number:"}
        </span>
        <span>{view === "invoices" ? item.invoiceNumber : item.receiptNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Customer Name:</span>
        <span className="capitalize">{item.customerInfo.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Date:</span>
        <span>{item.date}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Amount:</span>
        <span>₦{parseFloat(item.amount).toFixed(2)}</span>
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
      {item.balanceAmount !== undefined && (
        <div className="flex justify-between">
          <span className="font-semibold">Balance Amount:</span>
          <span>₦{parseFloat(item.balanceAmount).toFixed(2)}</span>
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

          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : invoices.length === 0 && receipts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No invoices or receipts found.
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {(view === "invoices" ? invoices : receipts).map(renderBillingItem)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
