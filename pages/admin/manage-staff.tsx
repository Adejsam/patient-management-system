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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../../ui/table";
import AdminLayout from "../../shared/layout/AdminLayout";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Staff } from "../../types/staff";
import { StaffDetailsModal } from "../../admin components/users/view-staff-details";
import Header from "../components/headers/Header";
import Seo from "../../shared/seo/seo";
import { EditStaffModal } from "../../admin components/users/edit-staff-modal";

export default function ManageStaffPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<Staff | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [staffData, setStaffData] = useState<Staff[]>([]);

  useTheme();
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("http://localhost/hospital_api/get_staff.php");
        const data = await response.json();
        console.log(localStorage);
        if (data.success) {
          setStaffData(data.staff);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    setIsMounted(true);
    fetchStaff();
  }, []);

  const columns: ColumnDef<Staff>[] = [
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
      header: "Details",
      cell: (info) => {
        const staff = info.row.original;
        if (staff.role === "doctor") {
          return `License: ${staff.licenseNumber}, Specialization: ${staff.specialization}`;
        }
        if (staff.role === "pharmacist") {
          return `License: ${staff.licenseNumber}`;
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
            <Button
              variant="outline"
              onClick={() => {
                setSelectedStaffForEdit(staff);
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
    return staffData.filter(
      (staff) =>
        (staff.firstName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (staff.lastName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (staff.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, staffData]);

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
      <Seo title="Manage staff"></Seo>
      <Header
        title="Manage staff"
        breadcrumbLinkText="Home"
        breadcrumbLinkHref="/admin/dashboard"
      />
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto  md:h-[100vh] sm:h-[100vh]">
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

          <div className="flex items-center justify-end space-x-2 py-4 px-4">
            <Button
              variant="outline"
              size="default"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
            {isModalOpen && selectedStaff && (
              <StaffDetailsModal
                staff={selectedStaff}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedStaff(null);
                }}
              />
            )}
            {isEditModalOpen && selectedStaffForEdit && (
              <EditStaffModal
                staff={selectedStaffForEdit}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedStaffForEdit(null);
                }}
                onUpdate={(updatedPatient) => {
                  console.log("Updated Patient:", updatedPatient);
                  setIsEditModalOpen(false);
                  setSelectedStaffForEdit(null);
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
