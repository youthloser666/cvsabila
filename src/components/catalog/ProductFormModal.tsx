import React, { useEffect, useState } from "react";
import { Camera, Image as ImageIcon, Trash2, X } from "lucide-react";
import { useProductStore } from "../../hooks/useProductStore";
import { ProductMaster } from "../../models/types";

export const ProductFormModal: React.FC = () => {
  const {
    isFormModalOpen,
    editingProduct,
    closeFormModal,
    addProduct,
    updateProduct,
  } = useProductStore();

  const [code, setCode] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [colour, setColour] = useState("");
  const [dimDia, setDimDia] = useState<string>("");
  const [dimL, setDimL] = useState<string>("");
  const [dimW, setDimW] = useState<string>("");
  const [dimH, setDimH] = useState<string>("");
  const [priceIdr, setPriceIdr] = useState<string>("");
  const [priceUsd, setPriceUsd] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setCode(editingProduct.code);
      setPhotoUrl(editingProduct.photoUrl || null);
      setDescription(editingProduct.description);
      setColour(editingProduct.colour);
      setDimDia(editingProduct.dimDia != null ? String(editingProduct.dimDia) : "");
      setDimL(editingProduct.dimL != null ? String(editingProduct.dimL) : "");
      setDimW(editingProduct.dimW != null ? String(editingProduct.dimW) : "");
      setDimH(editingProduct.dimH != null ? String(editingProduct.dimH) : "");
      setPriceIdr(String(editingProduct.priceIdr || ""));
      setPriceUsd(editingProduct.priceUsd != null ? String(editingProduct.priceUsd) : "");
    } else {
      setCode("");
      setPhotoUrl(null);
      setDescription("");
      setColour("Natural");
      setDimDia("");
      setDimL("");
      setDimW("");
      setDimH("");
      setPriceIdr("");
      setPriceUsd("");
    }
    setError(null);
  }, [editingProduct, isFormModalOpen]);

  if (!isFormModalOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (PNG, JPG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Kode produk wajib diisi.");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi produk wajib diisi.");
      return;
    }

    const parsedIdr = parseFloat(priceIdr) || 0;
    const parsedUsd = priceUsd ? parseFloat(priceUsd) : null;
    const parsedDia = dimDia ? parseFloat(dimDia) : null;
    const parsedL = dimL ? parseFloat(dimL) : null;
    const parsedW = dimW ? parseFloat(dimW) : null;
    const parsedH = dimH ? parseFloat(dimH) : null;

    const payload: Omit<ProductMaster, "id" | "createdAt" | "updatedAt"> = {
      code: code.trim(),
      photoUrl,
      description: description.trim(),
      colour: colour.trim() || "Natural",
      dimDia: parsedDia,
      dimL: parsedL,
      dimW: parsedW,
      dimH: parsedH,
      priceIdr: parsedIdr,
      priceUsd: parsedUsd,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }

    closeFormModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editingProduct ? "Edit Master Produk" : "Tambah Produk Baru"}
            </h2>
            <p className="text-xs text-slate-500">
              Master katalog barang CV. Sabila Multi Kreasindo
            </p>
          </div>
          <button
            onClick={closeFormModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Row 1: Code & Colour */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                KODE BARANG (CODE) *
              </label>
              <input
                type="text"
                placeholder="Contoh: ST - 020"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WARNA / FINISHING (COLOUR)
              </label>
              <input
                type="text"
                placeholder="Natural / Combine / Gold"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DESKRIPSI PRODUK (DESCRIPTION) *
            </label>
            <input
              type="text"
              placeholder="Contoh: Serving Plate Capiz Shell"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          {/* Row 3: Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              FOTO PRODUK (PHOTO)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 cursor-pointer transition">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pilih Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-400">
                  Format PNG/JPG/WebP, tersimpan otomatis dalam memory
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Dimensions (Dia, L, W, H) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              DIMENSI PRODUK (DIMENSION in cm)
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                  Dia (Diameter)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="-"
                  value={dimDia}
                  onChange={(e) => setDimDia(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                  L (Panjang)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="-"
                  value={dimL}
                  onChange={(e) => setDimL(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                  W (Lebar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="-"
                  value={dimW}
                  onChange={(e) => setDimW(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                  H (Tinggi)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="-"
                  value={dimH}
                  onChange={(e) => setDimH(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none text-center"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Kosongkan atau isi strip (-) jika produk tidak menggunakan diameter/dimensi tertentu.
            </p>
          </div>

          {/* Row 5: Price (IDR and USD) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HARGA SATUAN (IDR - Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="18000"
                  value={priceIdr}
                  onChange={(e) => setPriceIdr(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HARGA SATUAN (USD - $)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1.20"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-[#0066cc] rounded-lg shadow-sm hover:bg-[#0055b3] transition"
            >
              {editingProduct ? "Simpan Perubahan" : "Tambahkan ke Katalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
