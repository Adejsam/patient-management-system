"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
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
import { useState, useCallback } from "react";
import { EditRecordModal } from "./EditRecordModal";
import { MedicalRecordData } from "../../../types/medical";
import { MedicalRecordDetailsModal } from "./record-details-modal";
import React from "react";

// Enhanced ActionsCell component with improved TypeScript support
const ActionsCell = React.memo(({ row }: { row: Row<MedicalRecordData> }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  }, []);

  const handleViewDetails = useCallback(() => {
    setIsDetailsModalOpen(true);
    setIsEditModalOpen(false);
  }, []);

  const onUpdate = useCallback((updatedRecord: MedicalRecordData) => {
    console.log("Updated Record:", updatedRecord);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.getValue("id") as string)}>
            Copy Record ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>Edit Medical Record</DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewDetails}>
            View Medical Record Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
      {isEditModalOpen && (
        <EditRecordModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={row.original}
          onUpdate={onUpdate}
        />
      )}

      {isDetailsModalOpen && (
        <MedicalRecordDetailsModal
          isOpen={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          record={row.original}
        />
      )}
    </>
  );
});

ActionsCell.displayName = "ActionsCell";

// Enhanced column definitions with improved TypeScript support
export const columns: ColumnDef<MedicalRecordData>[] = [
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
    accessorKey: "name",
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
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Visit Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Doctor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "field",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Specialty
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
];