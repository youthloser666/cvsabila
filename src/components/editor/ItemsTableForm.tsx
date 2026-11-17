import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { useProductStore } from "../../hooks/useProductStore";
import { pickImageAsBase64 } from "../../services/imagePicker";
import { ItemCatalogPreviewCard } from "./ItemCatalogPreviewCard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const ItemsTableForm: React.FC = () => {
  const {
    invoice,
    addItem,
    updateItem,
    removeItem,
    addCharge,
    updateCharge,
    removeCharge,
  } = useInvoiceStore();

  const { products, getProductByCode, openCreateModal } = useProductStore();

  const [expandedItemIds, setExpandedItemIds] = useState<Record<string, boolean>>({});
  const isUsd = invoice.currency === "USD";
  const [newChargeDesc, setNewChargeDesc] = useState(isUsd ? "Shipping / Freight" : "Ongkos Kirim");
  const [newChargeAmount, setNewChargeAmount] = useState(isUsd ? 15 : 23000);

  useEffect(() => {
    if (isUsd) {
      setNewChargeDesc("Shipping / Freight");
      setNewChargeAmount(15);
    } else {
      setNewChargeDesc("Ongkos Kirim");
      setNewChargeAmount(23000);
    }
  }, [isUsd]);

  const toggleExpand = (itemId: string) => {
    setExpandedItemIds((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleAddNewItem = () => {
    // Pick the first catalog product as a convenient starting point if available
    const firstProduct = products[0];
    if (firstProduct) {
      const unitPrice =
        isUsd && firstProduct.priceUsd != null
          ? firstProduct.priceUsd
          : firstProduct.priceIdr;

      addItem({
        productCode: firstProduct.code,
        description: firstProduct.description,
        colour: firstProduct.colour,
        unitPrice,
        dimDia: firstProduct.dimDia,
        dimL: firstProduct.dimL,
        dimW: firstProduct.dimW,
        dimH: firstProduct.dimH,
        quantity: 1,
        photoUrl: firstProduct.photoUrl || null,
      });
    } else {
      addItem({
        productCode: "ST - " + String(invoice.items.length + 1).padStart(3, "0"),
        description: "Item Baru",
        colour: "Natural",
        unitPrice: isUsd ? 1.0 : 15000,
        dimDia: null,
        dimL: 10.0,
        dimW: 10.0,
        dimH: 1.0,
        quantity: 1,
        photoUrl: null,
      });
    }
  };

  const handleCodeChange = (itemId: string, newCode: string) => {
    const matched = getProductByCode(newCode);
    if (matched) {
      const unitPrice =
        isUsd && matched.priceUsd != null ? matched.priceUsd : matched.priceIdr;

      updateItem(itemId, {
        productCode: matched.code,
        description: matched.description,
        colour: matched.colour,
        unitPrice,
        dimDia: matched.dimDia,
        dimL: matched.dimL,
        dimW: matched.dimW,
        dimH: matched.dimH,
        photoUrl: matched.photoUrl || undefined,
      });
    } else {
      updateItem(itemId, { productCode: newCode });
    }
  };

  const handlePhotoUpload = async (itemId: string) => {
    const base64 = await pickImageAsBase64();
    if (base64) {
      updateItem(itemId, { photoUrl: base64 });
    }
  };

  const handleAddCharge = () => {
    if (newChargeDesc && newChargeAmount > 0) {
      addCharge({ description: newChargeDesc, amount: Number(newChargeAmount) });
      setNewChargeDesc(isUsd ? "Shipping / Freight" : "Ongkos Kirim");
      setNewChargeAmount(isUsd ? 15 : 23000);
    }
  };

  return (
    <div className="space-y-6">
      {/* HTML Datalist for fast code autocomplete */}
      <datalist id="catalog-codes-list">
        {products.map((p) => (
          <option key={p.id} value={p.code}>
            {p.description} ({p.colour})
          </option>
        ))}
      </datalist>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-apple-divider pb-3">
        <div>
          <h3 className="text-sm font-bold text-apple-ink tracking-tight">
            Produk & Biaya Invoice
          </h3>
          <p className="text-xs text-apple-ink-muted">
            Cukup masukkan <strong>Kode Barang</strong> dan <strong>Kuantitas (QTY)</strong>. Data spesifikasi & harga otomatis diambil dari database lokal.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAddNewItem}
        >
          Tambah Baris Item
        </Button>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {invoice.items.map((item, index) => {
          const matched = getProductByCode(item.productCode);
          const isExpanded = !!expandedItemIds[item.id];

          return (
            <div
              key={item.id}
              className="p-3.5 bg-white border border-apple-hairline rounded-lg shadow-sm space-y-3 transition-all"
            >
              {/* Item Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-apple-ink bg-apple-parchment px-2 py-0.5 rounded-sm">
                    #{index + 1}
                  </span>
                  {!matched && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Belum di database katalog</span>
                      <button
                        type="button"
                        onClick={openCreateModal}
                        className="text-blue-600 underline font-medium hover:text-blue-800 ml-1 inline-flex items-center gap-0.5"
                      >
                        <PlusCircle className="w-2.5 h-2.5" />
                        Tambah ke Katalog
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition px-1.5 py-0.5 rounded hover:bg-slate-100"
                    title="Sesuaikan detail secara manual untuk baris ini"
                  >
                    <span>{isExpanded ? "Tutup Edit" : "Sesuaikan Manual"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 text-xs p-1 rounded hover:bg-red-50 transition"
                    title="Hapus Baris"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary User Inputs: Only CODE & QTY */}
              <div className="grid grid-cols-12 gap-3 items-end">
                {/* Kode Barang (CODE) */}
                <div className="col-span-7">
                  <label className="block text-xs font-semibold text-apple-ink mb-1">
                    KODE BARANG (CODE) *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      list="catalog-codes-list"
                      value={item.productCode}
                      onChange={(e) => handleCodeChange(item.id, e.target.value)}
                      placeholder="Pilih/ketik kode (misal ST - 020)"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-apple-hairline rounded-md text-apple-ink font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-apple-blue"
                    />
                    {products.length > 0 && (
                      <select
                        value={item.productCode}
                        onChange={(e) => handleCodeChange(item.id, e.target.value)}
                        className="px-2 py-2 text-xs bg-slate-50 border border-apple-hairline rounded-md text-slate-700 outline-none hover:bg-slate-100 transition cursor-pointer"
                        title="Pilih dari daftar database katalog"
                      >
                        <option value="">Pilih...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.code}>
                            {p.code} - {p.description}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Kuantitas (QTY) & Subtotal */}
                <div className="col-span-5 flex items-end gap-2">
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-apple-ink mb-1">
                      KUANTITAS (QTY) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-apple-hairline rounded-md text-apple-ink font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-apple-blue"
                    />
                  </div>

                  <div className="flex-1 bg-apple-parchment px-2.5 py-2 rounded-md border border-slate-200/60 text-right">
                    <span className="text-[9px] uppercase text-slate-400 block font-semibold leading-none">
                      Total Baris
                    </span>
                    <span className="text-xs font-bold text-slate-800 leading-tight block mt-0.5">
                      {isUsd
                        ? `$ ${item.totalPrice.toFixed(2)}`
                        : `Rp ${item.totalPrice.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Auto-Fetched Product Summary Card */}
              <ItemCatalogPreviewCard
                item={item}
                catalogProduct={matched}
                isUsd={isUsd}
              />

              {/* Optional Collapsible Manual Override Drawer */}
              {isExpanded && (
                <div className="pt-3 border-t border-dashed border-slate-200 space-y-3 bg-slate-50/50 p-3 rounded-lg animate-fade-in">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Penyesuaian Manual (Khusus Invoice Ini)
                  </span>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Thumbnail upload */}
                    <div className="col-span-3 flex flex-col items-center">
                      <div className="relative group w-16 h-16 rounded border border-apple-hairline overflow-hidden bg-white flex items-center justify-center">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.productCode}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                        )}
                        <button
                          type="button"
                          onClick={() => handlePhotoUpload(item.id)}
                          className="absolute inset-0 bg-black/40 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          Ganti
                        </button>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1">Ubah Foto</span>
                    </div>

                    <div className="col-span-9 space-y-2">
                      <Input
                        label="Deskripsi Barang"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Warna / Finish"
                          value={item.colour}
                          onChange={(e) =>
                            updateItem(item.id, { colour: e.target.value })
                          }
                        />
                        <Input
                          label={`Harga Satuan (${isUsd ? "USD $" : "IDR Rp"})`}
                          type="number"
                          step={isUsd ? "0.01" : "1"}
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(item.id, {
                              unitPrice: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <Input
                      label="Dia (cm)"
                      type="number"
                      step="0.1"
                      placeholder="(-)"
                      value={item.dimDia ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, {
                          dimDia: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                    <Input
                      label="L (cm)"
                      type="number"
                      step="0.1"
                      placeholder="(-)"
                      value={item.dimL ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, {
                          dimL: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                    <Input
                      label="W (cm)"
                      type="number"
                      step="0.1"
                      placeholder="(-)"
                      value={item.dimW ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, {
                          dimW: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                    <Input
                      label="H (cm)"
                      type="number"
                      step="0.1"
                      placeholder="(-)"
                      value={item.dimH ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, {
                          dimH: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Charges (Ongkos Kirim, etc.) */}
      <div className="pt-4 border-t border-apple-divider space-y-3">
        <h4 className="text-xs font-bold text-apple-ink uppercase tracking-wider">
          Biaya Tambahan / Ongkos Kirim ({isUsd ? "USD $" : "IDR Rp"})
        </h4>
        <div className="space-y-2">
          {invoice.additionalCharges.map((charge) => (
            <div
              key={charge.id}
              className="flex items-center gap-3 p-2 bg-white border border-apple-hairline rounded-sm"
            >
              <Input
                value={charge.description}
                onChange={(e) =>
                  updateCharge(charge.id, { description: e.target.value })
                }
                className="flex-1"
                placeholder={isUsd ? "Freight / Shipping description..." : "Keterangan biaya..."}
              />
              <div className="w-36">
                <Input
                  type="number"
                  step={isUsd ? "0.01" : "1000"}
                  value={charge.amount}
                  onChange={(e) =>
                    updateCharge(charge.id, { amount: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <button
                onClick={() => removeCharge(charge.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-2">
            <Input
              value={newChargeDesc}
              onChange={(e) => setNewChargeDesc(e.target.value)}
              placeholder={isUsd ? "Shipping / Freight description..." : "Deskripsi biaya..."}
              className="flex-1"
            />
            <div className="w-36">
              <Input
                type="number"
                step={isUsd ? "0.01" : "1000"}
                value={newChargeAmount}
                onChange={(e) => setNewChargeAmount(Number(e.target.value) || 0)}
              />
            </div>
            <Button size="sm" variant="secondary" onClick={handleAddCharge}>
              + Tambah Biaya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
