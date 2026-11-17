import React from "react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { splitInvoicePages } from "../../services/pagination";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceFooter } from "./InvoiceFooter";

export const A4DocumentCanvas: React.FC = () => {
  const { invoice, zoom } = useInvoiceStore();
  const isLandscape = invoice.pageOrientation === "landscape";

  const pages = splitInvoicePages(invoice.items, invoice.pageOrientation);

  // Standard A4 dimensions in millimeters
  const sheetStyles: React.CSSProperties = {
    width: isLandscape ? "297mm" : "210mm",
    minHeight: isLandscape ? "210mm" : "297mm",
    transform: `scale(${zoom})`,
    transformOrigin: "top center",
    transition: "transform 0.15s ease-out, width 0.2s ease, min-height 0.2s ease",
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto p-8 bg-[#4a4d52]/10 gap-8">
      {pages.map((pageSegment, pageIndex) => {
        return (
          <div
            key={`a4-page-segment-${pageIndex}`}
            id={`a4-page-${pageIndex}`}
            style={sheetStyles}
            className="bg-white text-black shadow-2xl rounded-[1px] p-[12mm] border border-gray-300 relative shrink-0 box-border print:m-0 print:p-[10mm] print:shadow-none print:border-none flex flex-col justify-between"
          >
            <div>
              {/* Document Header (Full branding on Page 1, compact continuation on Page 2+) */}
              <InvoiceHeader
                invoice={invoice}
                isContinuationPage={!pageSegment.showMainHeader}
                pageNumber={pageSegment.pageNumber}
                totalPages={pageSegment.totalPages}
              />

              {/* Segmented Table for this specific page */}
              <InvoiceTable
                invoice={invoice}
                itemsSegment={pageSegment.items}
                startIndex={pageSegment.startIndex}
                showTotalsRow={pageSegment.showTotalsAndSignatures}
              />
            </div>

            {/* Terms, Banking & Signatures only on final page */}
            {pageSegment.showTotalsAndSignatures && (
              <div className="mt-auto">
                <InvoiceFooter invoice={invoice} />
              </div>
            )}

            {/* Bottom Page Number Badge */}
            {pages.length > 1 && (
              <div className="text-right text-[8px] text-gray-400 mt-2 font-mono print:hidden">
                Page {pageSegment.pageNumber} of {pageSegment.totalPages}
              </div>
            )}
          </div>
        );
      })}

      {/* Legacy fallback container reference for single-page image exporters */}
      <div id="a4-document-container" className="hidden" />
    </div>
  );
};
