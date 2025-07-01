import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Staff } from "../../types/staff";

interface EditStaffModalProps {
  staff: Staff;
  onClose: () => void;
  onUpdate: (updatedStaff: Staff) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = (props) => {
  useTheme();
  const { staff } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phoneNumber: staff.phoneNumber,
    role: staff.role,
    licenseNumber: staff.licenseNumber || "",
    specialization: staff.specialization || "",
    yearsExperience: staff.yearsExperience ? staff.yearsExperience.toString() : "",
    about: staff.about || "",
    password: "",
  });

  // Add state for editor credentials
  const [editorRole, setEditorRole] = useState<string>("admin");
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

  const handleApiUpdate = async (updatedStaff: Staff) => {
    try {
      const response = await fetch("http://localhost/hospital_api/edit_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editorRole: editorRole,
          editorId: editorId,
          targetUserId: staff.user_id,
          targetRole: formState.role,
          fields: {
            firstName: updatedStaff.firstName,
            lastName: updatedStaff.lastName,
            email: updatedStaff.email,
            phoneNumber: updatedStaff.phoneNumber,
            licenseNumber: updatedStaff.licenseNumber,
            specialization: updatedStaff.specialization,
            yearsExperience: updatedStaff.yearsExperience,
            about: updatedStaff.about,
            password: formState.password || undefined,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update staff");
        return;
      }

      const data = await response.json();
      if (data.success) {
        props.onUpdate(updatedStaff);
        setSuccessMessage("Staff updated successfully");
        setError(null);
        setTimeout(() => {
          props.onClose();
        }, 1500);
      } else {
        setError(data.message || "Failed to update staff");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update staff");
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
        ...formState,
        yearsExperience: formState.yearsExperience ? formState.yearsExperience : undefined,
      };

      await handleApiUpdate(updatedStaff);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  return (
    <div
      className="custom-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.onClose();
          props.onOpenChange(false);
        }
      }}
    >
      <div className="custom-modal-container bg-muted">
        <div className="custom-modal-header text-foreground">
          <span className="text-primary">Edit</span> Staff Information
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
                    value={formState.licenseNumber}
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
                    value={formState.yearsExperience}
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
                    value={formState.specialization}
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
                    value={formState.about}
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
                  value={formState.licenseNumber}
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
                value={formState.password}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Enter new password (leave blank to keep current password)"
              />
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          <Button
            variant="outline"
            className="mr-4"
            onClick={props.onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleUpdate}
            disabled={isSubmitting || !!error}
          >
            Update Staff
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