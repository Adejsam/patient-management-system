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
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: GenderType;
  primary_phone_number: string;
  alternate_phone_number: string;
  email: string;
  street: string;
  city: string;
  state: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  blood_group: string;
  known_allergies: string;
  pre_existing_conditions: string;
  primary_physician: string;
  insurance_number: string;
  insurance_provider: string;
  marital_status: MaritalType;
  occupation: string;
  error?: string;
}

interface EditorData {
  editorRole: string;
  editorId: string;
}

interface EditPatientModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = (props) => {
  const { patient, onClose, onUpdate, isOpen, onOpenChange } = props;
  useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    first_name: patient.first_name,
    middle_name: patient.middle_name || "",
    last_name: patient.last_name,
    date_of_birth: patient.date_of_birth,
    gender: patient.gender as GenderType,
    primary_phone_number: patient.primary_phone_number,
    alternate_phone_number: patient.alternate_phone_number || "",
    email: patient.email || "",
    street: patient.street,
    city: patient.city,
    state: patient.state,
    country: patient.country,
    emergency_contact_name: patient.emergency_contact_name,
    emergency_contact_relationship: patient.emergency_contact_relationship,
    emergency_contact_phone: patient.emergency_contact_phone,
    blood_group: patient.blood_group || "",
    known_allergies: patient.known_allergies || "",
    pre_existing_conditions: patient.pre_existing_conditions || "",
    primary_physician: patient.primary_physician || "",
    insurance_number: patient.insurance_number || "",
    insurance_provider: patient.insurance_provider || "",
    marital_status: patient.marital_status as MaritalType,
    occupation: patient.occupation || "",
  });

  const [editorData, setEditorData] = useState<EditorData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchEditorData = async () => {
      try {
        const userRole = localStorage.getItem("userRole");
        const userData = localStorage.getItem("userData");
        console.log(localStorage)

        if (!userRole || !userData) {
          throw new Error("User data not found in localStorage");
        }

        const parsedUserData = JSON.parse(userData);
        if (!parsedUserData.user_id) {
          throw new Error("Invalid user data in localStorage");
        }

        setEditorData({
          editorRole: userRole,
          editorId: parsedUserData.user_id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch editor data");
        setFormState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to fetch editor data",
        }));
      }
    };

    fetchEditorData();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const transformDataToCamelCase = (formData: FormState): Record<string, unknown> => {
    const transformedData: Record<string, unknown> = {};

    Object.entries(formData).forEach(([key, value]) => {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      transformedData[camelKey] = value;
    });

    return transformedData;
  };


  const handleUpdate = async () => {
    try {
      if (!editorData) {
        throw new Error("Editor data not available");
      }
      console.log(localStorage)

      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Transform form data to camelCase for API
      const formData = transformDataToCamelCase(formState);

      // Construct the API payload
      const payload = {
        editorRole: editorData.editorRole,
        editorId: editorData.editorId,
        targetUserId: patient.user_id,
        targetRole: "patient",
        fields: formData,
      };

      // Send the update request
      const response = await fetch("http://localhost/hospital_api/edit_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      const data = await response.json();
      if (typeof data === 'object' && data !== null) {
        if (data.success) {
          setSuccessMessage("Patient updated successfully");
          setError(null);
          
          // Close modal after 1 second
          setTimeout(() => {
            onUpdate(patient); // Refresh the patient data
            onClose();
          }, 1000);
        } else {
          setError(data.message || "Failed to update patient");
        }
      } else {
        setError("Invalid response format from server");
      }
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
      <ModalHeader className="text-center text-sm">
        <span className="text-primary">Edit</span> Patient Information
        {successMessage && (
          <div className="mt-2 p-2 text-center bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-center text-red-700 rounded">{error}</div>
        )}
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="max-h-[65vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formState.first_name}
                  onChange={(e) => {
                    setFormState({ ...formState, first_name: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Middle Name</Label>
                <Input
                  value={formState.middle_name}
                  onChange={(e) => {
                    setFormState({ ...formState, middle_name: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Middle Name (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formState.last_name}
                  onChange={(e) => {
                    setFormState({ ...formState, last_name: e.target.value });
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
                  value={formState.date_of_birth}
                  onChange={(e) => {
                    setFormState({ ...formState, date_of_birth: e.target.value });
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
                  value={formState.primary_phone_number}
                  onChange={(e) => {
                    setFormState({ ...formState, primary_phone_number: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Alternate Phone Number (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label>Alternate Phone Number</Label>
                <Input
                  value={formState.alternate_phone_number}
                  onChange={(e) => {
                    setFormState({ ...formState, alternate_phone_number: e.target.value });
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
                    value={formState.street}
                    onChange={(e) => {
                      setFormState({ ...formState, street: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Street Address"
                  />
                  <Input
                    value={formState.city}
                    onChange={(e) => {
                      setFormState({ ...formState, city: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="City"
                  />
                  <Input
                    value={formState.state}
                    onChange={(e) => {
                      setFormState({ ...formState, state: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="State"
                  />
                  <Input
                    value={formState.country}
                    onChange={(e) => {
                      setFormState({ ...formState, country: e.target.value });
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
                    value={formState.emergency_contact_name}
                    onChange={(e) => {
                      setFormState({ ...formState, emergency_contact_name: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Name"
                  />
                  <Input
                    value={formState.emergency_contact_relationship}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        emergency_contact_relationship: e.target.value,
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Relationship"
                  />
                  <Input
                    value={formState.emergency_contact_phone}
                    onChange={(e) => {
                      setFormState({ ...formState, emergency_contact_phone: e.target.value });
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
                  value={formState.blood_group}
                  onChange={(e) => {
                    setFormState({ ...formState, blood_group: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Blood Group (e.g., A+)"
                />
              </div>

              <div className="space-y-2">
                <Label>Known Allergies</Label>
                <Textarea
                  value={formState.known_allergies}
                  onChange={(e) => {
                    setFormState({ ...formState, known_allergies: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="List any known allergies (e.g., Penicillin, Shellfish)"
                />
              </div>

              <div className="space-y-2">
                <Label>Pre-existing Conditions</Label>
                <Textarea
                  value={formState.pre_existing_conditions}
                  onChange={(e) => {
                    setFormState({ ...formState, pre_existing_conditions: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="List any pre-existing medical conditions (e.g., Diabetes, Asthma)"
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Physician</Label>
                <Input
                  value={formState.primary_physician}
                  onChange={(e) => {
                    setFormState({ ...formState, primary_physician: e.target.value });
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
                    value={formState.insurance_number}
                    onChange={(e) => {
                      setFormState({ ...formState, insurance_number: e.target.value });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Insurance Number"
                  />
                  <Input
                    value={formState.insurance_provider}
                    onChange={(e) => {
                      setFormState({ ...formState, insurance_provider: e.target.value });
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
                  value={formState.marital_status}
                  onValueChange={(value) => {
                    setFormState({ ...formState, marital_status: value as MaritalType });
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
