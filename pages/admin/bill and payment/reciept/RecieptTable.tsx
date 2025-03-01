import { DataTable } from "./data-table";
    import { Receipt, columns } from "./column";
    import { useEffect, useState } from "react";
    
    function getData(): Promise<Receipt[]> {
        // Fetch data from your API here.
        return Promise.resolve([
            {
                id: "1",
                receiptNumber: "RCPT-001",
                date: new Date("2023-10-01"),
                items: [
                    {
                        description: "Consultation Fee",
                        amount: 5000
                    }
                ],
                totalAmount: 5000,
                status: "paid",
                balanceAmount: null,
                patient: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "555-1234"
                },
                paymentMethod: "cash"
            },
            {
                id: "2",
                receiptNumber: "RCPT-002",
                date: new Date("2023-10-02"),
                items: [
                    {
                        description: "Medicine",
                        amount: 2000
                    }
                ],
                totalAmount: 2000,
                status: "partially paid",
                balanceAmount: 500,
                patient: {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "555-5678"
                },
                paymentMethod: "card"
            },
            {
                id: "3",
                receiptNumber: "RCPT-003",
                date: new Date("2023-10-03"),
                items: [
                    {
                        description: "Lab Tests",
                        amount: 3000
                    }
                ],
                totalAmount: 3000,
                status: "paid",
                balanceAmount: null,
                patient: {
                    name: "Alice Johnson",
                    email: "alice@example.com",
                    phone: "555-9012"
                },
                paymentMethod: "bank-transfer"
            },
            {
                id: "4",
                receiptNumber: "RCPT-001",
                date: new Date("2023-10-01"),
                items: [
                    {
                        description: "Consultation Fee",
                        amount: 5000
                    }
                ],
                totalAmount: 5000,
                status: "paid",
                balanceAmount: null,
                patient: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "555-1234"
                },
                paymentMethod: "cash"
            },
            {
                id: "5",
                receiptNumber: "RCPT-002",
                date: new Date("2023-10-02"),
                items: [
                    {
                        description: "Medicine",
                        amount: 2000
                    }
                ],
                totalAmount: 2000,
                status: "partially paid",
                balanceAmount: 500,
                patient: {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "555-5678"
                },
                paymentMethod: "card"
            },
            {
                id: "6",
                receiptNumber: "RCPT-001",
                date: new Date("2023-10-01"),
                items: [
                    {
                        description: "Consultation Fee",
                        amount: 5000
                    }
                ],
                totalAmount: 5000,
                status: "paid",
                balanceAmount: null,
                patient: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "555-1234"
                },
                paymentMethod: "cash"
            },
            {
                id: "2",
                receiptNumber: "RCPT-002",
                date: new Date("2023-10-02"),
                items: [
                    {
                        description: "Medicine",
                        amount: 2000
                    }
                ],
                totalAmount: 2000,
                status: "partially paid",
                balanceAmount: 500,
                patient: {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "555-5678"
                },
                paymentMethod: "card"
            },
        ]);
    }
    
    export default function Receipts() {
        const [data, setData] = useState<Receipt[]>([]);
    
        useEffect(() => {
            getData().then((receipts) => setData(receipts));
        }, []);
    
        return (
            <div className="container mx-auto py-5">
                <h1 className="text-2xl font-bold mb-4">Receipts</h1>
                <DataTable columns={columns} data={data} />
            </div>
        );
    }