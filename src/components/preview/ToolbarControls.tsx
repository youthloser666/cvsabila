import React from "react";
import {
  FileDown,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Settings,
  RefreshCw,
  History,
  Package,
} from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { useExportEngine } from "../../hooks/useExportEngine";
import { Button } from "../ui/Button";

interface ToolbarControlsProps {
  onOpenBranding: () => void;
  onOpenHistory?: () => void;
  onOpenCatalog?: () => void;
}

export const ToolbarControls: React.FC<ToolbarControlsProps> = ({
  onOpenBranding,
  onOpenHistory,
  onOpenCatalog,
}) => {
  const { invoice, setOrientation, zoom, setZoom, resetToSample } = useInvoiceStore();
  const { isExporting, exportType, exportAsPdf, exportAsImage } = useExportEngine();

  const isLandscape = invoice.pageOrientation === "landscape";

  const toggleOrientation = () => {
    setOrientation(isLandscape ? "portrait" : "landscape");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-apple-hairline rounded-lg shadow-sm">
      {/* Left: Orientation & Zoom Controls */}
      <div className="flex items-center gap-2">
        {/* Orientation Toggle Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleOrientation}
          icon={<RotateCw className="w-3.5 h-3.5" />}
          title="Ganti orientasi kertas A4"
        >
          {isLandscape ? "A4 Landscape (297×210)" : "A4 Portrait (210×297)"}
        </Button>

        {/* Zoom Controls */}
        <div className="flex items-center border border-apple-hairline rounded-sm bg-apple-parchment/60 overflow-hidden">
          <button
            onClick={() => setZoom(zoom - 0.1)}
            className="p-1.5 hover:bg-black/5 text-apple-ink transition-colors"
            title="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold px-2 text-apple-ink min-w-[45px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.1)}
            className="p-1.5 hover:bg-black/5 text-apple-ink transition-colors"
            title="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(1.0)}
          title="Reset ukuran zoom 100%"
        >
          100%
        </Button>
      </div>

      {/* Right: Actions, History, Templates, & Exports */}
      <div className="flex items-center gap-2">
        {onOpenHistory && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenHistory}
            icon={<History className="w-3.5 h-3.5" />}
            title="Buka riwayat invoice tersimpan"
          >
            Riwayat
          </Button>
        )}

        {onOpenCatalog && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenCatalog}
            icon={<Package className="w-3.5 h-3.5" />}
            title="Kelola master kode dan memory barang"
          >
            Katalog Barang
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={resetToSample}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          title="Muat ulang contoh data asli PI026SMK291026.pdf"
        >
          Reset Contoh
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenBranding}
          icon={<Settings className="w-3.5 h-3.5" />}
        >
          Logo & Kop
        </Button>

        {/* Export Image */}
        <Button
          variant="secondary"
          size="sm"
          icon={<ImageIcon className="w-3.5 h-3.5" />}
          onClick={() => exportAsImage("png")}
          disabled={isExporting}
        >
          {isExporting && exportType === "image" ? "Mengekspor..." : "Export Image"}
        </Button>

        {/* Export PDF */}
        <Button
          variant="primary"
          size="sm"
          icon={<FileDown className="w-3.5 h-3.5" />}
          onClick={exportAsPdf}
          disabled={isExporting}
        >
          {isExporting && exportType === "pdf" ? "Mengekspor..." : "Export PDF"}
        </Button>
      </div>
    </div>
  );
};
