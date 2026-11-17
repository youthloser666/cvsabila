import React from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { InvoiceItem, ProductMaster } from "../../models/types";

interface ItemCatalogPreviewCardProps {
  item: InvoiceItem;
  catalogProduct?: ProductMaster;
  isUsd: boolean;
}

export const ItemCatalogPreviewCard: React.FC<ItemCatalogPreviewCardProps> = ({
  item,
  catalogProduct,
  isUsd,
}) => {
  const formatDimensions = () => {
    if (item.dimDia != null) {
      return `Dia: ${item.dimDia} cm ${item.dimH != null ? `× H: ${item.dimH} cm` : ""}`;
    }
    const parts = [
      item.dimL != null ? item.dimL : "-",
      item.dimW != null ? item.dimW : "-",
      item.dimH != null ? item.dimH : "-",
    ];
    if (parts.every((v) => v === "-")) return "(-)";
    return `${parts.join(" × ")} cm`;
  };

  const photo = item.photoUrl || catalogProduct?.photoUrl;

  return (
    <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-lg">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-md border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
        {photo ? (
          <img
            src={photo}
            alt={item.productCode}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-5 h-5 text-slate-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-800 truncate">
            {item.description || "Nama Produk"}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            <Sparkles className="w-2.5 h-2.5" />
            Auto-Catalog
          </span>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
          <span>
            Warna: <strong className="text-slate-700">{item.colour || "-"}</strong>
          </span>
          <span>•</span>
          <span>
            Dimensi: <strong className="text-slate-700">{formatDimensions()}</strong>
          </span>
          <span>•</span>
          <span>
            Satuan:{" "}
            <strong className="text-slate-700">
              {isUsd
                ? `$ ${item.unitPrice.toFixed(2)}`
                : `Rp ${item.unitPrice.toLocaleString("id-ID")}`}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
