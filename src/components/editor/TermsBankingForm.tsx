import React, { useState } from "react";
import { Upload, Trash2, PenTool, Plus, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { DEFAULT_COMPANY_PROFILE } from "../../assets/svk-logo";
import { pickImageAsBase64 } from "../../services/imagePicker";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const TermsBankingForm: React.FC = () => {
  const { invoice, updateTermsAndBanking, setSellerSignature } = useInvoiceStore();

  const handleUploadSignature = async () => {
    const base64 = await pickImageAsBase64();
    if (base64) {
      setSellerSignature(base64);
    }
  };

  const handleRemoveSignature = () => {
    setSellerSignature(null);
  };

  const [newStatement, setNewStatement] = useState("");

  const handleAddStatement = () => {
    if (!newStatement.trim()) return;
    updateTermsAndBanking({
      paymentTerms: [...(invoice.paymentTerms || []), newStatement.trim()],
    });
    setNewStatement("");
  };

  const handleUpdateStatement = (index: number, text: string) => {
    const updated = [...(invoice.paymentTerms || [])];
    updated[index] = text;
    updateTermsAndBanking({ paymentTerms: updated });
  };

  const handleDeleteStatement = (index: number) => {
    const updated = [...(invoice.paymentTerms || [])];
    updated.splice(index, 1);
    updateTermsAndBanking({ paymentTerms: updated });
  };

  const handleMoveStatement = (index: number, direction: "up" | "down") => {
    const terms = [...(invoice.paymentTerms || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= terms.length) return;
    const temp = terms[index];
    terms[index] = terms[targetIndex];
    terms[targetIndex] = temp;
    updateTermsAndBanking({ paymentTerms: terms });
  };

  const handleResetDefaultTerms = () => {
    updateTermsAndBanking({
      paymentTerms: [...DEFAULT_COMPANY_PROFILE.defaultTerms],
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-apple-divider pb-3">
        <h3 className="text-sm font-bold text-apple-ink tracking-tight">
          Rekening Bank & Ketentuan Pembayaran
        </h3>
        <p className="text-xs text-apple-ink-muted">
          Informasi rekening transfer, klausul pembayaran, dan penandatangan.
        </p>
      </div>

      {/* Banking information */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-apple-ink uppercase tracking-wider">
          Informasi Perbankan (Banking Information)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Nama Bank"
            value={invoice.bankName}
            onChange={(e) => updateTermsAndBanking({ bankName: e.target.value })}
            placeholder="BANK CENTRAL ASIA"
          />
          <Input
            label="Nomor Rekening"
            value={invoice.bankAccountNo}
            onChange={(e) => updateTermsAndBanking({ bankAccountNo: e.target.value })}
            placeholder="1221544329"
          />
          <Input
            label="Atas Nama (Account Name)"
            value={invoice.bankAccountName}
            onChange={(e) => updateTermsAndBanking({ bankAccountName: e.target.value })}
            placeholder="SYARIF IHSANUDDIN"
          />
        </div>
      </div>

      {/* Signatures & TTD Seller Upload */}
      <div className="space-y-3 pt-3 border-t border-apple-divider">
        <h4 className="text-xs font-bold text-apple-ink uppercase tracking-wider">
          Otorisasi & Tanda Tangan Seller
        </h4>

        {/* TTD Seller Upload Widget */}
        <div className="p-3 bg-apple-parchment/60 border border-apple-hairline rounded-md">
          <span className="block text-xs font-semibold uppercase tracking-wider text-apple-ink-muted mb-2">
            Gambar Tanda Tangan Seller (di bawah Best Regard)
          </span>
          <div className="flex items-center gap-4">
            {invoice.shipperSignatureUrl ? (
              <div className="bg-white p-2 border border-apple-hairline rounded-sm h-16 w-36 flex items-center justify-center">
                <img
                  src={invoice.shipperSignatureUrl}
                  alt="TTD Seller"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-16 w-36 border border-dashed border-apple-hairline rounded-sm flex flex-col items-center justify-center text-[10px] text-apple-ink-muted">
                <PenTool className="w-4 h-4 mb-1 opacity-50" />
                <span>Belum ada TTD</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={handleUploadSignature}
              >
                Upload TTD Seller
              </Button>
              {invoice.shipperSignatureUrl && (
                <Button
                  size="sm"
                  variant="danger"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={handleRemoveSignature}
                >
                  Hapus TTD
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <Input
            label="Nama Penjual / Shipper Signer (Best Regard)"
            value={invoice.shipperSigner}
            onChange={(e) => updateTermsAndBanking({ shipperSigner: e.target.value })}
            placeholder="Syarif Ihsanuddin"
          />
          <Input
            label="Nama Pembeli / Buyer Signer"
            value={invoice.buyerSigner}
            onChange={(e) => updateTermsAndBanking({ buyerSigner: e.target.value })}
            placeholder="PT.KAFE BATAVIA FATAHILLAH"
          />
        </div>
      </div>

      {/* Payment Terms & Statements CRUD */}
      <div className="space-y-3 pt-3 border-t border-apple-divider">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-apple-ink uppercase tracking-wider">
              Klausul & Syarat Ketentuan (Comments & Statements)
            </h4>
            <p className="text-[11px] text-apple-ink-muted">
              Pernyataan dan ketentuan kontrak yang dicetak di bagian bawah faktur.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefaultTerms}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-apple-blue bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
            title="Muat kembali 2 klausul standar ekspor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ketentuan Standar</span>
          </button>
        </div>

        {/* List of Statements */}
        <div className="space-y-2">
          {(!invoice.paymentTerms || invoice.paymentTerms.length === 0) ? (
            <div className="p-3 text-center text-xs text-apple-ink-muted border border-dashed border-apple-hairline rounded-md bg-apple-parchment/30">
              Belum ada klausul / pernyataan. Tambahkan di bawah atau klik &quot;Muat Ketentuan Standar&quot;.
            </div>
          ) : (
            invoice.paymentTerms.map((term, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-white border border-apple-hairline rounded-sm hover:border-gray-300 transition-colors"
              >
                <span className="text-xs font-mono font-bold text-gray-400 w-5 text-center">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleUpdateStatement(idx, e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-apple-hairline rounded-sm focus:outline-none focus:ring-1 focus:ring-apple-blue focus:border-apple-blue text-apple-ink"
                  placeholder="Klausul / syarat ketentuan..."
                />
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveStatement(idx, "up")}
                    className={`p-1.5 rounded transition-colors ${
                      idx === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:text-apple-ink hover:bg-gray-100"
                    }`}
                    title="Pindahkan ke atas"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === invoice.paymentTerms.length - 1}
                    onClick={() => handleMoveStatement(idx, "down")}
                    className={`p-1.5 rounded transition-colors ${
                      idx === invoice.paymentTerms.length - 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:text-apple-ink hover:bg-gray-100"
                    }`}
                    title="Pindahkan ke bawah"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStatement(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Hapus ketentuan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Statement Form */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newStatement}
            onChange={(e) => setNewStatement(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddStatement();
              }
            }}
            placeholder="Ketik klausul/ketentuan baru lalu tekan Tambah..."
            className="flex-1 text-xs px-3 py-1.5 border border-apple-hairline rounded-sm focus:outline-none focus:ring-1 focus:ring-apple-blue focus:border-apple-blue"
          />
          <Button
            size="sm"
            variant="secondary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleAddStatement}
          >
            Tambah Ketentuan
          </Button>
        </div>
      </div>
    </div>
  );
};
