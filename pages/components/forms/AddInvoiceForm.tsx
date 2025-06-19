import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState, useEffect } from "react";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";
import {
  invoiceFormSchema,
  type InvoiceFormValues,
} from "../../admin/bill and payment/payment-forms";
import { DynamicFormItems } from "../../admin/bill and payment/DynaminFormItems";

const AddInvoiceForm = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    
    if (userRole === "billing_officer") {
      setIsMounted(true);
    } else {
      // Redirect to unauthorized page if not a billing officer
      window.location.href = "/admin/unauthorized";
    }
  }, []);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      formType: "invoice",
      items: [{ description: "", amount: 0 }],
      patient: {
        hospital_number: "",
      },
      status: "pending",
      date: new Date(),
    },
  });
  
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add this useEffect to clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const calculateTotal = (items: { amount: number }[]) => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      setIsLoading(true);
      console.log("Form data:", data); // Debugging

      const apiEndpoint = "http://localhost/hospital_api/add_invoice.php";

      // Ensure hospital_number is a number
      const formData = {
        hospital_number: data.patient.hospital_number,
        total_amount: calculateTotal(data.items),
        items: data.items,
        status: data.status,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API Response:", response); // Debugging

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("API Result:", result); // Debugging

      if (result.message === "Invoice created successfully") {
        setMessage("Invoice created successfully! Invoice ID: " + result.invoice_id);
        setMessageType("success");
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      setMessage("Error creating invoice. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Add message display component */}
        {message && (
          <div
            className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg ${
              messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {message}
          </div>
        )}

        <div className="col-span-2 grid grid-cols-1 md:grid-cols-1 gap-4 border p-4 rounded-lg mb-4">
          <FormField
            control={form.control}
            name="patient.hospital_number"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  Hospital Number
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                  type="text"
                    {...formField}
                    placeholder="Enter hospital number"
                    className="w-full"
                    aria-required={true}
                    value={(formField.value as string) || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* FIX: Remove formType prop */}
        <DynamicFormItems<InvoiceFormValues> form={form} minItems={1} />

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between p-4 bg-muted rounded-lg">
          <span className="font-semibold">Total Amount:</span>
          <span className="font-semibold">₦{calculateTotal(form.watch("items")).toFixed(2)}</span>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Invoice..." : "Create Invoice"}
        </Button>
      </form>
    </Form>
  );
};

export default AddInvoiceForm;