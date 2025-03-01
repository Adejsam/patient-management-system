import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "../../components/ui/scroll-area";

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
        <p className="mx-auto"><strong>Photo:</strong> {patient.photoUpload ? <Image width={100} height={100} src={URL.createObjectURL(patient.photoUpload)} alt="Patient Photo" className="w-16 h-16 rounded-full mx-auto" /> : "N/A"}</p>
          <p><strong>Name:</strong> {patient.firstName} {patient.middleName || ""} {patient.lastName}</p>
          <p><strong>Date of Birth:</strong> {format(new Date(patient.dateOfBirth), "PPP")}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Primary Phone:</strong> {patient.primaryPhoneNumber}</p>
          <p><strong>Alternate Phone:</strong> {patient.alternatePhoneNumber || "N/A"}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Address:</strong> {patient.residentialAddress.street}, {patient.residentialAddress.city}, {patient.residentialAddress.state}, {patient.residentialAddress.country}</p>
          <p><strong>Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phoneNumber}</p>
          <p><strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}</p>
          <p><strong>Known Allergies:</strong> {patient.knownAllergies || "N/A"}</p>
          <p><strong>Pre-existing Conditions:</strong> {patient.preExistingConditions || "N/A"}</p>
          <p><strong>Primary Physician:</strong> {patient.primaryPhysician || "N/A"}</p>
          <p><strong>Health Insurance:</strong> {patient.healthInsurance?.provider || "N/A"} - {patient.healthInsurance?.insuranceNumber || "N/A"}</p>
          <p><strong>Marital Status:</strong> {patient.maritalStatus}</p>
          <p><strong>Occupation:</strong> {patient.occupation || "N/A"}</p>   
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