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

interface Complaint {
  id: string;
  subject: string;
  department: string;
  status: "replied" | "unreplied";
  date: string;
  description: string;
  response: string;
  complaintType: string;
  preferredContact: string;
  attachments: Array<{
    name: string;
    type: string;
  }>;
}

const mockComplaints: Complaint[] = [
  {
    id: "1",
    subject: "Billing Discrepancy",
    department: "Billing",
    status: "replied",
    date: "2024-03-14",
    description: "Incorrect charges on medical bill",
    response: "We are investigating the billing discrepancy",
    complaintType: "Billing",
    preferredContact: "Email",
    attachments: [
      { name: "bill.pdf", type: "application/pdf" },
      { name: "receipt.jpg", type: "image/jpeg" },
    ],
  },
  {
    id: "2",
    subject: "Appointment Rescheduling",
    department: "Scheduling",
    status: "replied",
    date: "2024-03-13",
    description: "Unable to keep appointment on March 15th",
    response: "We have rescheduled your appointment to March 22nd at 2:00 PM",
    complaintType: "Scheduling",
    preferredContact: "Phone",
    attachments: [{ name: "appointment_confirmation.pdf", type: "application/pdf" }],
  },
  {
    id: "3",
    subject: "Test Result Concerns",
    department: "Radiology",
    status: "replied",
    date: "2024-03-12",
    description: "Unexplained results from recent MRI scan",
    response: "A radiologist will contact you within 48 hours to discuss the results",
    complaintType: "Diagnostic",
    preferredContact: "Email",
    attachments: [{ name: "scan_results.pdf", type: "application/pdf" }],
  },
  {
    id: "4",
    subject: "Medication Refill Inquiry",
    department: "Pharmacy",
    status: "replied",
    date: "2024-03-11",
    description: "Unable to refill prescription for blood pressure medication",
    response: "Your prescription has been refilled and is ready for pickup",
    complaintType: "Medication",
    preferredContact: "Phone",
    attachments: [{ name: "prescription.pdf", type: "application/pdf" }],
  },
  {
    id: "5",
    subject: "Insurance Coverage Issue",
    department: "Insurance",
    status: "replied",
    date: "2024-03-10",
    description: "Denied coverage for recent treatment",
    response: "We are reviewing your case and will provide an update within 72 hours",
    complaintType: "Billing",
    preferredContact: "Email",
    attachments: [
      { name: "insurance_claim.pdf", type: "application/pdf" },
      { name: "treatment_summary.pdf", type: "application/pdf" },
    ],
  },
  {
    id: "6",
    subject: "Lab Test Delay",
    department: "Laboratory",
    status: "replied",
    date: "2024-03-09",
    description: "Delayed results for routine blood work",
    response: "Results are now available and can be viewed through your patient portal",
    complaintType: "Diagnostic",
    preferredContact: "Email",
    attachments: [{ name: "blood_work_results.pdf", type: "application/pdf" }],
  },
  {
    id: "7",
    subject: "Discomfort After Procedure",
    department: "Surgery",
    status: "unreplied",
    date: "2024-03-08",
    description: "Experiencing unusual discomfort after minor surgery",
    response: "Please contact our post-operative care team immediately",
    complaintType: "Post-Surgical",
    preferredContact: "Phone",
    attachments: [{ name: "surgery_report.pdf", type: "application/pdf" }],
  },
  {
    id: "8",
    subject: "Missing Test Order",
    department: "Reception",
    status: "unreplied",
    date: "2024-03-07",
    description: "Test order not received by lab",
    response: "We have resent the test order and are following up with the lab",
    complaintType: "Diagnostic",
    preferredContact: "Phone",
    attachments: [{ name: "test_order.pdf", type: "application/pdf" }],
  },
  {
    id: "9",
    subject: "Billing Statement Missing",
    department: "Billing",
    status: "unreplied",
    date: "2024-03-06",
    description: "No billing statement received for February services",
    response: "A new statement has been sent to your email address",
    complaintType: "Billing",
    preferredContact: "Email",
    attachments: [{ name: "billing_statement.pdf", type: "application/pdf" }],
  },
  {
    id: "10",
    subject: "Allergy Concerns",
    department: "Allergy",
    status: "unreplied",
    date: "2024-03-05",
    description: "Experiencing severe allergic reactions to prescribed medication",
    response: "We recommend consulting with our allergy specialist as soon as possible",
    complaintType: "Medication",
    preferredContact: "Phone",
    attachments: [{ name: "allergy_test_results.pdf", type: "application/pdf" }],
  },
];

export default function PatientQueriesAdmin() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusIcon = (status: "unreplied" | "replied") => {
    if (typeof status !== "string" || !["unreplied", "replied"].includes(status)) {
      // Handle unexpected type, perhaps return a default icon
      return <span className="text-gray-500 flex items-center">?</span>;
    }

    if (status === "replied") {
      return <span className="text-green-500 flex items-center justify-center">replied</span>;
    }
    return <span className="text-red-500 flex items-center justify-center">Unreplied</span>;
  };

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "department",
      header: "Department",
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
      cell: (info) => {
        const complaintType = info.getValue();
        if (typeof complaintType === "string") {
          return <span>{complaintType}</span>;
        }
        return null;
      },
    },
    {
      accessorKey: "date",
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
                setExpandedComplaint(complaint.id === expandedComplaint ? null : complaint.id)
              }>
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = React.useMemo(() => {
    return mockComplaints.filter(
      (complaint) =>
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.department.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleResponseSubmit = (complaintId: string) => {
    const updatedComplaints = mockComplaints.map((complaint) => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          response: response,
          status: "replied" as const,
        };
      }
      return complaint;
    });
    mockComplaints.splice(0, mockComplaints.length, ...updatedComplaints);
    setExpandedComplaint(null);
    setResponse("");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo title="Patient Queries Management"></Seo>
      <Header title="Patient Queries Management" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-full mx-auto max-w-7xl md:h-[100vh]">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-5 pt-5">
            Manage <span className="text-primary">Patient Queries</span>
          </h1>
          <h2 className="text-lg placeholder-opacity-80 pl-5 tracking-tight pb-5">
            View All patient queries
          </h2>

          <div className="flex items-center py-4 m-4">
            <Input
              placeholder="Search by Subject or Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md"
            />
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
            <div className="mt-4 p-4 border mx-5 ">
              <h3 className="font-medium mb-2 text-center text-primary">Query Details:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Complaint Type:</h4>
                  <p className="">
                    {mockComplaints.find((c) => c.id === expandedComplaint)?.complaintType}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Preferred Contact:</h4>
                  <p className="">
                    {mockComplaints.find((c) => c.id === expandedComplaint)?.preferredContact}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Status:</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(
                      mockComplaints.find((c) => c.id === expandedComplaint)?.status as
                        | "unreplied"
                        | "replied"
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockComplaints.find((c) => c.id === expandedComplaint)?.attachments?.length ? (
                      Array.from(
                        mockComplaints.find((c) => c.id === expandedComplaint)?.attachments ?? []
                      ).map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs">{file.type.split("/")[0]}</span>
                        </div>
                      ))
                    ) : (
                      <p className="">No attachments</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium">Response:</h4>
                  {mockComplaints.find((c) => c.id === expandedComplaint)?.status === "replied" ? (
                    <p className="mt-3">
                      {mockComplaints.find((c) => c.id === expandedComplaint)?.response}
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
