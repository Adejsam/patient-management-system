import React from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../../ui/modal";
import { Button } from "../../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { BillItem } from "../payment-forms";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { ScrollArea } from "../../../ui/scroll-area";

type Invoice = {
  invoice_id: number;
  invoice_number: string;
  date: string;
  status: string;
  total_amount: string;
  hospital_number: number; // Added hospital_number field
  created_at: string; // Added created_at field
  patient_name: string; // Changed from patient object to patient_name string
  items: BillItem[];
};

interface InvoiceDetailsModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ invoice, onClose }) => {
  useTheme();

  return (
    <Modal isOpen onClose={onClose} className="flex justify-center items-center ">
      <ModalHeader className="text-center">
        <span className="text-primary">Invoice Details</span>
      </ModalHeader>
      <ScrollArea>
        <ModalContent className="space-y-4 flex flex-col">
          <div className="flex items-center justify-center gap-1 ">
            <label className={`text-sm font-bold`}>Patient Name:</label>
            <p className={`text-sm `}>{invoice.patient_name}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold`}>Invoice Number:</label>
            <p className={`text-sm `}>{invoice.invoice_number}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold`}>Date:</label>
            <p className={`text-sm `}>{format(invoice.date, "PPP")}</p>
          </div>
          <div className="flex items-center justify-center flex-col gap-1">
            <label className={`text-sm font-bold`}>Items:</label>
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow className="text-left text-sm font-medium">
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>₦{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold `}>Status:</label>
            <p className={`text-sm `}>{invoice.status}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold `}>Total Amount:</label>
            <p className={`text-sm `}>₦{invoice.total_amount}</p>
          </div>
        </ModalContent>
      </ScrollArea>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
