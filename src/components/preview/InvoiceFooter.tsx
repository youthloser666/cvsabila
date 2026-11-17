import React from "react";
import { Invoice } from "../../models/types";

interface InvoiceFooterProps {
  invoice: Invoice;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ invoice }) => {
  return (
    <div className="w-full text-black font-sans mt-4 text-[11px] leading-relaxed">
      {/* Additional Comment and Statements */}
      {invoice.paymentTerms && invoice.paymentTerms.length > 0 && (
        <div className="mb-4">
          <h4 className="italic font-bold text-gray-900 mb-1">
            Additional Comment and Statements:
          </h4>
          <ul className="list-disc list-inside space-y-0.5 text-gray-800 text-[10.5px]">
            {invoice.paymentTerms.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Banking Information and Signatures */}
      <div className="grid grid-cols-12 gap-4 pt-3">
        {/* Banking Information (Left Column) */}
        <div className="col-span-6 space-y-1">
          <h4 className="font-bold text-gray-950 uppercase tracking-tight text-[11px]">
            BANKING INFORMATION :
          </h4>
          <div className="grid grid-cols-12 text-[10.5px]">
            <span className="col-span-4 text-gray-700">Bank Name</span>
            <span className="col-span-8 font-semibold text-gray-900">: {invoice.bankName}</span>
          </div>
          <div className="grid grid-cols-12 text-[10.5px]">
            <span className="col-span-4 text-gray-700">Account No</span>
            <span className="col-span-8 font-semibold text-gray-900">: {invoice.bankAccountNo}</span>
          </div>
          <div className="grid grid-cols-12 text-[10.5px]">
            <span className="col-span-4 text-gray-700">Account Name</span>
            <span className="col-span-8 font-semibold text-gray-900">: {invoice.bankAccountName}</span>
          </div>
        </div>

        {/* Best Regard (Shipper Signer) - Center Line Removed */}
        <div className="col-span-3 text-center flex flex-col justify-between items-center min-h-[95px]">
          <span className="font-bold text-gray-900">Best Regard</span>
          <div className="h-16 flex items-center justify-center">
            {invoice.shipperSignatureUrl ? (
              <img
                src={invoice.shipperSignatureUrl}
                alt="TTD Seller"
                className="max-h-16 max-w-[130px] object-contain"
              />
            ) : (
              /* Clean blank space without horizontal line */
              <div className="h-14 w-full" />
            )}
          </div>
          <span className="font-bold underline text-gray-950 text-[11px]">
            {invoice.shipperSigner}
          </span>
        </div>

        {/* Buyer Signer */}
        <div className="col-span-3 text-center flex flex-col justify-between items-center min-h-[95px]">
          <span className="font-bold text-gray-900">Buyer</span>
          <div className="h-16 flex items-center justify-center">
            <div className="h-14 w-full" />
          </div>
          <span className="font-bold text-gray-950 text-[10px] uppercase">
            {invoice.buyerSigner}
          </span>
        </div>
      </div>
    </div>
  );
};
