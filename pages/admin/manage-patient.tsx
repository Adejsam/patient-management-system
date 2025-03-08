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
import { EditPatientModal } from "./manage users/edit-patient-modal";

export const mockPatients: Patient[] = [
  {
    firstName: "Emeka",
    middleName: "Chukwuemeka",
    lastName: "Okafor",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 802-123-4567",
    alternatePhoneNumber: "+234 816-987-6543",
    email: "emeka.okafor@example.com",
    residentialAddress: {
      street: "12 Adeola Odeku Street",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Ngozi Okafor",
      relationship: "Spouse",
      phoneNumber: "+234 803-234-5678",
    },
    bloodGroup: "A+",
    knownAllergies: "Penicillin, Groundnut",
    preExistingConditions: "Hypertension",
    primaryPhysician: "Dr. Adeyemi",
    healthInsurance: {
      insuranceNumber: "NHIS1234567",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Married",
    occupation: "Software Engineer",
  },
  {
    firstName: "Babatunde",
    middleName: "Oluwaseun",
    lastName: "Adebayo",
    dateOfBirth: new Date("1990-07-22"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 803-987-2345",
    alternatePhoneNumber: "+234 705-654-3210",
    email: "babatunde.adebayo@example.com",
    residentialAddress: {
      street: "15 Ikorodu Road",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Tosin Adebayo",
      relationship: "Brother",
      phoneNumber: "+234 806-765-4321",
    },
    bloodGroup: "O+",
    knownAllergies: "None",
    preExistingConditions: "Asthma",
    primaryPhysician: "Dr. Okon",
    healthInsurance: {
      insuranceNumber: "NHIS2345678",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Single",
    occupation: "Civil Engineer",
  },
  {
    firstName: "Aisha",
    middleName: "Zainab",
    lastName: "Muhammad",
    dateOfBirth: new Date("1988-11-05"),
    gender: "Female",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 909-555-6789",
    alternatePhoneNumber: "+234 802-888-1234",
    email: "aisha.muhammad@example.com",
    residentialAddress: {
      street: "20 Ahmadu Bello Way",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Suleiman Muhammad",
      relationship: "Husband",
      phoneNumber: "+234 808-999-4567",
    },
    bloodGroup: "B+",
    knownAllergies: "Seafood",
    preExistingConditions: "Diabetes",
    primaryPhysician: "Dr. Yusuf",
    healthInsurance: {
      insuranceNumber: "NHIS3456789",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Married",
    occupation: "Teacher",
  },
  {
    firstName: "Amina",
    middleName: "Zainab",
    lastName: "Aliyu",
    dateOfBirth: new Date("1990-09-21"),
    gender: "Female",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 701-234-5678",
    alternatePhoneNumber: "+234 802-345-6789",
    email: "amina.aliyu@example.com",
    residentialAddress: {
      street: "45 Garki Road",
      city: "Abuja",
      state: "Federal Capital Territory",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Fatimah Aliyu",
      relationship: "Sister",
      phoneNumber: "+234 703-456-7890",
    },
    bloodGroup: "B+",
    knownAllergies: "Dust, Pollen",
    preExistingConditions: "Asthma",
    primaryPhysician: "Dr. Mohammed",
    healthInsurance: {
      insuranceNumber: "NHIS9876543",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Single",
    occupation: "Nurse",
  },
  {
    firstName: "John",
    middleName: "Michael",
    lastName: "Smith",
    dateOfBirth: new Date("1988-02-17"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 704-567-8901",
    alternatePhoneNumber: "+234 705-678-9012",
    email: "john.smith@example.com",
    residentialAddress: {
      street: "20 Victoria Island",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Wife",
      phoneNumber: "+234 706-789-0123",
    },
    bloodGroup: "O-",
    knownAllergies: "None",
    preExistingConditions: "Diabetes",
    primaryPhysician: "Dr. Peter",
    healthInsurance: {
      insuranceNumber: "NHIS1122334",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Married",
    occupation: "Architect",
  },
  {
    firstName: "Grace",
    middleName: "Chinonso",
    lastName: "Okwuosa",
    dateOfBirth: new Date("1995-11-10"),
    gender: "Female",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 707-789-0123",
    alternatePhoneNumber: "+234 708-890-1234",
    email: "grace.okwuosa@example.com",
    residentialAddress: {
      street: "67 Awolowo Road",
      city: "Ibadan",
      state: "Oyo",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Chuka Okwuosa",
      relationship: "Father",
      phoneNumber: "+234 709-901-2345",
    },
    bloodGroup: "AB+",
    knownAllergies: "Shellfish",
    preExistingConditions: "None",
    primaryPhysician: "Dr. Okoro",
    healthInsurance: {
      insuranceNumber: "NHIS3344556",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Single",
    occupation: "Teacher",
  },
  {
    firstName: "David",
    middleName: "Chigozie",
    lastName: "Eze",
    dateOfBirth: new Date("1982-06-30"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 801-234-5678",
    alternatePhoneNumber: "+234 802-345-6789",
    email: "david.eze@example.com",
    residentialAddress: {
      street: "23 Ifeanyi Street",
      city: "Enugu",
      state: "Enugu",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Chinyere Eze",
      relationship: "Mother",
      phoneNumber: "+234 803-456-7890",
    },
    bloodGroup: "O+",
    knownAllergies: "None",
    preExistingConditions: "None",
    primaryPhysician: "Dr. Nwankwo",
    healthInsurance: {
      insuranceNumber: "NHIS6655443",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Single",
    occupation: "Electrician",
  },
  {
    firstName: "Uche",
    middleName: "Chijioke",
    lastName: "Nwachukwu",
    dateOfBirth: new Date("1993-04-25"),
    gender: "Male",
    photoUpload: new File([""], "patient-photo.jpg", { type: "image/jpeg" }),
    primaryPhoneNumber: "+234 704-123-4567",
    alternatePhoneNumber: "+234 702-234-5678",
    email: "uche.nwachukwu@example.com",
    residentialAddress: {
      street: "18 Aguiyi Ironsi Street",
      city: "Owerri",
      state: "Imo",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "Ngozi Nwachukwu",
      relationship: "Sister",
      phoneNumber: "+234 703-345-6789",
    },
    bloodGroup: "A-",
    knownAllergies: "None",
    preExistingConditions: "Epilepsy",
    primaryPhysician: "Dr. Obi",
    healthInsurance: {
      insuranceNumber: "NHIS7777777",
      provider: "National Health Insurance Scheme (NHIS)",
    },
    maritalStatus: "Single",
    occupation: "Student",
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
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto md:min-h-min]">
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
      </div>
    </AdminLayout>
  );
}
