// components/DataVisualization.tsx
import React, { useEffect, useState } from "react";
import { parse } from "csv-parse/browser/esm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface DataVisualizationProps {
  csvData: string;
}

interface Invoice {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ csvData }) => {
  const [data, setData] = useState<Invoice[]>([]);

  useEffect(() => {
    // Parse CSV data
    parse(csvData, { columns: true, trim: true }, (err, records: Invoice[]) => {
      if (err) {
        console.error("Error parsing CSV data:", err);
        return;
      }
      setData(records);
    });
  }, [csvData]);

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {data.reduce((total, invoice) => {
              const amount = parseFloat(invoice.totalAmount.replace(/[^0-9.-]+/g, ""));
              return total + (isNaN(amount) ? 0 : amount);
            }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DataVisualization;
