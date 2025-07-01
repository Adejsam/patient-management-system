"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Table, TableBody, TableHead, TableHeader, TableCell, TableRow } from "../../ui/table";
import { Patient } from "../../types/patient";
import Header from "../components/headers/Header";
import Seo from "../../shared/seo/seo";
import AdminLayout from "../../shared/layout/AdminLayout";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PatientDetailsModal } from "../../admin components/users/view-pateint-details";
import { EditPatientModal } from "../../admin components/users/edit-patient-modal";

export default function ManagePatientsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useTheme();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost/hospital_api/get_patients.php");
        const data = await response.json();
        console.log(localStorage);

        if (data.success && data.patients) {
          setPatients(data.patients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "date_of_birth",
      header: "Date of Birth",
      cell: (info) => {
        const value = info.getValue<Date>();
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        return value; // Fallback if value is not a Date object
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "emergency_contact_name",
      header: "Emergency Contact",
    },
    {
      accessorKey: "blood_group",
      header: "Blood Group",
    },
    {
      accessorKey: "known_allergies",
      header: "Allergies",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex gap-2">
            <Button
              className="mr-2"
              onClick={() => {
                setSelectedPatient(patient);
                setIsModalOpen(true);
              }}>
              View
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPatientForEdit(patient);
                setIsEditModalOpen(true);
              }}>
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = React.useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patients]);
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (!hasMounted) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo title="Manage Patients" />
      <Header
        title="Manage Patients"
        breadcrumbLinkText="Home"
        breadcrumbLinkHref="/admin/dashboard"
      />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto  md:h-[100vh] sm:h-[100vh]">
        <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-5 pt-5">
          Manage <span className="text-primary"> Patient</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-5 tracking-tight pb-5">
          View All patient data
        </h2>

        <div className="flex items-center py-4 m-4">
          <Input
            placeholder="Search by Patient Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="text-center p-4">Loading patients...</div>
        ) : (
          <div className="rounded-md border m-4 overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="capitalize">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
        {isModalOpen && selectedPatient && (
          <PatientDetailsModal
            patient={selectedPatient}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPatient(null);
            }}
          />
        )}
        {isEditModalOpen && selectedPatientForEdit && (
          <EditPatientModal
            patient={selectedPatientForEdit}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedPatientForEdit(null);
            }}
            onUpdate={(updatedPatient) => {
              // Handle the updated patient data
              console.log("Updated Patient:", updatedPatient);
              setIsEditModalOpen(false);
              setSelectedPatientForEdit(null);
            }}
            isOpen={isEditModalOpen}
            onOpenChange={(open) => setIsEditModalOpen(open)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
