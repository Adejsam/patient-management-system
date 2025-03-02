
export interface CommonFormValues {
  items: { description: string; amount: number }[];
  patient: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  date: Date;
}