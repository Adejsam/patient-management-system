import { DataTable } from "../../../../admin components/bills and payment/invoice/data-table";
import { Invoice, columns } from "../../../../admin components/bills and payment/invoice/column";
import { useEffect, useState } from "react";

interface ApiResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
    totalRecords: number;
  };
}

function getData(): Promise<Invoice[]> {
  return fetch("http://localhost/hospital_api/get_all_invoices.php")
    .then((response) => response.json())
    .then((data: ApiResponse) => {
      if (data.success) {
        return data.data.invoices;
      }
      throw new Error("Failed to fetch invoices");
    });
}

export default function Invoices() {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData()
      .then((invoices) => {
        setData(invoices);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
