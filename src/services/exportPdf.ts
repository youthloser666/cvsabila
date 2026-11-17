import jsPDF from "jspdf";
import { generateHighResImage } from "./exportImage";
import { PageOrientation } from "../models/types";

export interface ExportPdfOptions {
  orientation: PageOrientation;
  totalPages?: number;
  elementId?: string;
}

export async function generateA4Pdf({
  orientation,
  totalPages = 1,
  elementId,
}: ExportPdfOptions): Promise<jsPDF> {
  const isLandscape = orientation === "landscape";
  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;

  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // If specific single element requested
  if (elementId && totalPages <= 1) {
    const dataUrl = await generateHighResImage({
      format: "jpeg",
      elementId,
      dpiMultiplier: 3.125,
    });
    doc.addImage(dataUrl, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
    return doc;
  }

  // Multi-page sequential export
  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const targetId = `a4-page-${pageIdx}`;
    const node = document.getElementById(targetId);

    // Fallback if specific page element doesn't exist
    const actualId = node ? targetId : elementId || "a4-document-container";

    const dataUrl = await generateHighResImage({
      format: "jpeg",
      elementId: actualId,
      dpiMultiplier: 3.125,
    });

    if (pageIdx > 0) {
      doc.addPage(isLandscape ? "landscape" : "portrait");
    }

    doc.addImage(dataUrl, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
  }

  return doc;
}
