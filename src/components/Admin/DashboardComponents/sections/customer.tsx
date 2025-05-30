"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import { Trash2, Download } from "lucide-react";
import { PulseLoader } from "react-spinners";
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventId: string;
  bookingDate: string;
  // Add other customer fields as needed
}
const CustomerData = ({ eventId }: { eventId: string }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/customers?eventId=${eventId}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const customersData = await response.json();
        setCustomers(customersData.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [eventId]);

  const handleDownloadExcel = () => {
    if (customers.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Generate file name with event ID
    const fileName = `customers_event_${eventId}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <PulseLoader color="#6b7280" size={10} />
          <span className="ml-3">Loading customer data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Registrations</h2>
        {customers.length > 0 && (
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Download size={18} />
            Download Excel
          </button>
        )}
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No customers registered for this event yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.phone}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerData;
