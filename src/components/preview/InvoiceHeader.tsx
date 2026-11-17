import React from "react";
import { Invoice } from "../../models/types";

interface InvoiceHeaderProps {
  invoice: Invoice;
  isContinuationPage?: boolean;
  pageNumber?: number;
  totalPages?: number;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoice,
  isContinuationPage = false,
  pageNumber = 1,
  totalPages = 1,
}) => {
  const { shipper, consignee } = invoice;

  if (isContinuationPage) {
    return (
      <div className="w-full text-black font-sans mb-3 pb-2 border-b-2 border-gray-900 flex items-center justify-between">
        <div>
          <span className="font-extrabold text-xs uppercase tracking-tight text-gray-950">
            {shipper.companyName}
          </span>
          <span className="text-[11px] text-gray-700 ml-2">
            • {invoice.documentType} ({invoice.invoiceNumber})
          </span>
        </div>
        <div className="text-[10px] font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-sm">
          PAGE {pageNumber} OF {totalPages}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-black font-sans mb-4">
      {/* Top Branding Section */}
      <div className="flex items-center justify-between pb-3">
        {/* Logo */}
        <div className="w-52 h-20 flex items-center">
          {shipper.logoDataUrl ? (
            <img
              src={shipper.logoDataUrl}
              alt="Company Logo"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-xl font-black text-gray-700 tracking-tighter">
              {shipper.companyName}
            </div>
          )}
        </div>

        {/* Company Address & Contacts */}
        <div className="text-right">
          <h2 className="text-base font-extrabold uppercase tracking-tight text-gray-900">
            {shipper.companyName}
          </h2>
          <p className="text-[11px] text-gray-700 leading-tight">{shipper.address}</p>
          <p className="text-[11px] text-gray-700 leading-tight">{shipper.cityRegion}</p>
          <p className="text-[11px] text-gray-700 leading-tight">
            {shipper.email} / {shipper.phone}
          </p>
        </div>
      </div>

      {/* Document Title & Reference */}
      <div className="text-center my-3 relative">
        <h1 className="text-lg font-bold tracking-wider underline uppercase text-gray-950">
          {invoice.documentType}
        </h1>
        <p className="text-xs font-semibold text-gray-800 tracking-wide mt-0.5">
          {invoice.invoiceNumber}
        </p>
        {totalPages > 1 && (
          <span className="absolute right-0 top-1 text-[9px] font-bold text-gray-500 uppercase bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-sm">
            Page {pageNumber} of {totalPages}
          </span>
        )}
      </div>

      {/* Shipper & Consignee Box Table */}
      <div className="border border-gray-950 text-xs">
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-gray-100/60 border-b border-gray-950 font-bold text-gray-900">
          <div className="p-1.5 border-r border-gray-950">Shipper</div>
          <div className="p-1.5">Consignee</div>
        </div>

        {/* Parties Content */}
        <div className="grid grid-cols-2">
          {/* Shipper Details */}
          <div className="p-2 border-r border-gray-950 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold uppercase text-[11px] text-gray-950">
                {shipper.companyName}
              </div>
              <div className="text-[10px] text-gray-800 leading-relaxed mt-0.5">
                {shipper.address}
                <br />
                {shipper.cityRegion}
              </div>
            </div>

            {/* Date and Origin/Destination inside Shipper box as in sample PDF */}
            <div className="border-t border-gray-300 pt-1.5 text-[10px] space-y-1">
              <div className="grid grid-cols-12">
                <span className="col-span-5 text-gray-600">Date</span>
                <span className="col-span-7 font-medium text-gray-900">
                  {invoice.issueDate}
                </span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-5 text-gray-600">Country of Destination</span>
                <span className="col-span-7 font-medium text-gray-900">
                  {invoice.countryOfDestination}
                </span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-5 text-gray-600">Country of Origin</span>
                <span className="col-span-7 font-medium text-gray-900">
                  {invoice.countryOfOrigin}
                </span>
              </div>
            </div>
          </div>

          {/* Consignee Details */}
          <div className="p-2 flex flex-col justify-between">
            <div>
              <div className="font-bold uppercase text-[11px] text-gray-950">
                {consignee.companyName}
              </div>
              <div className="text-[10px] text-gray-800 leading-relaxed mt-1">
                {consignee.streetAddress}
                <br />
                {consignee.cityRegion}
              </div>
            </div>
            <div className="text-[10px] font-semibold text-gray-900 mt-2">
              {consignee.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
