import React from "react";
import { Invoice, InvoiceItem } from "../../models/types";

interface InvoiceTableProps {
  invoice: Invoice;
  itemsSegment?: InvoiceItem[];
  startIndex?: number;
  showTotalsRow?: boolean;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoice,
  itemsSegment,
  startIndex = 0,
  showTotalsRow = true,
}) => {
  const { additionalCharges, totalQuantity, grandTotal, currency } = invoice;
  const items = itemsSegment || invoice.items;
  const isUsd = currency === "USD";

  const formatNumber = (num?: number | null) => {
    if (num === null || num === undefined || isNaN(num)) return "(-)";
    return num.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  };

  const formatCurrency = (val: number) => {
    if (isUsd) {
      return `$ ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  return (
    <div className="w-full my-3">
      <table className="w-full border-collapse border border-gray-950 text-[10px] text-gray-900 leading-tight">
        <thead>
          <tr className="bg-[#1f497d] text-white font-bold text-center border-b border-gray-950">
            <th className="border border-gray-950 py-1.5 px-1 w-[4%]" rowSpan={2}>
              NO
            </th>
            <th className="border border-gray-950 py-1.5 px-1 w-[8%]" rowSpan={2}>
              CODE
            </th>
            <th className="border border-gray-950 py-1.5 px-1 w-[12%]" rowSpan={2}>
              PHOTO
            </th>
            <th className="border border-gray-950 py-1.5 px-2 w-[22%]" rowSpan={2}>
              DESCRIPTION
            </th>
            <th className="border border-gray-950 py-1.5 px-1 w-[8%]" rowSpan={2}>
              COLOUR
            </th>
            <th className="border border-gray-950 py-1.5 px-1 w-[13%]" rowSpan={2}>
              Price ({isUsd ? "USD" : "IDR"})
            </th>
            <th className="border border-gray-950 py-0.5 px-1" colSpan={4}>
              DIMENSIONS (Cm)
            </th>
            <th className="border border-gray-950 py-1.5 px-1 w-[5%]" rowSpan={2}>
              Qty
            </th>
            <th className="border border-gray-950 py-1.5 px-1 w-[14%]" rowSpan={2}>
              TOTAL
            </th>
          </tr>
          <tr className="bg-[#1f497d] text-white font-bold text-center border-b border-gray-950 text-[9px]">
            <th className="border border-gray-950 py-0.5 w-[3.5%]">Dia</th>
            <th className="border border-gray-950 py-0.5 w-[3.5%]">L</th>
            <th className="border border-gray-950 py-0.5 w-[3.5%]">W</th>
            <th className="border border-gray-950 py-0.5 w-[3.5%]">H</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr className="border-b border-gray-950">
              <td
                colSpan={12}
                className="border border-gray-950 text-center py-6 px-3 text-gray-400 italic text-[11px]"
              >
                No items added yet. Click &quot;+ Tambah Baris Item&quot; to add products.
              </td>
            </tr>
          )}
          {items.map((item, idx) => (
            <tr
              key={item.id}
              className="border-b border-gray-950 hover:bg-gray-50/50 transition-colors"
            >
              <td className="border border-gray-950 text-center py-2 px-1 font-medium">
                {startIndex + idx + 1}
              </td>
              <td className="border border-gray-950 text-center py-2 px-1 font-semibold text-[9.5px]">
                {item.productCode}
              </td>
              <td className="border border-gray-950 text-center p-1">
                {item.photoUrl ? (
                  <div className="w-14 h-14 mx-auto flex items-center justify-center overflow-hidden">
                    <img
                      src={item.photoUrl}
                      alt={item.productCode}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 mx-auto border border-dashed border-gray-300 rounded flex items-center justify-center text-[8px] text-gray-400">
                    No Photo
                  </div>
                )}
              </td>
              <td className="border border-gray-950 text-center py-2 px-2 font-medium">
                {item.description}
              </td>
              <td className="border border-gray-950 text-center py-2 px-1">
                {item.colour}
              </td>
              <td className="border border-gray-950 text-right py-2 px-2 font-bold whitespace-nowrap">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">
                {formatNumber(item.dimDia)}
              </td>
              <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">
                {formatNumber(item.dimL)}
              </td>
              <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">
                {formatNumber(item.dimW)}
              </td>
              <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">
                {formatNumber(item.dimH)}
              </td>
              <td className="border border-gray-950 text-center py-2 px-1 font-bold">
                {item.quantity}
              </td>
              <td className="border border-gray-950 text-right py-2 px-2 font-bold whitespace-nowrap">
                {formatCurrency(item.totalPrice)}
              </td>
            </tr>
          ))}

          {/* Additional Charges (Ongkos Kirim, etc.) only on final page / when showTotalsRow is true */}
          {showTotalsRow &&
            additionalCharges.map((charge, cIdx) => (
              <tr key={charge.id} className="border-b border-gray-950 font-semibold">
                <td className="border border-gray-950 text-center py-2 px-1">
                  {invoice.items.length + cIdx + 1}
                </td>
                <td
                  colSpan={4}
                  className="border border-gray-950 text-center py-2 px-3 font-medium text-gray-900"
                >
                  {charge.description}
                </td>
                <td className="border border-gray-950 text-right py-2 px-2 font-bold whitespace-nowrap">
                  {formatCurrency(charge.amount)}
                </td>
                <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">(-)</td>
                <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">(-)</td>
                <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">(-)</td>
                <td className="border border-gray-950 text-center py-2 px-0.5 text-[9px]">(-)</td>
                <td className="border border-gray-950 text-center py-2 px-1 font-bold">1</td>
                <td className="border border-gray-950 text-right py-2 px-2 font-bold whitespace-nowrap">
                  {formatCurrency(charge.amount)}
                </td>
              </tr>
            ))}

          {/* Grand Total Row only on final page */}
          {showTotalsRow ? (
            <tr className="border-t-2 border-gray-950 font-extrabold text-[11px] bg-gray-50/70">
              <td colSpan={10} className="border border-gray-950 text-right py-2.5 px-3 uppercase tracking-wider">
                TOTAL
              </td>
              <td className="border border-gray-950 text-center py-2.5 px-1 text-black font-black">
                {totalQuantity}
              </td>
              <td className="border border-gray-950 text-right py-2.5 px-2 text-black font-black whitespace-nowrap">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          ) : (
            <tr className="border-t border-gray-950 bg-gray-50/50">
              <td colSpan={12} className="text-right py-1.5 px-3 italic text-[9px] text-gray-500">
                Continued on next page...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
