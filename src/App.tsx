import React, { useState } from "react";
import { FileSpreadsheet, Sparkles, PlusCircle } from "lucide-react";
import { useInvoiceStore } from "./hooks/useInvoiceStore";
import { useExportEngine } from "./hooks/useExportEngine";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { InvoiceEditor } from "./components/editor/InvoiceEditor";
import { A4DocumentCanvas } from "./components/preview/A4DocumentCanvas";
import { ToolbarControls } from "./components/preview/ToolbarControls";
import { BrandingModal } from "./components/branding/BrandingModal";
import { InvoiceHistoryModal } from "./components/history/InvoiceHistoryModal";
import { ProductCatalogModal } from "./components/catalog/ProductCatalogModal";
import { ProductFormModal } from "./components/catalog/ProductFormModal";
import { useProductStore } from "./hooks/useProductStore";
import { Button } from "./components/ui/Button";

export const App: React.FC = () => {
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { invoice, createNewInvoice } = useInvoiceStore();
  const { openCatalogModal } = useProductStore();
  const { exportAsPdf, exportAsImage } = useExportEngine();

  // Register global shortcuts
  useKeyboardShortcuts({
    onExportPdf: exportAsPdf,
    onExportImage: exportAsImage,
    onToggleBranding: () => setIsBrandingOpen((prev) => !prev),
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-apple-parchment overflow-hidden select-none">
      {/* Top Application Bar */}
      <header className="h-14 border-b border-apple-hairline bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-apple-blue flex items-center justify-center text-white shadow-sm">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            {/* Header Line 1: Company Title */}
            <h1 className="text-sm font-bold text-apple-ink tracking-tight">
              CV. Sabila Multi Kreasindo
            </h1>
            {/* Header Line 2: INVOICE STUDIO moved here, subtitle text removed */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-apple-blue block leading-none mt-0.5">
              INVOICE STUDIO
            </span>
          </div>
        </div>

        {/* Right Info Badges & Quick Action */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={createNewInvoice}
            title="Buat invoice baru dengan penomoran urut otomatis"
          >
            Invoice Baru
          </Button>

          <div className="h-6 w-[1px] bg-apple-divider" />

          <div className="text-right text-xs">
            <span className="text-apple-ink-muted block text-[10px] uppercase font-semibold">
              Dokumen Aktif
            </span>
            <span className="font-bold text-apple-ink">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-apple-divider" />

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-apple-blue" />
            <span>{invoice.pageOrientation.toUpperCase()} A4</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Split-View */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Left: Invoice Data Editor (40% width) */}
        <section className="w-[42%] min-w-[420px] max-w-[600px] h-full flex flex-col shrink-0">
          <InvoiceEditor />
        </section>

        {/* Right: Live A4 Document Preview & Toolbar (60% width) */}
        <section className="flex-1 h-full flex flex-col gap-3 min-w-0">
          {/* Preview Toolbar */}
          <div className="shrink-0">
            <ToolbarControls
              onOpenBranding={() => setIsBrandingOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenCatalog={() => openCatalogModal()}
            />
          </div>

          {/* Virtual A4 Canvas Viewport */}
          <div className="flex-1 rounded-lg border border-apple-hairline overflow-hidden bg-white shadow-sm">
            <A4DocumentCanvas />
          </div>
        </section>
      </main>

      {/* Modals */}
      <BrandingModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
      />

      <InvoiceHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <ProductCatalogModal />
      <ProductFormModal />
    </div>
  );
};

export default App;
