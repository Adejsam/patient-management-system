// File Path: types/patient.d.ts
export interface Patient {
  patient_id: string;
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string; // Change from Date to string
  gender: "Male" | "Female" | "Other" | "Prefer Not to Say";
  photo_upload?: string; // Change from File to string
  primary_phone_number: string;
  alternate_phone_number?: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  blood_group?: string;
  known_allergies?: string;
  pre_existing_conditions?: string;
  primary_physician?: string;
  insurance_number?: string;
  insurance_provider?: string;
  marital_status: string; // Change from enum to string
  occupation?: string;
}