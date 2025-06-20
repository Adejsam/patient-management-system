import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Calendar } from "../../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";
import {
  receiptFormSchema,
  ReceiptFormValues,
} from "../../../admin components/bills and payment/payment-form"; // fixed import path
import { DynamicFormItems } from "../../../admin components/bills and payment/DynaminFormItems";

const AddReceiptForm = () => {
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

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      items: [{ description: "", amount: 0 }],
      status: "paid",
      balanceAmount: 0.0,
      paymentMethod: "cash",
      patient: {
        hospital_number: "",
      },
      date: new Date(),
      // receiptNumber: "", // optional, can be omitted or left as is
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

  const onSubmit = async (data: ReceiptFormValues) => {
    try {
      setIsLoading(true);
      const apiEndpoint = "http://localhost/hospital_api/add_receipt.php"; // Update with your backend URL

      const formData = {
        hospital_number: data.patient.hospital_number,
        total_amount: calculateTotal(data.items),
        payment_method: data.paymentMethod,
        items: data.items,
        status: data.status,
        balance_amount: data.balanceAmount || 0.0,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.message === "Receipt created successfully") {
        setMessage("Receipt created successfully! Receipt ID: " + result.receipt_id);
        setMessageType("success");
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting receipt:", error);
      setMessage("Error creating receipt. Please try again.");
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
                    {...formField}
                    type="text"
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

        <DynamicFormItems<ReceiptFormValues> form={form} minItems={1} />

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
                      selected={
                        field.value instanceof Date
                          ? field.value
                          : field.value
                          ? new Date(field.value)
                          : undefined
                      }
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
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partially paid">Partially Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("status") === "partially paid" && (
            <FormField
              control={form.control}
              name="balanceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      value={field.value ?? ""}
                      placeholder="Enter balance amount"
                      min="0"
                      step="0.01"
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-between p-4 bg-muted rounded-lg">
          <span className="font-semibold">Total Amount:</span>
          <span className="font-semibold">₦{calculateTotal(form.watch("items")).toFixed(2)}</span>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Receipt..." : "Create Receipt"}
        </Button>
      </form>
    </Form>
  );
};

export default AddReceiptForm;
