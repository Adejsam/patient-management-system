import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useTheme } from "next-themes";
import { Staff } from "../../../types/staff";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface DoctorDetails {
  medicalLicenseNumber: string;
  specialization: string;
}

interface PharmacistDetails {
  pharmacyLicenseNumber: string;
}

type StaffDetails = DoctorDetails | PharmacistDetails | null;

interface EditStaffModalProps {
  staff: Staff;
  onClose: () => void;
  onUpdate: (updatedStaff: Staff) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = (props) => {
  const { staff, onClose, onUpdate, isOpen, onOpenChange } = props;
  useTheme();

  const isValidRole = (
    value: string
  ): value is "doctor" | "admin" | "pharmacist" | "receptionist" | "billingOfficer" => {
    return ["doctor", "admin", "pharmacist", "receptionist", "billingOfficer"].includes(value);
  };

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phoneNumber: staff.phoneNumber,
    role: isValidRole(staff.role) ? staff.role : "admin",
    experienceYears: staff.experienceYears || "",
    details:
      staff.role === "doctor"
        ? {
            medicalLicenseNumber: (staff.details as DoctorDetails)?.medicalLicenseNumber || "",
            specialization: (staff.details as DoctorDetails)?.specialization || "",
          }
        : staff.role === "pharmacist"
        ? {
            pharmacyLicenseNumber:
              (staff.details as PharmacistDetails)?.pharmacyLicenseNumber || "",
          }
        : null,
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
      email: "",
      phoneNumber: "",
    };

    if (!formState.firstName.trim()) errors.firstName = "First name is required";
    if (!formState.lastName.trim()) errors.lastName = "Last name is required";
    if (!formState.email.trim()) errors.email = "Email is required";
    if (!formState.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";

    return errors;
  };

  const handleRoleChange = (value: string) => {
    if (isValidRole(value)) {
      let newDetails: StaffDetails = null;

      if (value === "doctor") {
        newDetails = {
          medicalLicenseNumber: "",
          specialization: "",
        };
      } else if (value === "pharmacist") {
        newDetails = {
          pharmacyLicenseNumber: "",
        };
      }

      setFormState({
        ...formState,
        role: value,
        details: newDetails,
      });
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

      const updatedStaff: Staff = {
        ...staff,
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        phoneNumber: formState.phoneNumber,
        role: formState.role,
        experienceYears: formState.experienceYears,
        details: formState.details || undefined,
      };

      onUpdate(updatedStaff);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update staff");
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
        <span className="text-primary">Edit</span> Staff Information
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
                <Label>Phone Number</Label>
                <Input
                  value={formState.phoneNumber}
                  onChange={(e) => {
                    setFormState({ ...formState, phoneNumber: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="+1 555-123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formState.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="billingOfficer">Billing Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Experience (Years)</Label>
                <Input
                  value={formState.experienceYears}
                  onChange={(e) => {
                    setFormState({ ...formState, experienceYears: e.target.value });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="Years of experience"
                />
              </div>
            </div>
            {formState.role === "doctor" && (
              <div className="space-y-2">
                <Label>Medical License Number</Label>
                <Input
                  value={(formState.details as DoctorDetails)?.medicalLicenseNumber || ""}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      details: {
                        ...(formState.details as DoctorDetails),
                        medicalLicenseNumber: e.target.value,
                      } as DoctorDetails,
                    });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="MED123456"
                />
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input
                    value={(formState.details as DoctorDetails)?.specialization || ""}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        details: {
                          ...(formState.details as DoctorDetails),
                          specialization: e.target.value,
                        } as DoctorDetails,
                      });
                      setError(null);
                    }}
                    className="w-full"
                    placeholder="Internal Medicine"
                  />
                </div>
              </div>
            )}

            {formState.role === "pharmacist" && (
              <div className="space-y-2">
                <Label>Pharmacy License Number</Label>
                <Input
                  value={(formState.details as PharmacistDetails)?.pharmacyLicenseNumber || ""}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      details: {
                        ...(formState.details as PharmacistDetails),
                        pharmacyLicenseNumber: e.target.value,
                      } as PharmacistDetails,
                    });
                    setError(null);
                  }}
                  className="w-full"
                  placeholder="PHAR12345"
                />
              </div>
            )}

            {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          </div>
        </ModalContent>
      </ScrollArea>
      <ModalFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="mr-4">
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={isSubmitting || !!error}>
          Update Staff
        </Button>
      </ModalFooter>
    </Modal>
  );
};
