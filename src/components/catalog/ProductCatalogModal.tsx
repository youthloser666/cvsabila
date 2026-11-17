import React, { useRef, useState } from "react";
import {
  Download,
  Edit2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useProductStore } from "../../hooks/useProductStore";
import { ProductMaster } from "../../models/types";
import { parseCatalogFromJson } from "../../services/productCatalog";

export const ProductCatalogModal: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    isCatalogModalOpen,
    closeCatalogModal,
    openCreateModal,
    openEditModal,
    deleteProduct,
    importCatalog,
    exportCatalog,
    syncFromBackend,
    isLoading,
  } = useProductStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isCatalogModalOpen) return null;

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.code.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.colour.toLowerCase().includes(q)
    );
  });

  const handleExport = async () => {
    try {
      const res = await exportCatalog("CV. Sabila Multi Kreasindo");
      if (res && res.success && res.savedPath) {
        setImportStatus(`Katalog berhasil disimpan ke: ${res.savedPath}`);
        setTimeout(() => setImportStatus(null), 5000);
      } else if (res && res.canceled) {
        // User closed dialog cleanly
      }
    } catch (err: any) {
      setImportStatus(`Gagal export: ${err.message}`);
      setTimeout(() => setImportStatus(null), 5000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = parseCatalogFromJson(text);
        if (res.success && res.data) {
          importCatalog(res.data.products, "merge");
          setImportStatus(`Berhasil mengimpor ${res.data.products.length} produk.`);
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus(`Gagal impor: ${res.error || "Format tidak valid"}`);
          setTimeout(() => setImportStatus(null), 6000);
        }
      } catch (err: any) {
        setImportStatus(`Gagal membaca file: ${err.message}`);
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDimensions = (p: ProductMaster): string => {
    if (p.dimDia != null) {
      return `Dia: ${p.dimDia} cm ${p.dimH != null ? `× H: ${p.dimH} cm` : ""}`;
    }
    const parts = [
      p.dimL != null ? p.dimL : "-",
      p.dimW != null ? p.dimW : "-",
      p.dimH != null ? p.dimH : "-",
    ];
    if (parts.every((v) => v === "-")) return "-";
    return `${parts.join(" × ")} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Master Katalog & Memory Barang
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
                {products.length} Produk Tersimpan
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kelola master kode, foto, spesifikasi dimensi, dan harga dual-currency (IDR / USD)
            </p>
          </div>
          <button
            onClick={closeCatalogModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan kode, deskripsi, warna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => syncFromBackend()}
              title="Sinkronisasi dari Bun backend server"
              className="p-2 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`}
              />
            </button>

            <button
              onClick={handleExport}
              title="Download memory katalog dalam format .json"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Impor memory katalog dari file .json"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#0066cc] rounded-lg hover:bg-[#0055b3] transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* Status banner */}
        {importStatus && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 flex items-center justify-between">
            <span>{importStatus}</span>
            <button
              onClick={() => setImportStatus(null)}
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-sm">Tidak ada produk yang sesuai.</p>
              <button
                onClick={openCreateModal}
                className="mt-3 text-xs text-[#0066cc] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah produk baru ke katalog
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 w-12 text-center">Foto</th>
                  <th className="py-2.5 px-3 w-28">Kode</th>
                  <th className="py-2.5 px-3">Deskripsi</th>
                  <th className="py-2.5 px-3 w-24">Warna</th>
                  <th className="py-2.5 px-3 w-32">Dimensi (cm)</th>
                  <th className="py-2.5 px-3 w-28 text-right">Harga (IDR)</th>
                  <th className="py-2.5 px-3 w-24 text-right">Harga (USD)</th>
                  <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Photo Thumbnail */}
                    <td className="py-2 px-3 text-center">
                      <div className="w-9 h-9 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden mx-auto">
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt={p.code}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {p.code}
                    </td>

                    {/* Description */}
                    <td className="py-2 px-3 text-slate-700">
                      {p.description}
                    </td>

                    {/* Colour */}
                    <td className="py-2 px-3 text-slate-600">
                      {p.colour}
                    </td>

                    {/* Dimensions */}
                    <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                      {formatDimensions(p)}
                    </td>

                    {/* Price IDR */}
                    <td className="py-2 px-3 text-right font-medium text-slate-800">
                      Rp {p.priceIdr.toLocaleString("id-ID")}
                    </td>

                    {/* Price USD */}
                    <td className="py-2 px-3 text-right text-slate-600">
                      {p.priceUsd != null ? `$ ${p.priceUsd.toFixed(2)}` : "-"}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit produk"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus produk "${p.code}" dari katalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          title="Hapus produk"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan {filteredProducts.length} dari {products.length} item
          </span>
          <button
            onClick={closeCatalogModal}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
