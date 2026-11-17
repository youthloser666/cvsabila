import React, { useState } from "react";
import { FileText, Package, Landmark } from "lucide-react";
import { useInvoiceStore } from "../../hooks/useInvoiceStore";
import { ConsigneeForm } from "./ConsigneeForm";
import { ItemsTableForm } from "./ItemsTableForm";
import { TermsBankingForm } from "./TermsBankingForm";

type ActiveTab = "doc" | "items" | "banking";

export const InvoiceEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("doc");
  const { invoice } = useInvoiceStore();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "doc", label: "Pengiriman & Klien", icon: <FileText className="w-4 h-4" /> },
    { id: "items", label: `Produk (${invoice.items.length})`, icon: <Package className="w-4 h-4" /> },
    { id: "banking", label: "Bank & Ketentuan", icon: <Landmark className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-apple-hairline rounded-lg shadow-sm overflow-hidden">
      {/* Editor Tabs Navigation */}
      <div className="flex border-b border-apple-divider bg-apple-parchment/70 px-2 pt-2 gap-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? "bg-white text-apple-blue border-apple-blue shadow-sm"
                : "text-apple-ink-muted hover:text-apple-ink border-transparent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeTab === "doc" && <ConsigneeForm />}
        {activeTab === "items" && <ItemsTableForm />}
        {activeTab === "banking" && <TermsBankingForm />}
      </div>

      {/* Real-time Summary Footer */}
      <div className="border-t border-apple-divider bg-apple-pearl px-5 py-3 flex items-center justify-between shrink-0">
        <div className="text-xs text-apple-ink-muted">
          Total Kuantitas:{" "}
          <span className="font-bold text-apple-ink">{invoice.totalQuantity} pcs</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-apple-ink-muted block">
            Grand Total Akhir
          </span>
          <span className="text-base font-bold text-apple-blue">
            Rp {invoice.grandTotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
};
