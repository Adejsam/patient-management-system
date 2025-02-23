import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import { Appointment } from "./column";
import { Button } from "../../components/ui/button";

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export function AppointmentDetailsModal({ appointment, onClose }: AppointmentDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            <p className="text-base/6"><strong>Patient Name:</strong> {appointment.patientName}</p>
            <p className="text-base/6"><strong>Appointment Time:</strong> {appointment.appointmentTime}</p>
            <p className="text-base/6"><strong>Reason for Visit:</strong> {appointment.reasonForVisit}</p>
            <p className="text-base/6"><strong>Doctor Name:</strong> {appointment.doctorName}</p>
            <p className="text-base/6"><strong>Doctor Contact:</strong> {appointment.doctorContact}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}