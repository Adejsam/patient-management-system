import { DataTable } from "../../../../admin components/bills and payment/receipt/data-table";
import { Receipt, columns } from "../../../../admin components/bills and payment/receipt/column";
import { useEffect, useState } from "react";

interface ApiResponse {
  success: boolean;
  data: {
    receipts: Receipt[];
    totalRecords: number;
  };
}

function getData(): Promise<Receipt[]> {
  return fetch("http://localhost/hospital_api/get_all_receipt.php")
    .then((response) => response.json())
    .then((data: ApiResponse) => {
      if (data.success) {
        return data.data.receipts;
      }
      throw new Error("Failed to fetch receipts");
    });
}

export default function Receipts() {
  const [data, setData] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData()
      .then((receipts) => {
        setData(receipts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching receipts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Receipts</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
