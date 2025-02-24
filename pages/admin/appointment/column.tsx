"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useState } from "react";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { RescheduleAppointmentModal } from "./RescheduleAppointmentModal";

export type Appointment = {
  id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  doctorName?: string;
  doctorContact: string;
  doctorField: string;
  status: string;
};

const ActionsCell = ({ appointment }: { appointment: Appointment }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);

  const handleApprove = () => {
    // Implement approve logic here
    console.log("Approved:", appointment.id);
  };

  const handleCancel = () => {
    // Implement cancel logic here
    console.log("Canceled:", appointment.id);
  };

  const handleReject = () => {
    // Implement reject logic here
    console.log("Rejected:", appointment.id);
  };

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(appointment.id)}>
            Copy appointment ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
            View appointment details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleApprove}>Approve</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCancel}>Cancel</DropdownMenuItem>
          <DropdownMenuItem onClick={handleReject}>Reject</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRescheduleAppointment(appointment)}>
            Reschedule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
      {rescheduleAppointment && (
        <RescheduleAppointmentModal
          appointment={rescheduleAppointment}
          onClose={() => setRescheduleAppointment(null)}
        />
      )}
    </>
  );
};

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
    accessorKey: "patientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Patient Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "appointmentDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Appointment Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("appointmentDate"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "appointmentTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Appointment Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "reasonForVisit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reason for Visit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell appointment={row.original} />,
  },
];