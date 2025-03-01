import React from 'react';
  import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../../components/ui/modal";
  import { Button } from "../../../components/ui/button";
  import { useTheme } from "next-themes";
  import { BillItem, Patient } from "../payment-forms";
  import { format } from "date-fns";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
  import { ScrollArea } from "../../../components/ui/scroll-area";

  type Receipt = {
    id: string;
    receiptNumber: string;
    date: Date;
    items: BillItem[];
    patient: Patient;
    paymentMethod: string;
    status: "paid" | "partially paid";
    totalAmount: number;
  };

  interface ReceiptDetailsModalProps {
    receipt: Receipt;
    onClose: () => void;
  }

  export const ReceiptDetailsModal: React.FC<ReceiptDetailsModalProps> = ({ receipt, onClose }) => {
    useTheme();

    return (
      <Modal isOpen onClose={onClose} className="flex justify-center items-center">
        <ModalHeader className="text-center">
          <span className="text-primary">Receipt Details</span>
        </ModalHeader>
        <ScrollArea>
          <ModalContent className="space-y-4 flex flex-col">
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold`}>Patient Name:</label>
              <p className={`text-sm `}>{receipt.patient.name}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold`}>Patient Email:</label>
              <p className={`text-sm `}>{receipt.patient.email}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold`}>Patient Phone:</label>
              <p className={`text-sm `}>{receipt.patient.phone}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold`}>Receipt Number:</label>
              <p className={`text-sm `}>{receipt.receiptNumber}</p>
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
                        <TableCell>₦{item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold `}>Payment Method:</label>
              <p className={`text-sm `}>{receipt.paymentMethod}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold `}>Status:</label>
              <p className={`text-sm `}>{receipt.status}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label className={`text-sm font-bold `}>Total Amount:</label>
              <p className={`text-sm `}>₦{receipt.totalAmount.toFixed(2)}</p>
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