export interface Patient {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    gender: "Male" | "Female" | "Other" | "Prefer Not to Say";
    photoUpload?: File;
    primaryPhoneNumber: string;
    alternatePhoneNumber?: string;
    email: string;
    residentialAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
    bloodGroup?: string;
    knownAllergies?: string;
    preExistingConditions?: string;
    primaryPhysician?: string;
    healthInsurance?: {
      insuranceNumber?: string;
      provider?: string;
    };
    maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
    occupation?: string;
  }