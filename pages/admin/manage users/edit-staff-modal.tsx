import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useTheme } from "next-themes";
import { Staff } from "../../../types/staff";
import { ScrollArea } from "../../components/ui/scroll-area";

interface EditorData {
  editorRole: string;
  editorId: string;
}

interface FormState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "doctor" | "billingOfficer" | "pharmacist" | "receptionist" | "admin";
  profilePicture?: File;
  licenseNumber?: string;
  specialization?: string;
  yearsExperience?: number;
  about?: string;
  password?: string;
}

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

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    id: staff.user_id,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phoneNumber: staff.phoneNumber,
    role: staff.role,
    yearsExperience: staff.yearsExperience ? parseInt(staff.yearsExperience) : undefined,
    about: staff.about,
    licenseNumber: staff.licenseNumber,
    specialization: staff.specialization,
  });

  const [editorData, setEditorData] = useState<EditorData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

        setEditorData({
          editorRole: userRole,
          editorId: parsedUserData.user_id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch editor data");
      }
    };

    fetchEditorData();
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleUpdate = async () => {
    try {
      if (!editorData) {
        throw new Error("Editor data not available");
      }

      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Construct the API payload without the 'role' field in 'fields'
      const payload = {
        editorRole: editorData.editorRole,
        editorId: editorData.editorId,
        targetUserId: staff.user_id,
        targetRole: formState.role,
        fields: {
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phoneNumber: formState.phoneNumber,
          licenseNumber: formState.licenseNumber,
          specialization: formState.specialization,
          yearsExperience: formState.yearsExperience?.toString(),
          about: formState.about,
          password: formState.password,
        },
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
        throw new Error("Failed to update staff");
      }

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Staff updated successfully");
        setError(null);

        // Close modal after 1 second
        setTimeout(() => {
          onUpdate(staff); // Refresh the staff data
          onClose();
        }, 1000);
      } else {
        setError(data.message || "Failed to update staff");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update staff";
      setError(errorMessage);
      console.error("Error updating staff:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "yearsExperience" ? parseInt(value) : value,
    }));
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className="flex justify-center items-center">
      <ModalHeader className="text-sm text-center">
        <span className="text-primary">Edit</span> Staff Information
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
        <ModalContent className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  name="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="+1 555-123-4567"
                  required
                />
              </div>
            </div>
            {formState.role === "doctor" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Medical License Number</Label>
                  <Input
                    name="licenseNumber"
                    value={formState.licenseNumber || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="MED123456"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience (Years)</Label>
                  <Input
                    name="yearsExperience"
                    type="number"
                    value={formState.yearsExperience?.toString() || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Years of experience"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input
                    name="specialization"
                    value={formState.specialization || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Internal Medicine"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>About</Label>
                  <Input
                    name="about"
                    value={formState.about || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Brief description about this Doctor"
                  />
                </div>
              </div>
            )}
            {formState.role === "pharmacist" && (
              <div className="space-y-2">
                <Label>Pharmacy License Number</Label>
                <Input
                  name="licenseNumber"
                  value={formState.licenseNumber || ""}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="PHAR12345"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                name="password"
                type="password"
                value={formState.password || ""}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Enter new password (leave blank to keep current password)"
              />
            </div>
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
