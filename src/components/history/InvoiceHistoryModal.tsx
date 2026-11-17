import React, { useState, useEffect } from "react";
import { Search, FolderOpen, Copy, Trash2, Calendar, User, Package } from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { loadInvoicesFromStorage } from "../../services/storage";
import { Invoice } from "../../models/types";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({ isOpen, onClose }) => {
  const { loadInvoice, duplicateInvoice, deleteInvoice } = useInvoiceStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshList = () => {
    setInvoices(loadInvoicesFromStorage());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.consignee.companyName.toLowerCase().includes(q)
    );
  });

  const handleOpen = (inv: Invoice) => {
    loadInvoice(inv);
    onClose();
  };

  const handleDuplicate = (inv: Invoice) => {
    duplicateInvoice(inv);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus arsip invoice ini?")) {
      deleteInvoice(id);
      refreshList();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Riwayat Pembuatan Invoice" maxWidth="2xl">
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-apple-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor invoice atau nama pemesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-apple-parchment/60 border border-apple-hairline rounded-md pl-9 pr-4 py-2 text-sm text-apple-ink placeholder:text-apple-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-apple-blue"
          />
        </div>

        {/* Invoice list */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center text-apple-ink-muted text-sm">
              Tidak ada arsip invoice yang ditemukan.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 bg-white border border-apple-hairline rounded-md hover:border-apple-blue/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-apple-ink tracking-tight">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-blue-50 text-apple-blue border border-blue-200">
                      {inv.pageOrientation}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-apple-ink-muted">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {inv.consignee.companyName || "Tanpa Nama Klien"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {inv.issueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {inv.items.length} item ({inv.totalQuantity} pcs)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-apple-ink-muted block">
                      Total Nilai
                    </span>
                    <span className="text-sm font-bold text-apple-blue">
                      Rp {inv.grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<FolderOpen className="w-3 h-3" />}
                      onClick={() => handleOpen(inv)}
                      title="Buka invoice ke editor"
                    >
                      Buka
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Copy className="w-3 h-3" />}
                      onClick={() => handleDuplicate(inv)}
                      title="Duplikat sebagai invoice baru dengan nomor urut berikutnya"
                    >
                      Duplikat
                    </Button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
