import React, { useEffect, useState } from "react";
import AdminLayout from "../../shared/layout/AdminLayout";
import Header from "../components/headers/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";
import InvoiceTable from "../admin/bill and payment/invoice/invoiceTable";
import ReceiptTable from "../admin/bill and payment/reciept/RecieptTable";

export default function PaymentDocumentsPage() {
  const [mounted, setMounted] = useState(false);
  useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Seo title="Payment Documents" />
      <Header
        title="Payment Documents"
        breadcrumbLinkText="Home"
        breadcrumbLinkHref="/admin/dashboard"
      />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto pb-10 md-h-[100vh]">
        <div className="py-2 px-4">
          <h1 className="text-3xl font-bold mt-5 mb-2">
            Payment <span className="text-primary">Documents</span>
          </h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight">
            View and manage your invoices and receipts
          </h2>
        </div>
        <main className="flex-1 py-6 px-4">
          <Tabs defaultValue="invoice" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invoice">Invoices</TabsTrigger>
              <TabsTrigger value="receipt">Receipts</TabsTrigger>
            </TabsList>

            <TabsContent value="invoice">
              <InvoiceTable />
            </TabsContent>

            <TabsContent value="receipt">
              <ReceiptTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

PaymentDocumentsPage.getLayout = (page: React.ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>;
};
