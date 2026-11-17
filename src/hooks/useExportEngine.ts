import { useState } from "react";
import { useInvoiceStore } from "./useInvoiceStore";
import { generateHighResImage } from "../services/exportImage";
import { generateA4Pdf } from "../services/exportPdf";
import { splitInvoicePages } from "../services/pagination";

export function useExportEngine() {
  const { invoice } = useInvoiceStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "image" | null>(null);

  // Helper to trigger browser download
  const triggerBrowserDownload = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCleanFileName = (extension: string) => {
    const safeNumber = invoice.invoiceNumber.replace(/[\/\\?%*:|"<>]/g, "_");
    return `${safeNumber}_${invoice.pageOrientation}.${extension}`;
  };

  const exportAsImage = async (format: "png" | "jpeg" = "png") => {
    try {
      setIsExporting(true);
      setExportType("image");

      const targetId = document.getElementById("a4-page-0")
        ? "a4-page-0"
        : "a4-document-container";

      const dataUrl = await generateHighResImage({
        format,
        elementId: targetId,
        dpiMultiplier: 3.125,
      });

      const fileName = getCleanFileName(format);

      // Check if Tauri dialog & fs are available
      try {
        const { save } = await import("@tauri-apps/plugin-dialog");
        const { writeFile } = await import("@tauri-apps/plugin-fs");

        const targetPath = await save({
          defaultPath: fileName,
          filters: [{ name: `Image (${format.toUpperCase()})`, extensions: [format] }],
        });

        if (targetPath) {
          const base64Data = dataUrl.split(",")[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await writeFile(targetPath, bytes);
          alert(`Gambar berhasil disimpan ke: ${targetPath}`);
          return;
        }
      } catch {
        // Fallback to browser direct download
        triggerBrowserDownload(dataUrl, fileName);
      }
    } catch (err) {
      console.error("Export Image error:", err);
      alert("Gagal mengekspor gambar: " + (err as Error).message);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportAsPdf = async () => {
    try {
      setIsExporting(true);
      setExportType("pdf");

      const pages = splitInvoicePages(invoice.items, invoice.pageOrientation);

      const doc = await generateA4Pdf({
        orientation: invoice.pageOrientation,
        totalPages: pages.length,
      });

      const fileName = getCleanFileName("pdf");

      // Check if Tauri dialog & fs are available
      try {
        const { save } = await import("@tauri-apps/plugin-dialog");
        const { writeFile } = await import("@tauri-apps/plugin-fs");

        const targetPath = await save({
          defaultPath: fileName,
          filters: [{ name: "PDF Document", extensions: ["pdf"] }],
        });

        if (targetPath) {
          const pdfBytes = doc.output("arraybuffer");
          await writeFile(targetPath, new Uint8Array(pdfBytes));
          alert(`PDF (${pages.length} Halaman) berhasil disimpan ke: ${targetPath}`);
          return;
        }
      } catch {
        // Fallback to direct download
        doc.save(fileName);
      }
    } catch (err) {
      console.error("Export PDF error:", err);
      alert("Gagal mengekspor PDF: " + (err as Error).message);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return {
    isExporting,
    exportType,
    exportAsPdf,
    exportAsImage,
  };
}
