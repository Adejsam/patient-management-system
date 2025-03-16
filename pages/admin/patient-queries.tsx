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
import Header from "../components/headers/Header";
import Seo from "../../shared/seo/seo";
import Textarea from "../components/ui/Textarea";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

interface Complaint {
  complaintId: string;
  subject: string;
  incidentDate: string;
  description: string;
  complaintType: string;
  status: "replied" | "unreplied";
  response: string | null;
  patient: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  attachments: Array<{
    attachmentId: string;
    name: string;
    type: string;
  }>;
}

export default function PatientQueriesAdmin() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useTheme();

  useEffect(() => {
    setIsMounted(true);
    fetchComplaints();
  }, []);

  // Function to fetch complaints from API
  async function fetchComplaints() {
    try {
      const response = await fetch("http://localhost/hospital_api/get_all_complaint.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setComplaints(data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setErrorMessage("Failed to load complaints. Please try again later.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }

  const getStatusIcon = (status: "unreplied" | "replied") => {
    if (status === "replied") {
      return <span className="text-green-500 flex items-center justify-center">replied</span>;
    }
    return <span className="text-red-500 flex items-center justify-center">Unreplied</span>;
  };

  // ... previous code

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "patient",
      header: "Patient Name",
      cell: (info) => {
        const patient = info.getValue() as {
          firstName: string;
          middleName: string;
          lastName: string;
        };
        return `${patient.firstName} ${patient.middleName} ${patient.lastName}`.trim();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as "unreplied" | "replied";
        return getStatusIcon(status);
      },
    },
    {
      accessorKey: "complaintType",
      header: "Complaint Type",
    },
    {
      accessorKey: "incidentDate",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div className="flex gap-2">
            <Button
              className="mr-2"
              onClick={() =>
                setExpandedComplaint(
                  complaint.complaintId === expandedComplaint ? null : complaint.complaintId
                )
              }>
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = React.useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${complaint.patient.firstName} ${complaint.patient.middleName} ${complaint.patient.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, complaints]);

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

  const handleResponseSubmit = async (complaintId: string) => {
    try {
      if (!response.trim()) {
        throw new Error("Response cannot be empty");
      }

      // Get user role from local storage
      const userRole = localStorage.getItem("userRole");
      if (!userRole || typeof userRole !== "string") {
        throw new Error("User role not found in local storage");
      }

      // Convert the data to form-urlencoded format
      const formData = new URLSearchParams({
        complaintId: complaintId,
        response: response,
        userRole: userRole,
      });

      const apiResponse = await fetch("http://localhost/hospital_api/complaint_response.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        if (apiResponse.status === 403) {
          throw new Error("Unauthorized - Only receptionists can respond to complaints");
        }
        throw new Error(errorData.message || `HTTP error! status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Update the complaints state
      const updatedComplaints = complaints.map((complaint) => {
        if (complaint.complaintId === complaintId) {
          return {
            ...complaint,
            response: data.complaint.response,
            status: "replied" as const,
          };
        }
        return complaint;
      });
      setComplaints(updatedComplaints);

      // Reset form
      setExpandedComplaint(null);
      setResponse("");

      // Show success message
      setSuccessMessage("Response submitted successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error submitting response:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit response");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleDownloadAttachment = async (complaintId: string, attachmentId: string) => {
    try {
      const formData = new FormData();
      formData.append('complaintId', complaintId);
      if (attachmentId) {
        formData.append('attachmentId', attachmentId);
      }
  
      const response = await fetch('http://localhost/hospital_api/download_attachment.php', {
        method: 'POST',
        body: formData,
      });
  
      // Check if the response is JSON (error case)
      if (response.headers.get('Content-Type') === 'application/json') {
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
      } else {
        // Handle file download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = response.headers.get('Content-Disposition')?.split('filename="')[1]?.split('"')[0] || '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Failed to download attachment');
      // Show error to user
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo title="Patient Queries Management"></Seo>
      <Header title="Patient Queries Management" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 p-4 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 p-4 rounded-md">
            {errorMessage}
          </div>
        )}
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-full mx-auto max-w-7xl md:h-[100vh]">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-5 pt-5">
            Manage <span className="text-primary">Patient Queries</span>
          </h1>
          <h2 className="text-lg placeholder-opacity-80 pl-5 tracking-tight pb-5">
            View All patient queries
          </h2>

          <div className="flex item-center justify-between gap-4 w-full p-4">
            <div className="w-4/5">
              <Input
                placeholder="Search by patient name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-2/5"
              />
            </div>

            <div className="w-[20%] ">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="unreplied">Unreplied</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border m-4 overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="min-w-[120px] md:min-w-[150px]">
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
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-4">
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

          {expandedComplaint && (
            <div className="mt-4 p-4 border mx-5">
              <h3 className="font-medium mb-2 text-center text-primary">Query Details:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Complaint Type:</h4>
                  <p className="">
                    {complaints.find((c) => c.complaintId === expandedComplaint)?.complaintType}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Status:</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(
                      complaints.find((c) => c.complaintId === expandedComplaint)?.status as
                        | "unreplied"
                        | "replied"
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Description :</h4>
                  <p className="">
                    {complaints.find((c) => c.complaintId === expandedComplaint)?.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {complaints.find((c) => c.complaintId === expandedComplaint)?.attachments
                      ?.length ? (
                      Array.from(
                        complaints.find((c) => c.complaintId === expandedComplaint)?.attachments ??
                          []
                      ).map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs">{file.type.split("/")[0]}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadAttachment(
                                expandedComplaint!,
                                file.attachmentId,
                                
                              )
                            }>
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="">No attachments</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium">Response:</h4>
                  {complaints.find((c) => c.complaintId === expandedComplaint)?.status ===
                  "replied" ? (
                    <p className="mt-3">
                      {complaints.find((c) => c.complaintId === expandedComplaint)?.response}
                    </p>
                  ) : (
                    <>
                      <Textarea
                        className="min-h-[100px] w-full"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                      />
                      <Button
                        onClick={() => handleResponseSubmit(expandedComplaint)}
                        className="mt-5 w-full"
                        disabled={response.trim() === ""}>
                        Submit Response
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 py-4 px-4 flex-wrap">
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
