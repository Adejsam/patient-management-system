import React, { useEffect, useState } from "react";
import AdminLayout from "../../shared/layout/AdminLayout";
import Header from "../components/headers/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";
import AddInvoiceForm from "../components/forms/AddInvoiceForm";
import AddReceiptForm from "../components/forms/AddRecieptForm";

export default function AddPaymentDocumentPage() {
  const [mounted, setMounted] = useState(false);
  useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AdminLayout>
      <Seo title="Add Receipt and Invoice" />
      <Header
        title="Receipt and Invoice"
        breadcrumbLinkText="Home"
        breadcrumbLinkHref="/admin/dashboard"
      />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto pb-10">
        <div className="py-2 px-7">
          <h1 className="text-3xl font-bold mt-5 mb-2">
            Create <span className="text-primary">Payment</span>
          </h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight">
            Create Receipt and Invoices for your patient
          </h2>
        </div>
        <main className="flex-1 p-6">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Add Payment Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="receipt" className="w-full">
                <TabsList className="grid w-full grid-cols-2 gap-5">
                  <TabsTrigger value="receipt">Add Receipt</TabsTrigger>
                  <TabsTrigger value="invoice">Add Invoice</TabsTrigger>
                </TabsList>

                <TabsContent value="receipt">
                  <AddReceiptForm />
                </TabsContent>

                <TabsContent value="invoice">
                  <AddInvoiceForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminLayout>
  );
}

