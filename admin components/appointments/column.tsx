"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { RescheduleAppointmentModal } from "./RescheduleAppointmentModal";
import { format, parse } from "date-fns";

export type Appointment = {
  appointment_id: string;
  appointment_datetime: string;
  reason_for_visit: string;
  contact_email: string;
  status: string;
  patient_id: string;
  patient_name: string;
  patient_contact: string;
  doctor_name: string;
  doctor_specialization: string;
};

const ActionsCell = ({ appointment }: { appointment: Appointment }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add this function to handle message clearing
  const clearMessage = () => {
    setMessage(null);
  };

  const handleConfirm = async () => {
    try {
      // Get user details from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const storedRole = localStorage.getItem("userRole");
      const storedUserId = userData.user_id || "";

      if (!storedUserId || !storedRole) {
        setMessage({ type: "error", text: "User details not found. Please login again." });
        return;
      }

      // Make API request to confirm appointment
      const response = await fetch("http://localhost/hospital_api/confirmed_appoinment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.appointment_id,
          userId: storedUserId,
          role: storedRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the appointment status
        const updatedAppointment: Appointment = {
          ...appointment,
          status: "confirmed",
        };

        setMessage({
          type: "success",
          text: data.message || "Appointment confirmed successfully",
        });

        // If there's a callback, update the parent component
        if (typeof window !== "undefined" && window.onmessage) {
          window.postMessage({ type: "APPOINTMENT_CONFIRMED", data: updatedAppointment });
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to confirm appointment" });
      }
    } catch (error) {
      console.error("Confirm error:", error);
      setMessage({ type: "error", text: "Network error. Please try again later." });
    }
  };

  const handleCancel = async () => {
    try {
      // Get user details from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const storedRole = localStorage.getItem("userRole");
      const storedUserId = userData.user_id || "";

      if (!storedUserId || !storedRole) {
        setMessage({ type: "error", text: "User details not found. Please login again." });
        return;
      }

      // Make API request to cancel appointment
      const response = await fetch("http://localhost/hospital_api/cancel_appointment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.appointment_id,
          userId: storedUserId,
          role: storedRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the appointment status
        const updatedAppointment: Appointment = {
          ...appointment,
          status: "cancelled",
        };

        setMessage({ type: "success", text: "Appointment cancelled successfully" });

        // If there's a callback, update the parent component
        if (typeof window !== "undefined" && window.onmessage) {
          window.postMessage({ type: "APPOINTMENT_CANCELLED", data: updatedAppointment });
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to cancel appointment" });
      }
    } catch (error) {
      console.error("Cancel error:", error);
      setMessage({ type: "error", text: "Network error. Please try again later." });
    }
  };

  const handleReject = async () => {
    try {
      // Get user details from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const storedRole = localStorage.getItem("userRole");
      const storedUserId = userData.user_id || "";

      if (!storedUserId || !storedRole) {
        setMessage({ type: "error", text: "User details not found. Please login again." });
        return;
      }

      // Make API request to reject appointment
      const response = await fetch("http://localhost/hospital_api/reject_appoinment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.appointment_id,
          userId: storedUserId,
          role: storedRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the appointment status
        const updatedAppointment: Appointment = {
          ...appointment,
          status: "rejected",
        };

        setMessage({ type: "success", text: "Appointment rejected successfully" });

        // If there's a callback, update the parent component
        if (typeof window !== "undefined" && window.onmessage) {
          window.postMessage({ type: "APPOINTMENT_REJECTED", data: updatedAppointment });
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to reject appointment" });
      }
    } catch (error) {
      console.error("Reject error:", error);
      setMessage({ type: "error", text: "Network error. Please try again later." });
    }
  };

  const handleComplete = async () => {
    try {
      // Get user details fromlocalStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const storedRole = localStorage.getItem("userRole");
      const storedUserId = userData.user_id || "";

      if (!storedUserId || !storedRole) {
        setMessage({ type: "error", text: "User details not found. Please login again." });
        return;
      }

      // Make API request to complete appointment
      const response = await fetch("http://localhost/hospital_api/completed_appointment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.appointment_id,
          userId: storedUserId,
          role: storedRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the appointment status
        const updatedAppointment: Appointment = {
          ...appointment,
          status: "completed",
        };

        setMessage({
          type: "success",
          text: data.message || "Appointment completed successfully",
        });

        // If there's a callback, update the parent component
        if (typeof window !== "undefined" && window.onmessage) {
          window.postMessage({ type: "APPOINTMENT_COMPLETED", data: updatedAppointment });
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to complete appointment" });
      }
    } catch (error) {
      console.error("Complete error:", error);
      setMessage({ type: "error", text: "Network error. Please try again later." });
    }
  };

  // Add this useEffect hook to handle automatic message clearing
  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(appointment.appointment_id)}>
            Copy appointment ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
            View appointment details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleConfirm}>Confirm</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCancel}>Cancel</DropdownMenuItem>
          <DropdownMenuItem onClick={handleReject}>Reject</DropdownMenuItem>
          <DropdownMenuItem onClick={handleComplete}>Complete</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRescheduleAppointment(appointment)}>
            Reschedule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={isDetailsModalOpen}
          onOpenChange={(open) => {
            setIsDetailsModalOpen(open);
            if (!open) setSelectedAppointment(null);
          }}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {rescheduleAppointment && (
        <RescheduleAppointmentModal
          appointment={rescheduleAppointment}
          onClose={() => setRescheduleAppointment(null)}
          onOpenChange={() => {}}
          isOpen={true}
        />
      )}

      {message && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
          onClick={() => setMessage(null)}>
          {message.text}
        </div>
      )}
    </>
  );
};

function parseAppointmentDate(raw: unknown): Date | null {
  if (typeof raw === "string" && raw.trim() !== "") {
    // Try native Date first (handles ISO and most SQL formats)
    const nativeDate = new Date(raw);
    if (!isNaN(nativeDate.getTime())) {
      return nativeDate;
    }
    // Try parsing as MySQL format
    try {
      const parsed = parse(raw, "yyyy-MM-dd HH:mm:ss", new Date());
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  // Use Object.prototype.toString to check for Date instance
  if (
    typeof raw === "object" &&
    raw !== null &&
    Object.prototype.toString.call(raw) === "[object Date]" &&
    !isNaN((raw as Date).getTime())
  ) {
    return raw as Date;
  }
  return null;
}


export const columns: ColumnDef<Appointment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patient_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Patient Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "appointment_date",
    accessorKey: "appointment_datetime",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Appointment Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const raw = row.original.appointment_datetime;
      const date = parseAppointmentDate(raw);

      if (!date) {
        return <div className="text-red-500">Invalid Date</div>;
      }
      return <div className="font-medium">{format(date, "MMMM d, yyyy")}</div>;
    },
  },
  {
    id: "appointment_time",
    accessorKey: "appointment_datetime",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Appointment Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const raw = row.original.appointment_datetime;
      const date = parseAppointmentDate(raw);

      if (!date) {
        return <div className="text-red-500">Invalid Time</div>;
      }
      return <div className="font-medium">{format(date, "HH:mm:ss")}</div>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const statusColor =
        {
          pending: "bg-yellow-100 text-yellow-800",
          confirmed: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
          cancelled: "bg-gray-100 text-gray-800",
          completed: "",
        }[status.toLowerCase()] || "bg-gray-100 text-gray-800";

      return (
        <div className={`py-1  rounded-full text-sm font-medium ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell appointment={row.original} />,
  },
];
