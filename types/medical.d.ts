// types/medical.ts

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
  }
  
  export interface MedicalRecordData {
    // Patient Information
    name: string;
    dateOfBirth: string;
    gender: string;
    contactDetails: string;
    
    // Visit Information
    date: string;
    doctor: string;
    field: string;
    
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
    nursingNotes: string;
  }
  
  // Optional: You might want to add these additional types for future use
  export type Gender = 'Male' | 'Female' | 'Other';
  
  export interface VitalSigns {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  }
  
  export interface Appointment {
    id: string;
    date: string;
    time: string;
    doctor: string;
    department: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }
  
  export interface Insurance {
    provider: string;
    policyNumber: string;
    validFrom: string;
    validUntil: string;
    coverageType: string;
  }
  
  // You can add more specific types for different medical specialties
  export interface Cardiology extends MedicalRecord {
    ecgResults?: string;
    bloodPressureReadings?: {
      systolic: number;
      diastolic: number;
      timestamp: string;
    }[];
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
    CARDIOLOGY = 'Cardiology',
    DERMATOLOGY = 'Dermatology',
    NEUROLOGY = 'Neurology',
    ORTHOPEDICS = 'Orthopedics',
    PEDIATRICS = 'Pediatrics',
    PSYCHIATRY = 'Psychiatry',
    GENERAL_MEDICINE = 'General Medicine',
    EMERGENCY = 'Emergency Medicine'
  }
  
  export enum RecordStatus {
    DRAFT = 'draft',
    FINAL = 'final',
    AMENDED = 'amended',
    DELETED = 'deleted'
  }
  
  export enum VisitType {
    ROUTINE_CHECKUP = 'Routine Checkup',
    EMERGENCY = 'Emergency',
    FOLLOW_UP = 'Follow-up',
    CONSULTATION = 'Consultation',
    PROCEDURE = 'Procedure'
  }
  
  // Utility type for creating partial records
  export type PartialMedicalRecord = Partial<MedicalRecord>;
  
  // Type for medical record updates
  export interface MedicalRecordUpdate {
    recordId: string;
    updatedFields: PartialMedicalRecord;
    updatedBy: string;
    updateDate: string;
    reason: string;
  }
  
  // Type for medical record access log
  export interface MedicalRecordAccess {
    recordId: string;
    accessedBy: string;
    accessDate: string;
    accessReason: string;
    accessType: 'view' | 'edit' | 'print' | 'export';
  }
  
  // Type for file attachments
  export interface MedicalAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: string;
    uploadedBy: string;
    category: 'lab_result' | 'imaging' | 'prescription' | 'other';
    description?: string;
    url: string;
  }
  
  // Type for medical record permissions
  export interface MedicalRecordPermissions {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canExport: boolean;
    canShare: boolean;
  }
  
  // Type for audit trail
  export interface AuditTrail {
    action: string;
    performedBy: string;
    timestamp: string;
    details: string;
    ipAddress: string;
    systemInfo: string;
  }