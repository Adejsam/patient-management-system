import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Staff } from "../../../types/staff";
import { DoctorDetails, PharmacistDetails } from "../../../types/staff";

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
            <p>Medical License Number: {(staff.details as DoctorDetails).medicalLicenseNumber}</p>
            <p>Specialization: {(staff.details as DoctorDetails).specialization}</p>
          </div>
        );
      case "pharmacist":
        return (
          <p>Pharmacy License Number: {(staff.details as PharmacistDetails).pharmacyLicenseNumber}</p>
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
              <strong>Photo:</strong> {staff.photoUpload ? (
                <Image
                  width={100}
                  height={100}
                  src={URL.createObjectURL(staff.photoUpload)}
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
              <strong>Details:</strong>
              {staff.details && renderDetails(staff)}
            </p>
            <p>
              <strong>Created At:</strong> {format(new Date(staff.createdAt), "PPP")}
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