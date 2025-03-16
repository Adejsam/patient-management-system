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
    name: 'hospital_number' as const, 
    label: 'Hospital Number', 
    type: 'text' as const, 
    placeholder: 'Enter hospital number',
    required: true 
  },
  
] as const;

export const PatientInfoForm = <T extends FormValues>({ 
  form, 
  prefix 
}: PatientInfoFormProps<T>) => {
  return (
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-1 gap-4 border p-4 rounded-lg mb-4">
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