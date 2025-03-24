import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useState } from "react";
import { ReceiptDetailsModal } from "./reciept-detail-modal";
import { BillItem } from "../payment-forms";

export type Receipt = {
  receipt_id: number;
  receipt_number: string;
  date: string;
  total_amount: string;
  status: "paid" | "partially_paid";
  balance_amount: string;
  payment_method: string;
  hospital_number: number;
  patient_name: string;
  items: BillItem[];
};

const ActionsCell = ({ receipt }: { receipt: Receipt }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateReceiptStatus = async (receiptId: number, newStatus: string) => {
    try {
      // Get user details from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const storedRole = localStorage.getItem("userRole");
      const storedUserId = userData.user_id || "";

      if (!storedUserId || !storedRole) {
        throw new Error("User details not found. Please login again.");
      }

      const response = await fetch("http://localhost/hospital_api/receipt_status.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_id: receiptId,
          status: newStatus,
          user_id: storedUserId,
          role: storedRole,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      }
      throw new Error(data.message || "Failed to update receipt status");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update receipt status");
      setTimeout(() => setErrorMessage(""), 5000);
      return false;
    }
  };

  const handleVoidReceipt = () => {
    updateReceiptStatus(receipt.receipt_id, "cancelled");
  };

  const handleMarkAsPaid = () => {
    updateReceiptStatus(receipt.receipt_id, "paid");
  };


  return (
    <>
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-md shadow-md">
          {errorMessage}
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(receipt.receipt_number)}>
            Copy receipt Number
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedReceipt(receipt)}>
            View receipt details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleVoidReceipt}>Void Reciept</DropdownMenuItem>
          <DropdownMenuItem onClick={handleMarkAsPaid}>Mark as Paid</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedReceipt && (
        <ReceiptDetailsModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </>
  );
};

export const columns: ColumnDef<Receipt>[] = [
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
    accessorKey: "receipt_number",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Receipt Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Receipt Date
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
    accessorKey: "payment_method",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Payment Method
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const statusColor = {
        paid: "bg-green-100 text-green-800",
        partially_paid: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
      }[status.toLowerCase()] || "bg-gray-100 text-gray-800";

      return (
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell receipt={row.original} />,
  },
];