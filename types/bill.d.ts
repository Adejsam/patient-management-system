export interface CommonFormValues {
  items: { description: string; amount: number }[];
  patient: {
    hospital_number: string;
  };
  date: Date | string; // allow string for compatibility with Zod and form serialization
}
