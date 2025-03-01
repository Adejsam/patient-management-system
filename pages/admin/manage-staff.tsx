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
import AdminLayout from "../../shared/layout/AdminLayout";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Staff } from "../../types/staff";

export const mockStaff: Staff[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 555-123-4567",
    role: "doctor",
    details: {
      medicalLicenseNumber: "MED123456",
      specialization: "Internal Medicine"
    },
    createdAt: new Date()
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1 555-987-6543",
    role: "admin",
    details: {
      systemAccessLevel: "superuser",
      securityClearance: "level-3"
    },
    createdAt: new Date()
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phoneNumber: "+1 555-555-5555",
    role: "pharmacist",
    details: {
      pharmacyLicenseNumber: "PHAR12345"
    },
    createdAt: new Date()
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    phoneNumber: "+1 555-876-5432",
    role: "receptionist",
    details: {
      trainingLevel: "advanced"
    },
    createdAt: new Date()
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    phoneNumber: "+1 555-765-4321",
    role: "billingOfficer",
    details: {
      certificationNumber: "BILL12345"
    },
    createdAt: new Date()
  }
];

export default function ManageStaffPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: (info) => {
        const details = info.getValue();
        if (!details) return null;
        
        // Display relevant details based on role
        if (info.row.original.role === "doctor") {
          return `License: ${details.medicalLicenseNumber}, Specialization: ${details.specialization}`;
        }
        if (info.row.original.role === "admin") {
          return `Access Level: ${details.systemAccessLevel}, Clearance: ${details.securityClearance}`;
        }
        if (info.row.original.role === "pharmacist") {
          return `License: ${details.pharmacyLicenseNumber}`;
        }
        if (info.row.original.role === "receptionist") {
          return `Training Level: ${details.trainingLevel}`;
        }
        if (info.row.original.role === "billingOfficer") {
          return `Certification: ${details.certificationNumber}`;
        }
        
        return null;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex gap-2">
            <Button
              className="mr-2"
              onClick={() => {
                setSelectedStaff(staff);
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
    return mockStaff.filter(
      (staff) =>
        staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-5 pt-5">
            Manage <span className="text-primary">Staff</span>
          </h1>
          <h2 className="text-lg placeholder-opacity-80 pl-5 tracking-tight pb-5">
            View All staff data
          </h2>

          <div className="flex items-center py-4 m-4">
            <Input
              placeholder="Search by Staff Name or Email..."
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
        </div>
      </div>
    </AdminLayout>
  );
}