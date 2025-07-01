import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Patient } from "../../types/patient";

type GenderType = "Male" | "Female" | "Other" | "Prefer Not to Say";
type MaritalType = "Single" | "Married" | "Widowed" | "Divorced";

interface EditPatientModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = (props) => {
  useTheme();
  const { patient } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
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

  // Add state for editor credentials
  const [editorRole, setEditorRole] = useState<string>("doctor");
  const [editorId, setEditorId] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  useEffect(() => {
    const fetchEditorData = async () => {
      try {
        const userRole = localStorage.getItem("userRole");
        const userData = localStorage.getItem("userData");

        if (!userRole || !userData) {
          throw new Error("User data not found in localStorage");
        }

        const parsedUserData = JSON.parse(userData);
        if (!parsedUserData.user_id) {
          throw new Error("Invalid user data in localStorage");
        }

        setEditorRole(userRole);
        setEditorId(parsedUserData.user_id.toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch editor data");
      }
    };

    fetchEditorData();
  }, []);

  if (!isMounted || !props.isOpen) {
    return null;
  }

  const validateForm = () => {
    const errors = {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      primary_phone_number: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
    };

    if (!formState.first_name.trim()) errors.first_name = "First name is required";
    if (!formState.last_name.trim()) errors.last_name = "Last name is required";
    if (!formState.date_of_birth.trim()) errors.date_of_birth = "Date of birth is required";
    if (!formState.gender) errors.gender = "Gender is required";
    if (!formState.primary_phone_number.trim())
      errors.primary_phone_number = "Primary phone number is required";
    if (!formState.emergency_contact_name.trim())
      errors.emergency_contact_name = "Emergency contact name is required";
    if (!formState.emergency_contact_phone.trim())
      errors.emergency_contact_phone = "Emergency contact phone is required";

    return errors;
  };

  const handleApiUpdate = async (updatedPatient: Patient) => {
    try {
      const response = await fetch("http://localhost/hospital_api/edit_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editorRole: editorRole,
          editorId: editorId,
          targetUserId: patient.user_id,
          targetRole: "patient",
          fields: updatedPatient,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update patient");
        return;
      }

      const data = await response.json();
      if (data.success) {
        props.onUpdate(updatedPatient);
        setSuccessMessage("Patient updated successfully");
        setError(null);
        setTimeout(() => {
          props.onClose();
        }, 1500);
      } else {
        setError(data.message || "Failed to update patient");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update patient");
    }
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
      };

      await handleApiUpdate(updatedPatient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="custom-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.onClose();
          props.onOpenChange(false);
        }
      }}>
      <div className="custom-modal-container bg-muted">
        <div className="custom-modal-header text-foreground">
          <span className="text-primary">Edit</span> Patient Information
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-base text-red-700 rounded text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mt-2 p-2 bg-green-100 text-base text-green-700 rounded text-center">
              {successMessage}
            </div>
          )}
        </div>
        <div className="custom-modal-content">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-semibold block mb-1">First Name</label>
                <Input
                  value={formState.first_name}
                  onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
                  className="w-full"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Middle Name</label>
                <Input
                  value={formState.middle_name}
                  onChange={(e) => setFormState({ ...formState, middle_name: e.target.value })}
                  className="w-full"
                  placeholder="Middle Name (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Last Name</label>
                <Input
                  value={formState.last_name}
                  onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
                  className="w-full"
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Date of Birth</label>
                <Input
                  type="date"
                  value={formState.date_of_birth}
                  onChange={(e) => setFormState({ ...formState, date_of_birth: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Gender</label>
                <select
                  value={formState.gender}
                  onChange={(e) =>
                    setFormState({ ...formState, gender: e.target.value as GenderType })
                  }
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Primary Phone Number</label>
                <Input
                  value={formState.primary_phone_number}
                  onChange={(e) =>
                    setFormState({ ...formState, primary_phone_number: e.target.value })
                  }
                  className="w-full"
                  placeholder="Primary Phone Number"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Alternate Phone Number</label>
                <Input
                  value={formState.alternate_phone_number}
                  onChange={(e) =>
                    setFormState({ ...formState, alternate_phone_number: e.target.value })
                  }
                  className="w-full"
                  placeholder="Alternate Phone Number (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Email</label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Street</label>
                <Input
                  value={formState.street}
                  onChange={(e) => setFormState({ ...formState, street: e.target.value })}
                  className="w-full"
                  placeholder="Street Address"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">City</label>
                <Input
                  value={formState.city}
                  onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                  className="w-full"
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">State</label>
                <Input
                  value={formState.state}
                  onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                  className="w-full"
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Country</label>
                <Input
                  value={formState.country}
                  onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                  className="w-full"
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Emergency Contact Name</label>
                <Input
                  value={formState.emergency_contact_name}
                  onChange={(e) =>
                    setFormState({ ...formState, emergency_contact_name: e.target.value })
                  }
                  className="w-full"
                  placeholder="Name"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Emergency Contact Relationship</label>
                <Input
                  value={formState.emergency_contact_relationship}
                  onChange={(e) =>
                    setFormState({ ...formState, emergency_contact_relationship: e.target.value })
                  }
                  className="w-full"
                  placeholder="Relationship"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Emergency Contact Phone</label>
                <Input
                  value={formState.emergency_contact_phone}
                  onChange={(e) =>
                    setFormState({ ...formState, emergency_contact_phone: e.target.value })
                  }
                  className="w-full"
                  placeholder="Phone Number"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Blood Group</label>
                <Input
                  value={formState.blood_group}
                  onChange={(e) => setFormState({ ...formState, blood_group: e.target.value })}
                  className="w-full"
                  placeholder="Blood Group (e.g., A+)"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Known Allergies</label>
                <textarea
                  value={formState.known_allergies}
                  onChange={(e) => setFormState({ ...formState, known_allergies: e.target.value })}
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  placeholder="List any known allergies (e.g., Penicillin, Shellfish)"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Pre-existing Conditions</label>
                <textarea
                  value={formState.pre_existing_conditions}
                  onChange={(e) =>
                    setFormState({ ...formState, pre_existing_conditions: e.target.value })
                  }
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  placeholder="List any pre-existing medical conditions (e.g., Diabetes, Asthma)"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Primary Physician</label>
                <Input
                  value={formState.primary_physician}
                  onChange={(e) =>
                    setFormState({ ...formState, primary_physician: e.target.value })
                  }
                  className="w-full"
                  placeholder="Primary Physician's Name"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Insurance Number</label>
                <Input
                  value={formState.insurance_number}
                  onChange={(e) => setFormState({ ...formState, insurance_number: e.target.value })}
                  className="w-full"
                  placeholder="Insurance Number"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Insurance Provider</label>
                <Input
                  value={formState.insurance_provider}
                  onChange={(e) =>
                    setFormState({ ...formState, insurance_provider: e.target.value })
                  }
                  className="w-full"
                  placeholder="Insurance Provider"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Marital Status</label>
                <select
                  value={formState.marital_status}
                  onChange={(e) =>
                    setFormState({ ...formState, marital_status: e.target.value as MaritalType })
                  }
                  className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-semibold block mb-1">Occupation</label>
                <Input
                  value={formState.occupation}
                  onChange={(e) => setFormState({ ...formState, occupation: e.target.value })}
                  className="w-full"
                  placeholder="Occupation"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          <Button
            variant="outline"
            className="mr-4"
            onClick={props.onClose}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleUpdate} disabled={isSubmitting || !!error}>
            Update Patient
          </Button>
        </div>
      </div>
      <style>{`
        .custom-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-modal-container {
          border-radius: 1rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .custom-modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .custom-modal-content {
          flex: 1 1 0%;
          min-height: 0;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .custom-modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .custom-modal-container {
            max-width: 98vw;
            padding: 0;
          }
          .custom-modal-content {
            padding: 1rem;
          }
          .custom-modal-header, .custom-modal-footer {
            padding: 1rem;
          }
      }
      `}</style>
    </div>
  );
};
