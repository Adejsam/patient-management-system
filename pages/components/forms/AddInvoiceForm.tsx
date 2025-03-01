import React, { useEffect } from 'react';
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
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";
import { invoiceFormSchema, type InvoiceFormValues } from '../../admin/bill and payment/payment-forms';
import { DynamicFormItems } from '../../admin/bill and payment/DynaminFormItems';
import { PatientInfoForm } from '../../admin/bill and payment/PatientInfoForm';

const AddInvoiceForm = () => {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      items: [{ description: '', amount: 0 }],
      paymentTerms: "net-30",
      patient: {
        name: '',
        email: '',
        phone: '',
        address: ''
      }
    },
  });

  // Generate unique invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const prefix = `INV-${date.toISOString().slice(0, 10).replace(/-/g, '')}`;
    const suffix = Math.floor(10000 + Math.random() * 90000).toString();
    return `${prefix}-${suffix}`;
  };

  useEffect(() => {
    const invoiceNumber = generateInvoiceNumber();
    form.setValue('invoiceNumber', invoiceNumber);
  }, [form]);

  const calculateTotal = (items: { amount: number }[]) => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      console.log('Invoice Form Data:', data);
      // Add your API call here
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PatientInfoForm form={form} prefix="patient" />
        <DynamicFormItems form={form} formType="invoice" minItems={1} />
        
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter invoice number" 
                    readOnly 
                    className="bg-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between p-4 bg-muted rounded-lg">
          <span className="font-semibold">Total Amount:</span>
          <span className="font-semibold">
          ₦{calculateTotal(form.watch('items')).toFixed(2)}
          </span>
        </div>

        <Button type="submit" className="w-full">Create Invoice</Button>
      </form>
    </Form>
  );
};
export default AddInvoiceForm;