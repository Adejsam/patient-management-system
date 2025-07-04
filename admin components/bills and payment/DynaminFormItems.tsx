import React from "react";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Plus, Trash2 } from "lucide-react";
import { BillItem } from "./payment-form";

// Make DynamicFormItems generic with FieldValues constraint
interface DynamicFormItemsProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  minItems?: number;
}

export const DynamicFormItems = <
  TFormValues extends { items: BillItem[]; formType?: string } & FieldValues
>({
  form,
  minItems = 1,
}: DynamicFormItemsProps<TFormValues>) => {
  // Use typed path for watch/getValues/setValue
  const items = (form.watch("items" as Path<TFormValues>) as BillItem[]) || [];

  const formValues = form.getValues();

  const handleAddItem = () => {
    try {
      const currentItems = (form.getValues("items" as Path<TFormValues>) as BillItem[]) || [];
      form.setValue(
        "items" as Path<TFormValues>,
        [...currentItems, { description: "", amount: 0 }] as PathValue<
          TFormValues,
          Path<TFormValues>
        >,
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }
      );
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleRemoveItem = (index: number) => {
    try {
      const currentItems = (form.getValues("items" as Path<TFormValues>) as BillItem[]) || [];
      if (currentItems.length > minItems) {
        const newItems = currentItems.filter((_, i) => i !== index);
        form.setValue(
          "items" as Path<TFormValues>,
          newItems as PathValue<TFormValues, Path<TFormValues>>,
          {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          }
        );
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (value: number) => void; onBlur: () => void },
    index: number
  ) => {
    try {
      const value = event.target.value;
      const numericValue = value === "" ? 0 : parseFloat(value);
      if (!isNaN(numericValue)) {
        field.onChange(numericValue);

        const currentItems = form.getValues("items" as Path<TFormValues>) as BillItem[];
        currentItems[index].amount = numericValue;
        form.setValue(
          "items" as Path<TFormValues>,
          currentItems as PathValue<TFormValues, Path<TFormValues>>,
          { shouldValidate: true }
        );
      }
    } catch (error) {
      console.error("Error handling amount change:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Items</Label>
      {items.map((item: BillItem, index: number) => (
        <div key={index} className="flex gap-2 items-start">
          <FormField
            control={form.control}
            name={`items.${index}.description` as Path<TFormValues>}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`${
                      formValues.formType === "invoice"
                        ? "Invoice"
                        : formValues.formType === "receipt"
                        ? "Receipt"
                        : "Item"
                    } item description`}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.${index}.amount` as Path<TFormValues>}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => handleAmountChange(e, field, index)}
                    onBlur={field.onBlur}
                    value={field.value || ""}
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
              className="flex-shrink-0 bg-red-300 "
              title="Remove item">
              <Trash2 className="h-5 w-5 text-red-800" />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddItem} className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Add {formValues.formType === "invoice" ? "Invoice" : "Receipt"} Item
      </Button>
    </div>
  );
};
