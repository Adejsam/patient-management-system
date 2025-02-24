import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { Appointment } from "./column";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";

interface RescheduleAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  appointment,
  onClose,
}) => {
  const { theme } = useTheme();
  const [newDate, setNewDate] = useState(new Date(appointment.appointmentDate));
  const [newTime, setNewTime] = useState(appointment.appointmentTime);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleReschedule = () => {
    // Implement reschedule logic here
    console.log("Rescheduled to:", newDate, newTime);
    onClose();
  };

  const timeOptions = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM",
  ];

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal isOpen onClose={onClose}>
      <ModalHeader><span className="text-primary">Reschedule</span> Appointment</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
            New Date:
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !newDate && "text-muted-foreground"
                )}
              >
                {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                required
                selected={newDate}
                onSelect={setNewDate}
                disabled={(date) => date < new Date(today)}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
            New Time:
          </label>
          <Select onValueChange={setNewTime} defaultValue={newTime} required>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleReschedule}>Reschedule</Button>
      </ModalFooter>
    </Modal>
  );
};