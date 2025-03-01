interface DoctorDetails {
    medicalLicenseNumber: string;
    specialization: string;
  }
  
  interface AdminDetails {
    systemAccessLevel?: string;
    securityClearance?: string;
  }
  
  interface BillingOfficerDetails {
    certificationNumber?: string;
  }
  
  interface PharmacistDetails {
    pharmacyLicenseNumber: string;
  }
  
  interface ReceptionistDetails {
    trainingLevel?: string;
  }

export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    photoUpload?: File;
    role: "doctor" | "billingOfficer" | "pharmacist" | "receptionist" | "admin";
    details?: DoctorDetails | AdminDetails | BillingOfficerDetails | PharmacistDetails | ReceptionistDetails;
    createdAt: Date;
  }