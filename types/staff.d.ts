export interface Staff {
    user_id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: File;
    licenseNumber?: string;
    specialization?: string;
    yearsExperience?: string;
    about?: string;
    role: "doctor" | "billingOfficer" | "pharmacist" | "receptionist" | "admin";
  }