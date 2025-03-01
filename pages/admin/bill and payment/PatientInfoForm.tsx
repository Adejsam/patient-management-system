import React from 'react';
import { UseFormReturn, Path } from 'react-hook-form';
import { Input } from "../../components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { ReceiptFormValues, InvoiceFormValues } from '../../admin/bill and payment/payment-forms';

type FormValues = ReceiptFormValues | InvoiceFormValues;

interface PatientInfoFormProps<T extends FormValues> {
  form: UseFormReturn<T>;
  prefix: 'patient';
}

const patientFields = [
  { 
    name: 'name' as const, 
    label: 'Patient Name', 
    type: 'text' as const, 
    placeholder: 'Enter patient name',
    required: true 
  },
  { 
    name: 'email' as const, 
    label: 'Email', 
    type: 'email' as const, 
    placeholder: 'Enter email',
    required: true 
  },
  { 
    name: 'phone' as const, 
    label: 'Phone', 
    type: 'tel' as const, 
    placeholder: 'Enter phone number',
    required: true 
  },
  { 
    name: 'address' as const, 
    label: 'Address', 
    type: 'text' as const, 
    placeholder: 'Enter address',
    required: true 
  },
] as const;

export const PatientInfoForm = <T extends FormValues>({ 
  form, 
  prefix 
}: PatientInfoFormProps<T>) => {
  return (
    <div className="col-span-2 grid grid-cols-2 md:grid-cols-1 gap-4 border p-4 rounded-lg mb-4">
      {patientFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={`${prefix}.${field.name}` as Path<T>}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full"
                  aria-required={field.required}
                  value={formField.value as string || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};