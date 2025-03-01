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
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../components/ui/table";
import { Patient } from "../../types/patient";
import Header from "../components/headers/Header";
import Seo from "../../shared/seo/seo";
import AdminLayout from "../../shared/layout/AdminLayout";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PatientDetailsModal } from "./manage users/view-pateint-details";

export const mockPatients: Patient[] = [
  {
    firstName: "John",
    middleName: "David",
    lastName: "Doe",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+1 555-123-4567",
    alternatePhoneNumber: "+1 555-987-6543",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1 555-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Shellfish",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "INS1234567",
      provider: "HealthCare Plus",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
  {
    firstName: "John",
    middleName: "David",
    lastName: "Doe",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+1 555-123-4567",
    alternatePhoneNumber: "+1 555-987-6543",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1 555-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Shellfish",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "INS1234567",
      provider: "HealthCare Plus",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
  {
    firstName: "Frank",
    middleName: "Eben",
    lastName: "Doe",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+1 555-123-4567",
    alternatePhoneNumber: "+1 555-987-6543",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1 555-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Shellfish",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "INS1234567",
      provider: "HealthCare Plus",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
  {
    firstName: "olawa",
    middleName: "David",
    lastName: "Doe",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+1 555-123-4567",
    alternatePhoneNumber: "+1 555-987-6543",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1 555-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Shellfish",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "INS1234567",
      provider: "HealthCare Plus",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
  {
    firstName: "John",
    middleName: "gannis",
    lastName: "Doe",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+1 555-123-4567",
    alternatePhoneNumber: "+1 555-987-6543",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1 555-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Shellfish",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "INS1234567",
      provider: "HealthCare Plus",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
  {
    firstName: "james",
    middleName: "David",
    lastName: "Doe",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+1 555-123-4567",
    alternatePhoneNumber: "+1 555-987-6543",
    email: "john.doe@example.com",
    residentialAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1 555-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Shellfish",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Smith",
    healthInsurance: {
      insuranceNumber: "INS1234567",
      provider: "HealthCare Plus",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
];

export default function ManagePatientsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: (info) => {
        const value = info.getValue<Date>();
        return value.toLocaleDateString();
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "emergencyContact.name",
      header: "Emergency Contact",
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
    },
    {
      accessorKey: "knownAllergies",
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
            <Button variant="outline">Edit</Button>
          </div>
        );
      },
    },
  ];

  const filteredData = React.useMemo(() => {
    return mockPatients.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

  if (!isMounted) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo title="Manage Patients" />
      <Header title="Manage Patients" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50">
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

          <div className="rounded-md border m-4">
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
                        <TableCell key={cell.id}>
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
        </div>
      </div>
    </AdminLayout>
  );
}
