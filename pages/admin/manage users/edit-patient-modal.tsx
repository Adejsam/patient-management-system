import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useTheme } from "next-themes";
import { Patient } from "../../../types/patient";
import { ScrollArea } from "../../components/ui/scroll-area";
import Textarea from "../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type GenderType = "Male" | "Female" | "Other" | "Prefer Not to Say";
type MaritalType = "Single" | "Married" | "Widowed" | "Divorced";

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderType;
  primaryPhoneNumber: string;
  alternatePhoneNumber: string;
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
  bloodGroup: string;
  knownAllergies: string;
  preExistingConditions: string;
  primaryPhysician: string;
  healthInsurance: {
    insuranceNumber: string;
    provider: string;
  };
  maritalStatus: MaritalType;
  occupation: string;
}

interface EditPatientModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  patient,
  onClose,
  onUpdate,
  isOpen,
  onOpenChange,
}) => {
  useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    firstName: patient.firstName,
    middleName: patient.middleName || "",
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth.toISOString(),
    gender: patient.gender,
    primaryPhoneNumber: patient.primaryPhoneNumber,
    alternatePhoneNumber: patient.alternatePhoneNumber || "",
    email: patient.email,
    residentialAddress: {
      street: patient.residentialAddress.street,
      city: patient.residentialAddress.city,
      state: patient.residentialAddress.state,
      country: patient.residentialAddress.country,
    },
    emergencyContact: {
      name: patient.emergencyContact.name,
      relationship: patient.emergencyContact.relationship,
      phoneNumber: patient.emergencyContact.phoneNumber,
    },
    bloodGroup: patient.bloodGroup || "",
    knownAllergies: patient.knownAllergies || "",
    preExistingConditions: patient.preExistingConditions || "",
    primaryPhysician: patient.primaryPhysician || "",
    healthInsurance: {
      insuranceNumber: patient.healthInsurance?.insuranceNumber || "",
      provider: patient.healthInsurance?.provider || "",
    },
    maritalStatus: patient.maritalStatus,
    occupation: patient.occupation || "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      primaryPhoneNumber: "",
      email: "",
    };

    if (!formState.firstName.trim()) errors.firstName = "First name is required";
    if (!formState.lastName.trim()) errors.lastName = "Last name is required";
    if (!formState.primaryPhoneNumber.trim())
      errors.primaryPhoneNumber = "Phone number is required";
    if (!formState.email.trim()) errors.email = "Email is required";

    return errors;
  };

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const errors = validateForm();
      if (Object.values(errors).some((err) => err !== "")) {
        setError("Please correct the form errors");
        return;
      }

      const updatedPatient: Patient = {
        ...patient,
        ...formState,
        dateOfBirth: new Date(formState.dateOfBirth),
        residentialAddress: {
          ...formState.residentialAddress,
        },
        emergencyContact: {
          ...formState.emergencyContact,
        },
        healthInsurance: {
          ...formState.healthInsurance,
        },
      };

      onUpdate(updatedPatient);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className="flex justify-center items-center">
      <ModalHeader>
        <span className="text-primary">Edit</span> Patient Information
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formState.firstName}
                  onChange={(e) => {
                    setFormState({ ...formState, firstName: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Middle Name</Label>
                <Input
                  value={formState.middleName}
                  onChange={(e) => {
                    setFormState({ ...formState, middleName: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Middle Name (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formState.lastName}
                  onChange={(e) => {
                    setFormState({ ...formState, lastName: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={formState.dateOfBirth}
                  onChange={(e) => {
                    setFormState({ ...formState, dateOfBirth: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formState.gender}
                  onValueChange={(value) => {
                    setFormState({ ...formState, gender: value as GenderType });
                    setError(null);
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer Not to Say">Prefer Not to Say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primary Phone Number</Label>
                <Input
                  value={formState.primaryPhoneNumber}
                  onChange={(e) => {
                    setFormState({ ...formState, primaryPhoneNumber: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Alternate Phone Number (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label>Alternate Phone Number</Label>
                <Input
                  value={formState.alternatePhoneNumber}
                  onChange={(e) => {
                    setFormState({ ...formState, alternatePhoneNumber: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Alternate Phone Number (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(e) => {
                    setFormState({ ...formState, email: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Residential Address</Label>
                <div className="space-y-2">
                  <Input
                    value={formState.residentialAddress.street}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        residentialAddress: {
                          ...formState.residentialAddress,
                          street: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Street Address"
                  />
                  <Input
                    value={formState.residentialAddress.city}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        residentialAddress: {
                          ...formState.residentialAddress,
                          city: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="City"
                  />
                  <Input
                    value={formState.residentialAddress.state}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        residentialAddress: {
                          ...formState.residentialAddress,
                          state: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="State"
                  />
                  <Input
                    value={formState.residentialAddress.country}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        residentialAddress: {
                          ...formState.residentialAddress,
                          country: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <div className="space-y-2">
                  <Input
                    value={formState.emergencyContact.name}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        emergencyContact: { ...formState.emergencyContact, name: e.target.value },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Name"
                  />
                  <Input
                    value={formState.emergencyContact.relationship}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        emergencyContact: {
                          ...formState.emergencyContact,
                          relationship: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Relationship"
                  />
                  <Input
                    value={formState.emergencyContact.phoneNumber}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        emergencyContact: {
                          ...formState.emergencyContact,
                          phoneNumber: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Input
                  value={formState.bloodGroup}
                  onChange={(e) => {
                    setFormState({ ...formState, bloodGroup: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Blood Group (e.g., A+)"
                />
              </div>

              <div className="space-y-2">
                <Label>Known Allergies</Label>
                <Textarea
                  value={formState.knownAllergies}
                  onChange={(e) => {
                    setFormState({ ...formState, knownAllergies: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="List any known allergies (e.g., Penicillin, Shellfish)"
                />
              </div>

              <div className="space-y-2">
                <Label>Pre-existing Conditions</Label>
                <Textarea
                  value={formState.preExistingConditions}
                  onChange={(e) => {
                    setFormState({ ...formState, preExistingConditions: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="List any pre-existing medical conditions (e.g., Diabetes, Asthma)"
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Physician</Label>
                <Input
                  value={formState.primaryPhysician}
                  onChange={(e) => {
                    setFormState({ ...formState, primaryPhysician: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Primary Physician's Name"
                />
              </div>

              <div className="space-y-2">
                <Label>Health Insurance</Label>
                <div className="space-y-2">
                  <Input
                    value={formState.healthInsurance.insuranceNumber}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        healthInsurance: {
                          ...formState.healthInsurance,
                          insuranceNumber: e.target.value,
                        },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Insurance Number"
                  />
                  <Input
                    value={formState.healthInsurance.provider}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        healthInsurance: { ...formState.healthInsurance, provider: e.target.value },
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Insurance Provider"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select
                  value={formState.maritalStatus}
                  onValueChange={(value) => {
                    setFormState({ ...formState, maritalStatus: value as MaritalType });
                    setError(null);
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  value={formState.occupation}
                  onChange={(e) => {
                    setFormState({ ...formState, occupation: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Occupation"
                />
              </div>
            </div>

            {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          </div>
        </ModalContent>
      </ScrollArea>
      <ModalFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="mr-4">
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={isSubmitting || !!error}>
          Update Patient
        </Button>
      </ModalFooter>
    </Modal>
  );
};
