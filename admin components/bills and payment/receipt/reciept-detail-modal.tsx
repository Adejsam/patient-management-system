import React from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../../ui/modal";
import { Button } from "../../../ui/button";
import { useTheme } from "next-themes";
import { BillItem } from "../payment-form";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { ScrollArea } from "../../../ui/scroll-area";

type Receipt = {
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

interface ReceiptDetailsModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export const ReceiptDetailsModal: React.FC<ReceiptDetailsModalProps> = ({ receipt, onClose }) => {
  useTheme();

  return (
    <Modal isOpen onClose={onClose} className="flex justify-center items-center p-10">
      <ModalHeader className="text-center">
        <span className="text-primary">Receipt Details</span>
      </ModalHeader>
      <ScrollArea className="max-h-[60vh]">
        <ModalContent className="space-y-4 flex flex-col">
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold`}>Patient Name:</label>
            <p className={`text-sm `}>{receipt.patient_name}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold`}>Patient Hospital Number:</label>
            <p className={`text-sm `}>{receipt.hospital_number}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold`}>Receipt Number:</label>
            <p className={`text-sm `}>{receipt.receipt_number}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold`}>Date:</label>
            <p className={`text-sm `}>{format(receipt.date, "PPP")}</p>
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
                  {receipt.items.map((item, index) => (
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
            <label className={`text-sm font-bold `}>Payment Method:</label>
            <p className={`text-sm `}>{receipt.payment_method}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold `}>Status:</label>
            <p className={`text-sm `}>{receipt.status}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <label className={`text-sm font-bold `}>Total Amount:</label>
            <p className={`text-sm `}>₦{receipt.total_amount}</p>
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
