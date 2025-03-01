import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { BillItem, ReceiptFormValues, InvoiceFormValues } from '../../admin/bill and payment/payment-forms';


interface DynamicFormItemsProps {
  form: UseFormReturn<InvoiceFormValues | ReceiptFormValues>;
  formType: 'receipt' | 'invoice';
  minItems?: number;
}

export const DynamicFormItems: React.FC<DynamicFormItemsProps> = ({
  form,
  formType,
  minItems = 1
}) => {
  const items = form.watch('items') || [];

  const handleAddItem = () => {
    try {
      const currentItems = form.getValues('items') || [];
      form.setValue('items', [
        ...currentItems,
        { description: '', amount: 0 }
      ], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleRemoveItem = (index: number) => {
    try {
      const currentItems = form.getValues('items') || [];
      if (currentItems.length > minItems) {
        const newItems = currentItems.filter((_, i) => i !== index);
        form.setValue('items', newItems, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (value: number) => void; onBlur: () => void },
    index: number
  ) => {
    try {
      const value = event.target.value;
      const numericValue = value === '' ? 0 : parseFloat(value);
      if (!isNaN(numericValue)) {
        field.onChange(numericValue);
        
        const currentItems = form.getValues('items');
        currentItems[index].amount = numericValue;
        form.setValue('items', currentItems, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error handling amount change:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Items</Label>
      {items.map((item: BillItem, index: number) => (
        <div key={index} className="flex gap-2 items-start">
          <FormField
            control={form.control}
            name={`items.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input 
                    {...field}
                    placeholder={`${formType === 'receipt' ? 'Receipt' : 'Invoice'} item description`}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.${index}.amount`}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => handleAmountChange(e, field, index)}
                    onBlur={field.onBlur}
                    value={field.value || ''}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    className="text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {items.length > minItems && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveItem(index)}
              className="flex-shrink-0 "
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddItem}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {formType === 'receipt' ? 'Receipt' : 'Invoice'} Item
      </Button>
    </div>
  );
};