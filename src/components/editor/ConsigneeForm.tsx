import React from "react";
import { Sparkles } from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { loadInvoicesFromStorage } from "../../services/storage";
import { generateNextInvoiceNumber } from "../../models/schemas";
import { Input } from "../ui/Input";

export const ConsigneeForm: React.FC = () => {
  const { invoice, updateInvoiceMetadata, updateConsignee, setCurrencyAndSync } = useInvoiceStore();

  const handleRegenerateNumber = () => {
    const history = loadInvoicesFromStorage();
    const existing = history.map((inv) => inv.invoiceNumber);
    const nextNum = generateNextInvoiceNumber(existing);
    updateInvoiceMetadata({ invoiceNumber: nextNum });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-apple-divider pb-3">
        <h3 className="text-sm font-bold text-apple-ink tracking-tight">
          Informasi Dokumen & Pengiriman
        </h3>
        <p className="text-xs text-apple-ink-muted">
          Nomor invoice berurutan otomatis (dapat diubah manual), tanggal, dan tujuan pengiriman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-7">
          <Input
            label="Nomor Dokumen / Invoice (Otomatis / Manual)"
            value={invoice.invoiceNumber}
            onChange={(e) => updateInvoiceMetadata({ invoiceNumber: e.target.value })}
            placeholder="026/PI/SMK-SL-V/2026"
            helperText="Nomor faktur berurutan otomatis dari 026, 027, dst."
          />
        </div>
        <div className="md:col-span-5 flex items-center pb-5">
          <button
            type="button"
            onClick={handleRegenerateNumber}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-apple-blue bg-blue-50 hover:bg-blue-100 rounded-sm border border-blue-200 transition-colors"
            title="Hitung ulang nomor urut otomatis berikutnya"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nomor Berikutnya</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <Input
            label="Tipe Dokumen"
            value={invoice.documentType}
            onChange={(e) =>
              updateInvoiceMetadata({
                documentType: e.target.value as "PROFORMA INVOICE" | "COMMERCIAL INVOICE",
              })
            }
          />
        </div>
        <div>
          <Input
            label="Tanggal Terbit (Date)"
            type="date"
            value={invoice.issueDate}
            onChange={(e) => updateInvoiceMetadata({ issueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-apple-ink mb-1">
            Mata Uang (Currency)
          </label>
          <div className="flex rounded-md border border-apple-hairline overflow-hidden p-0.5 bg-apple-parchment/60">
            <button
              type="button"
              onClick={() => setCurrencyAndSync("IDR")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                (invoice.currency || "IDR") === "IDR"
                  ? "bg-white text-apple-blue shadow-xs"
                  : "text-apple-ink-muted hover:text-apple-ink"
              }`}
            >
              IDR (Rp)
            </button>
            <button
              type="button"
              onClick={() => setCurrencyAndSync("USD")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                invoice.currency === "USD"
                  ? "bg-white text-apple-blue shadow-xs"
                  : "text-apple-ink-muted hover:text-apple-ink"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Negara Asal (Origin)"
          value={invoice.countryOfOrigin}
          onChange={(e) => updateInvoiceMetadata({ countryOfOrigin: e.target.value })}
          placeholder="Indonesia"
        />
        <Input
          label="Tujuan (Destination)"
          value={invoice.countryOfDestination}
          onChange={(e) => updateInvoiceMetadata({ countryOfDestination: e.target.value })}
          placeholder="Indonesia, Jakarta"
        />
      </div>

      <div className="border-t border-apple-divider pt-4 space-y-3">
        <h4 className="text-xs font-bold text-apple-ink uppercase tracking-wider">
          Pihak Pembeli / Consignee
        </h4>

        <Input
          label="Nama Perusahaan / Klien"
          value={invoice.consignee.companyName}
          onChange={(e) => updateConsignee({ companyName: e.target.value })}
          placeholder="PT KAFE BATAVIA FATAHILLAH"
        />

        <Input
          label="Alamat Pengiriman (Street Address)"
          value={invoice.consignee.streetAddress}
          onChange={(e) => updateConsignee({ streetAddress: e.target.value })}
          placeholder="Cafe Batavia Jl. Kali Besar Timur 4 No.14..."
        />

        <Input
          label="Kota / Wilayah & Kode Pos"
          value={invoice.consignee.cityRegion}
          onChange={(e) => updateConsignee({ cityRegion: e.target.value })}
          placeholder="Kec. Taman Sari, Jakarta Barat 11110"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Nomor Telepon / Kontak"
            value={invoice.consignee.phone}
            onChange={(e) => updateConsignee({ phone: e.target.value })}
            placeholder="085156062423"
          />
          <Input
            label="Negara / Lokasi Klien"
            value={invoice.consignee.country}
            onChange={(e) => updateConsignee({ country: e.target.value })}
            placeholder="Indonesia, Jakarta"
          />
        </div>
      </div>
    </div>
  );
};
