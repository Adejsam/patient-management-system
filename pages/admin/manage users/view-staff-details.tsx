import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Staff } from "../../../types/staff";

interface StaffDetailsModalProps {
  staff: Staff;
  onClose: () => void;
}

export const StaffDetailsModal: React.FC<StaffDetailsModalProps> = ({ staff, onClose }) => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderDetails = (staff: Staff) => {
    switch (staff.role) {
      case "doctor":
        return (
          <div>
            <p><strong>Medical License Number:</strong>  {staff.licenseNumber}</p>
            <p> <strong>Specialization:</strong> {staff.specialization}</p>
            <p> <strong>Years of Experience:</strong> {staff.yearsExperience}</p>
            <p> <strong>About:</strong> {staff.about}</p>
          </div>
        );
      case "pharmacist":
        return (
          <p> <strong>Pharmacy License Number:</strong> {staff.licenseNumber}</p>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen onClose={onClose} className="flex justify-center items-center">
      <ModalHeader className="text-center">
        <span className="text-primary">Staff</span> Details
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="text-center">
          <div className={`text-sm`}>
            <p className="mx-auto">
              <strong>Photo:</strong> {staff?.profilePicture ? (
                <Image
                  width={100}
                  height={100}
                  src={staff.profilePicture ? URL.createObjectURL(staff.profilePicture) : '/default-profile.png'}
                  alt="Staff Photo"
                  className="w-16 h-16 rounded-full mx-auto"
                />
              ) : "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {staff.firstName} {staff.lastName}
            </p>
            <p>
              <strong>Email:</strong> {staff.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {staff.phoneNumber}
            </p>
            <p>
              <strong>Role:</strong> {staff.role}
            </p>
            <p>
              {staff && renderDetails(staff)}
            </p>
          </div>
        </ModalContent>
      </ScrollArea>
      <ModalFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose} className="mr-3 hover:bg-primary">
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};