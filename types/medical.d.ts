// types/medical.ts

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface MedicalRecordData {
  id: string;
  // Patient Information
  name: string;
  dateOfBirth: string;
  gender: string;
  contactDetails: string;

  // Visit Information
  date: string;
  doctor: string;
  field: string;

  //Vital Signs Information
  temperature: string;
  weight: string;
  heartRate: string;
  bloodPressure: string;

  // Clinical Information
  symptoms: string;
  allergies: string;
  diagnosis: string;

  // Laboratory Information
  labTests: string;
  labTestResults: string;

  // Medications
  medications: Medication[];

  // Notes
  doctorNotes: string;
}

// Optional: You might want to add these additional types for future use
export type Gender = "Male" | "Female" | "Other";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface Laboratory {
  testName: string;
  testDate: string;
  results: string;
  normalRange: string;
  interpretation: string;
  performedBy: string;
}

// Enums for standardization
export enum MedicalSpecialty {
  CARDIOLOGY = "Cardiology",
  DERMATOLOGY = "Dermatology",
  NEUROLOGY = "Neurology",
  ORTHOPEDICS = "Orthopedics",
  PEDIATRICS = "Pediatrics",
  PSYCHIATRY = "Psychiatry",
  GENERAL_MEDICINE = "General Medicine",
  EMERGENCY = "Emergency Medicine",
}

export enum RecordStatus {
  DRAFT = "draft",
  FINAL = "final",
  AMENDED = "amended",
  DELETED = "deleted",
}

export enum VisitType {
  ROUTINE_CHECKUP = "Routine Checkup",
  EMERGENCY = "Emergency",
  FOLLOW_UP = "Follow-up",
  CONSULTATION = "Consultation",
  PROCEDURE = "Procedure",
}

export interface MedicalRecordData {
  date: string;
  doctor: string;
  field: string;
  medicalRecord: {
    record_id: number;
    patient_id: number;
    visit_date: string;
    doctor: string;
    field: string;
    temperature: string;
    weight: string;
    heart_rate: number;
    blood_pressure: string;
    symptoms: string;
    allergies: string;
    diagnosis: string;
    lab_tests: string;
    lab_test_results: string;
    doctor_notes: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    primary_phone_number: string;
    hospital_number: number;
  };
  patientInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    hospitalNumber: number;
    phoneNumber: string;
  };
  medications: Array<{
    medicationId: number;
    name: string;
    dosage: string;
    frequency: string;
  }>;
}