interface DoctorDetails {
    medicalLicenseNumber: string;
    specialization: string;
  }
   
  interface PharmacistDetails {
    pharmacyLicenseNumber: string;
  }
  
export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    photoUpload?: File;
    experienceYears?: string
    role: "doctor" | "billingOfficer" | "pharmacist" | "receptionist" | "admin";
    details?: DoctorDetails | PharmacistDetails;
    createdAt: Date;
  }