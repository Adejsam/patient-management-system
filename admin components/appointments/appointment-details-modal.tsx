import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Appointment } from "./column";
import { Button } from "../../ui/button";
import { Mail, User, FileText, CalendarIcon, Clock, Briefcase, CircleEllipsis } from "lucide-react";
import { Badge } from "../../ui/badge";

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export function AppointmentDetailsModal({ appointment, onClose }: AppointmentDetailsModalProps) {
  // Parse the datetime string into a Date object
  const appointmentDateTime = new Date(appointment.appointment_datetime);

  // Format the date and time separately
  const formattedDate = appointmentDateTime.toLocaleDateString();
  const formattedTime = appointmentDateTime.toLocaleTimeString();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader className="border-b">
          <DialogTitle className="text-2xl font-bold">Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Patient Name</p>
                  <p className="text-muted-foreground">{appointment.patient_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Patient Email</p>
                  <p className="text-muted-foreground">{appointment.contact_email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Appointment Date</p>
                  <p className="text-muted-foreground">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Appointment Time</p>
                  <p className="text-muted-foreground">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Doctor Name</p>
                  <p className="text-muted-foreground">{appointment.doctor_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Reason for Visit</p>
                  <p className="text-muted-foreground">{appointment.reason_for_visit}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Doctor Specialization</p>
                  <p className="text-muted-foreground">{appointment.doctor_specialization}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CircleEllipsis className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-sm ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
