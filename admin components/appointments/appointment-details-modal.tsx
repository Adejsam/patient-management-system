import * as React from "react";
import { Modal, ModalHeader, ModalFooter, ModalContent } from "../../ui/modal";
import { Appointment } from "./column";
import { Button } from "../../ui/button";
import { Mail, User, FileText, CalendarIcon, Clock, Briefcase, CircleEllipsis } from "lucide-react";
import { Badge } from "../../ui/badge";

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onOpenChange,
  onClose,
}: AppointmentDetailsModalProps) {
  // Parse the datetime string into a Date object
  const appointmentDateTime = new Date(appointment.appointment_datetime);

  // Format the date and time separately
  const formattedDate = appointmentDateTime.toLocaleDateString();
  const formattedTime = appointmentDateTime.toLocaleTimeString();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <ModalHeader>
        <h2 className="text-2xl font-bold text-center">
          Appointment Details
        </h2>
      </ModalHeader>
      <ModalContent>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div className="flex gap-2">
              <User className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Patient Name</p>
                <p className="text-muted-foreground">{appointment.patient_name}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Patient Email</p>
                <p className="text-muted-foreground">{appointment.contact_email}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Appointment Date</p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Appointment Time</p>
                <p className="text-muted-foreground">{formattedTime}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <User className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Doctor Name</p>
                <p className="text-muted-foreground">{appointment.doctor_name}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Reason for Visit</p>
                <p className="text-muted-foreground">{appointment.reason_for_visit}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Doctor Specialization</p>
                <p className="text-muted-foreground">{appointment.doctor_specialization}</p>
              </div>
            </div>

            <div className="flex  gap-2">
              <CircleEllipsis className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-sm p-1 ${
                      appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter className="flex justify-end">
        <Button onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}