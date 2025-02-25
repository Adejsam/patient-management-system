import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import PatientLayout from '../../shared/layout/PatientLayout';
import Seo from '../../shared/seo/seo';
import Header from '../components/headers/Header';

interface BillItem {
  description: string;
  amount: number;
}

interface Bill {
  id: number;
  date: string;
  items: BillItem[];
  status: 'unpaid' | 'partially paid' | 'paid';
}

const ViewBills: React.FC = () => {
  useTheme();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fetch bills data from an API or database
    const fetchedBills: Bill[] = [
      {
        id: 1,
        date: '2025-01-15',
        items: [
          { description: 'Consultation Fee', amount: 100 },
          { description: 'X-Ray', amount: 50 },
        ],
        status: 'unpaid',
      },
      {
        id: 2,
        date: '2025-01-20',
        items: [
          { description: 'Lab Test', amount: 200 },
          { description: 'Blood Test', amount: 100 },
        ],
        status: 'unpaid',
      },
      {
        id: 3,
        date: '2025-01-25',
        items: [
          { description: 'Medication', amount: 150 },
        ],
        status: 'paid',
      },
    ];
    setBills(fetchedBills);
  }, []);

  if (!isMounted) {
    return null;
  }

  const unpaidBills = bills.filter(bill => bill.status === 'unpaid');

  return (
    <PatientLayout>
      <Seo title="View Bills" />
      <Header title="View Bills" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl/9 font-bold pt-7 mb-2 pl-4">
          Your <span className="text-primary">Bills</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight">View Your Pending Payments</h2>
        <div className="p-4 my-5 w-full">
          {unpaidBills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 pt-4 pb-8">
              {unpaidBills.map(bill => {
                const totalAmount = bill.items.reduce((sum, item) => sum + item.amount, 0);
                return (
                  <div key={bill.id} className="border p-4 rounded-lg shadow-md ">
                    <p className='pb-2'><strong>Date:</strong> {bill.date}</p>
                    <p><strong>Description:</strong></p>
                    <ul className="list-disc pl-5 pb-2">
                      {bill.items.map((item, index) => (
                        <li key={index}>{item.description}: ₦{item.amount}</li>
                      ))}
                    </ul>
                    <p className='pb-2'><strong>Total Amount:</strong> ₦{totalAmount}</p>
                    <p><strong className='mr-3'>Status:</strong> <span className="text-red-900 bg-red-200 rounded-xl py-1 px-2">{bill.status}</span></p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-lg">No pending bill payments.</p>
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default ViewBills;