
export interface CommonFormValues {
  items: { description: string; amount: number }[];
  patient: {
    hospital_number: string;
  };
  date: Date;
}