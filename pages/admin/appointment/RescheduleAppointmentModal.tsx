import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { Appointment } from "./column";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays, addHours, isAfter, isBefore, parseISO } from "date-fns";
import { cn } from "../../../lib/utils";

interface RescheduleAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onReschedule?: (updatedAppointment: Appointment) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
type MessageType = "error" | "success" | null;

interface Message {
  type: MessageType;
  text: string;
}

export const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  appointment,
  onClose,
  onReschedule,
  isOpen,
  onOpenChange,
}) => {
  const { theme } = useTheme();
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const [role, setRole] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    setIsMounted(true);
    console.log("Modal mounted with appointment:", appointment);

    // Get user details from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const storedRole = localStorage.getItem("userRole");
    console.log(localStorage);
    const storedUserId = userData.user_id || "";

    if (storedUserId && storedRole) {
      setUserId(parseInt(storedUserId));
      setRole(storedRole);
    } else {
      setMessage({ type: "error", text: "User details not found. Please login again." });
    }

    // Check if appointment is completed
    if (appointment.status === "completed") {
      setMessage({ type: "error", text: "Cannot reschedule a completed appointment" });
      return;
    }

    // Set initial date from appointment
    try {
      const appointmentDate = new Date(appointment.appointment_datetime);
      setNewDate(appointmentDate);

      // Extract time from appointment_datetime
      const hours = appointmentDate.getHours();
      const minutes = appointmentDate.getMinutes();
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
      setNewTime(formattedTime);
    } catch (error) {
      console.error("Error parsing appointment date:", error);
      setMessage({ type: "error", text: "Error loading appointment details" });
    }
  }, [appointment]);

  if (!isMounted) {
    return null;
  }

  const handleDateSelect = (date: Date | undefined) => {
    setNewDate(date);
    setMessage(null);
  };

  const handleTimeChange = (time: string) => {
    setNewTime(time);
    setMessage(null);
  };

  const validateDateTime = (dateTime: Date): { isValid: boolean; message: string } => {
    const now = new Date();

    // Check if date is in the past
    if (isBefore(dateTime, now)) {
      return { isValid: false, message: "New appointment time must be in the future" };
    }

    // Check if date is within 24 hours
    const minRescheduleTime = addHours(now, 24);
    if (isBefore(dateTime, minRescheduleTime)) {
      return { isValid: false, message: "Cannot reschedule within 24 hours of the current time" };
    }

    // Check if date is more than 30 days in the future
    const maxRescheduleTime = addDays(now, 30);
    if (isAfter(dateTime, maxRescheduleTime)) {
      return { isValid: false, message: "Cannot reschedule more than 30 days in advance" };
    }

    // Check if appointment is during business hours (8 AM to 4 PM)
    const hours = dateTime.getHours();
    if (hours < 8 || hours >= 16) {
      return { isValid: false, message: "Appointments must be scheduled between 8 AM and 4 PM" };
    }

    return { isValid: true, message: "" };
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      setMessage({ type: "error", text: "Please select both a date and time" });
      return;
    }

    if (!userId || !role) {
      setMessage({ type: "error", text: "User details are missing. Please login again." });
      onClose();
      return;
    }

    // Check if appointment is completed
    if (appointment.status === "completed") {
      setMessage({ type: "error", text: "Cannot reschedule a completed appointment" });
      return;
    }

    // Check if role is authorized
    if (role !== "doctor" && role !== "receptionist") {
      setMessage({
        type: "error",
        text: "Unauthorized: Only doctors and receptionists can reschedule appointments",
      });
      return;
    }

    try {
      // Combine date and time into a new Date object
      const [timeStr, period] = newTime.split(" ");
      const [hoursStr, minutesStr] = timeStr.split(":");
      let hours = parseInt(hoursStr);

      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const newDateTime = new Date(newDate);
      newDateTime.setHours(hours, parseInt(minutesStr), 0, 0);

      // Validate the new date and time
      const validation = validateDateTime(newDateTime);
      if (!validation.isValid) {
        setMessage({ type: "error", text: validation.message });
        return;
      }

      setIsLoading(true);
      setMessage(null);

      // Format date for API (YYYY-MM-DD HH:MM:SS)
      const formattedDateTime = format(newDateTime, "yyyy-MM-dd HH:mm:ss");

      console.log("Sending reschedule request with data:", {
        appointmentId: appointment.appointment_id,
        newAppointmentDatetime: formattedDateTime,
        userId: userId,
        role: role,
      });

      // Send reschedule request to backend
      const response = await fetch("http://localhost/hospital_api/reschedule_appointment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.appointment_id,
          newAppointmentDatetime: formattedDateTime,
          userId: userId,
          role: role,
        }),
      });

      const data = await response.json();
      console.log("Reschedule API response:", data);

      if (data.success) {
        setMessage({ type: "success", text: "Appointment rescheduled successfully" });

        // If callback provided, update the parent component
        if (onReschedule && data.appointment) {
          // Create updated appointment object with all required fields
          const updatedAppointment: Appointment = {
            ...appointment,
            appointment_datetime: parseISO(data.appointment.appointment_datetime),
            status: data.appointment.status,
            // Ensure all required fields from the Appointment type are present
            reason_for_visit: data.appointment.reason_for_visit || appointment.reason_for_visit,
            contact_email: data.appointment.contact_email || appointment.contact_email,
            patient_id: data.appointment.patient_id || appointment.patient_id,
            // Keep existing fields that might not be returned by the API
            patient_name: appointment.patient_name,
            patient_contact: appointment.patient_contact,
            doctor_name: appointment.doctor_name,
            doctor_specialization: appointment.doctor_specialization,
          };

          // Wait a moment to show the success message before closing
          setTimeout(() => {
            onReschedule(updatedAppointment);
            onClose();
          }, 1500);
        } else {
          // If no callback, just close after showing success message
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        // Handle specific error messages from the API
        const errorMessage = data.message || "Failed to reschedule appointment";
        setMessage({ type: "error", text: errorMessage });

        // Handle specific error cases
        if (errorMessage.includes("conflicts with another appointment")) {
          setMessage({
            type: "error",
            text: "This time slot conflicts with another appointment for this patient. Please select a different time.",
          });
        }
      }
    } catch (error) {
      console.error("Reschedule error:", error);
      setMessage({ type: "error", text: "Network error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    // Generate time slots from 8 AM to 4 PM in 30-minute intervals
    for (let hour = 8; hour < 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const time = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Calculate minimum selectable date (tomorrow)
  const minSelectableDate = addDays(new Date(), 1);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className="flex justify-center items-center bg-black/80">
      <ModalHeader className="text-center">
        <span className="text-primary">Reschedule</span> Appointment
        {message && (
          <div
            className={`my-2 p-3 rounded ${
              message.type === "error"
                ? "bg-red-100 border border-red-400 text-red-700"
                : "bg-green-100 border border-green-400 text-green-700"
            }`}>
            {message.text}
          </div>
        )}
      </ModalHeader>
      <ModalContent className="bg-card rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4">
          <p className="text-sm mb-4">
            <strong>Current Appointment:</strong>{" "}
            {format(new Date(appointment.appointment_datetime), "PPP 'at' h:mm a")}
          </p>
          <p className="text-sm mb-4">
            <strong>Status:</strong>{" "}
            <span
              className={`capitalize ${
                appointment.status === "completed" ? "text-green-600" : ""
              }`}>
              {appointment.status}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <label
            className={`block text-sm font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
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
                disabled={appointment.status === "completed"}>
                {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                required
                selected={newDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  isBefore(date, minSelectableDate) || isAfter(date, addDays(new Date(), 30))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">New Time:</label>
          <Select
            onValueChange={handleTimeChange}
            value={newTime}
            disabled={appointment.status === "completed"}
            required>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="h-52">
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} className="mr-3">
          Cancel
        </Button>
        <Button
          onClick={handleReschedule}
          disabled={isLoading || !newDate || !newTime || appointment.status === "completed"}>
          {isLoading ? "Rescheduling..." : "Reschedule"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
