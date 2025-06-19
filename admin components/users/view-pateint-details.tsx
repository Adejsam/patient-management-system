import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/modal";
import { Button } from "../../ui/button";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "../../ui/scroll-area";
interface Patient {
  patient_id: string;
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string; // Change from Date to string
  gender: "Male" | "Female" | "Other" | "Prefer Not to Say";
  photo_upload?: string; // Change from File to string
  primary_phone_number: string;
  alternate_phone_number?: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  blood_group?: string;
  known_allergies?: string;
  pre_existing_conditions?: string;
  primary_physician?: string;
  insurance_number?: string;
  insurance_provider?: string;
  marital_status: string; // Change from enum to string
  occupation?: string;
}
interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ patient, onClose }) => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal isOpen onClose={onClose} className="flex justify-center items-center">
      <ModalHeader className="text-center">
        <span className="text-primary">Patient</span> Details
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="text-center">
          <div className={`text-sm`}>
            <p className="mx-auto">
              <strong>Photo:</strong>{" "}
              {patient.photo_upload ? (
                <Image
                  width={100}
                  height={100}
                  src={
                    patient.photo_upload.startsWith("http")
                      ? patient.photo_upload
                      : `/assets/images/${patient.photo_upload}`
                  }
                  alt="Patient Photo"
                  className="w-16 h-16 rounded-full mx-auto"
                />
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong>Name:</strong> {patient.first_name} {patient.middle_name || ""}{" "}
              {patient.last_name}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {patient.date_of_birth ? format(new Date(patient.date_of_birth), "PPP") : "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
            <p>
              <strong>Primary Phone:</strong> {patient.primary_phone_number}
            </p>
            <p>
              <strong>Alternate Phone:</strong> {patient.alternate_phone_number || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {patient.email || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {patient.street}, {patient.city}, {patient.state},{" "}
              {patient.country}
            </p>
            <p>
              <strong>Emergency Contact:</strong> {patient.emergency_contact_name} (
              {patient.emergency_contact_relationship}) - {patient.emergency_contact_phone}
            </p>
            <p>
              <strong>Blood Group:</strong> {patient.blood_group || "N/A"}
            </p>
            <p>
              <strong>Known Allergies:</strong> {patient.known_allergies || "N/A"}
            </p>
            <p>
              <strong>Pre-existing Conditions:</strong> {patient.pre_existing_conditions || "N/A"}
            </p>
            <p>
              <strong>Primary Physician:</strong> {patient.primary_physician || "N/A"}
            </p>
            <p>
              <strong>Health Insurance:</strong>{" "}
              {patient.insurance_provider
                ? `${patient.insurance_provider} - ${patient.insurance_number || "N/A"}`
                : "N/A"}
            </p>
            <p>
              <strong>Marital Status:</strong> {patient.marital_status}
            </p>
            <p>
              <strong>Occupation:</strong> {patient.occupation || "N/A"}
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
