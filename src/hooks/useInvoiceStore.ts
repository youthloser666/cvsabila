import { create } from "zustand";
import { DEFAULT_COMPANY_PROFILE } from "../assets/svk-logo";
import {
  calculateGrandTotal,
  calculateLineTotal,
  calculateSubtotal,
  calculateTotalQuantity,
  generateNextInvoiceNumber,
} from "../models/schemas";
import {
  AdditionalCharge,
  CompanyProfile,
  Consignee,
  DocumentType,
  Invoice,
  InvoiceItem,
  InvoiceTemplate,
  PageOrientation,
} from "../models/types";
import {
  deleteInvoiceFromHistory,
  loadInvoicesFromStorage,
  loadProfileFromStorage,
  saveInvoiceToHistory,
  saveProfileToStorage,
} from "../services/storage";
import { syncItemsToCurrency } from "../services/currencySync";
import { useProductStore } from "./useProductStore";

export const SAMPLE_INVOICE_ITEMS: InvoiceItem[] = [
  {
    id: "item-1",
    sequenceNo: 1,
    productCode: "ST - 020",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    unitPrice: 18000,
    dimDia: null,
    dimL: 14.0,
    dimW: 14.0,
    dimH: 1.5,
    quantity: 1,
    totalPrice: 18000,
    photoUrl: null,
  },
  {
    id: "item-2",
    sequenceNo: 2,
    productCode: "ST - 016",
    description: "Coaster Capiz Shell",
    colour: "Combine",
    unitPrice: 9000,
    dimDia: null,
    dimL: 10.0,
    dimW: 10.0,
    dimH: 1.0,
    quantity: 1,
    totalPrice: 9000,
    photoUrl: null,
  },
  {
    id: "item-3",
    sequenceNo: 3,
    productCode: "SC - 004",
    description: "Coaster Capiz Shell",
    colour: "Combine",
    unitPrice: 8500,
    dimDia: null,
    dimL: 10.0,
    dimW: 10.0,
    dimH: 1.0,
    quantity: 1,
    totalPrice: 8500,
    photoUrl: null,
  },
  {
    id: "item-4",
    sequenceNo: 4,
    productCode: "SC - 004",
    description: "Coaster Capiz Shell",
    colour: "Combine",
    unitPrice: 8500,
    dimDia: null,
    dimL: 10.0,
    dimW: 10.0,
    dimH: 1.0,
    quantity: 1,
    totalPrice: 8500,
    photoUrl: null,
  },
  {
    id: "item-5",
    sequenceNo: 5,
    productCode: "SC - 004",
    description: "Bowl Capiz Shell",
    colour: "Combine",
    unitPrice: 25000,
    dimDia: null,
    dimL: 15.0,
    dimW: 15.0,
    dimH: 3.5,
    quantity: 1,
    totalPrice: 25000,
    photoUrl: null,
  },
  {
    id: "item-6",
    sequenceNo: 6,
    productCode: "ST - 005",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    unitPrice: 20000,
    dimDia: null,
    dimL: 10.0,
    dimW: 18.0,
    dimH: 3.0,
    quantity: 1,
    totalPrice: 20000,
    photoUrl: null,
  },
  {
    id: "item-7",
    sequenceNo: 7,
    productCode: "ST - 023",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    unitPrice: 20000,
    dimDia: null,
    dimL: 12.0,
    dimW: 20.0,
    dimH: 1.5,
    quantity: 1,
    totalPrice: 20000,
    photoUrl: null,
  },
  {
    id: "item-8",
    sequenceNo: 8,
    productCode: "ST - 021",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    unitPrice: 15000,
    dimDia: null,
    dimL: 8.3,
    dimW: 11.0,
    dimH: 2.2,
    quantity: 1,
    totalPrice: 15000,
    photoUrl: null,
  },
];

export const SAMPLE_CONSIGNEE: Consignee = {
  id: "consignee-sample",
  companyName: "PT KAFE BATAVIA FATAHILLAH",
  contactPerson: "Purchasing Manager",
  streetAddress:
    "Cafe Batavia Jl. Kali Besar Timur 4 No.14, RT.7/RW.6, Pinangsia",
  cityRegion:
    "Kec. Taman Sari, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11110",
  phone: "085156062423",
  country: "Indonesia, Jakarta",
};

export function createSampleInvoice(profile: CompanyProfile, invoiceNumber = "026/PI/SMK-SL-V/2026"): Invoice {
  const items = [...SAMPLE_INVOICE_ITEMS];
  const additionalCharges: AdditionalCharge[] = [
    { id: "charge-1", description: "Ongkos Kirim", amount: 23000 },
  ];
  const subtotal = calculateSubtotal(items);
  const totalQuantity = calculateTotalQuantity(items);
  const grandTotal = calculateGrandTotal(subtotal, additionalCharges);

  return {
    id: "inv-" + Date.now(),
    invoiceNumber,
    documentType: "PROFORMA INVOICE",
    issueDate: "2026-10-26",
    countryOfOrigin: "Indonesia",
    countryOfDestination: "Indonesia, Jakarta",
    shipper: profile,
    consignee: SAMPLE_CONSIGNEE,
    items,
    additionalCharges,
    totalQuantity,
    subtotal,
    grandTotal,
    currency: "IDR",
    paymentTerms: [...profile.defaultTerms],
    bankName: profile.defaultBankName,
    bankAccountNo: profile.defaultBankAccount,
    bankAccountName: profile.defaultAccountName,
    shipperSigner: profile.authorizedSigner,
    buyerSigner: "PT.KAFE BATAVIA FATAHILLAH",
    shipperSignatureUrl: profile.defaultSignature || null,
    pageOrientation: "portrait",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createDefaultInvoice(profile: CompanyProfile, invoiceNumber = "026/PI/SMK-SL-V/2026"): Invoice {
  return {
    id: "inv-" + Date.now(),
    invoiceNumber,
    documentType: "PROFORMA INVOICE",
    issueDate: new Date().toISOString().split("T")[0],
    countryOfOrigin: "Indonesia",
    countryOfDestination: "",
    shipper: profile,
    consignee: {
      id: "consignee-" + Date.now(),
      companyName: "",
      contactPerson: "",
      streetAddress: "",
      cityRegion: "",
      phone: "",
      country: "",
    },
    items: [],
    additionalCharges: [],
    totalQuantity: 0,
    subtotal: 0,
    grandTotal: 0,
    currency: "IDR",
    paymentTerms: [...profile.defaultTerms],
    bankName: profile.defaultBankName,
    bankAccountNo: profile.defaultBankAccount,
    bankAccountName: profile.defaultAccountName,
    shipperSigner: profile.authorizedSigner,
    buyerSigner: "",
    shipperSignatureUrl: profile.defaultSignature || null,
    pageOrientation: "portrait",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface InvoiceStore {
  profile: CompanyProfile;
  invoice: Invoice;
  zoom: number;

  setZoom: (zoom: number) => void;
  setOrientation: (orientation: PageOrientation) => void;
  updateProfile: (profile: Partial<CompanyProfile>) => void;
  updateInvoiceMetadata: (data: {
    invoiceNumber?: string;
    documentType?: DocumentType;
    issueDate?: string;
    countryOfOrigin?: string;
    countryOfDestination?: string;
    currency?: string;
  }) => void;
  updateConsignee: (consignee: Partial<Consignee>) => void;
  addItem: (item: Omit<InvoiceItem, "id" | "sequenceNo" | "totalPrice">) => void;
  updateItem: (id: string, item: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  addCharge: (charge: { description: string; amount: number }) => void;
  updateCharge: (id: string, charge: Partial<AdditionalCharge>) => void;
  removeCharge: (id: string) => void;
  updateTermsAndBanking: (data: {
    paymentTerms?: string[];
    bankName?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
    shipperSigner?: string;
    buyerSigner?: string;
    shipperSignatureUrl?: string | null;
  }) => void;
  setSellerSignature: (url: string | null) => void;

  // Currency & Sync
  setCurrencyAndSync: (currency: "IDR" | "USD") => void;

  // History & Templates Actions
  createNewInvoice: () => void;
  loadInvoice: (invoice: Invoice) => void;
  duplicateInvoice: (source: Invoice) => void;
  deleteInvoice: (id: string) => void;
  applyTemplate: (template: InvoiceTemplate) => void;
  resetToSample: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => {
  const initialProfile = loadProfileFromStorage() || DEFAULT_COMPANY_PROFILE;
  const storedInvoices = loadInvoicesFromStorage();
  const initialInvoice =
    storedInvoices.length > 0 ? storedInvoices[0] : createDefaultInvoice(initialProfile);

  const recompute = (invoice: Invoice): Invoice => {
    const updatedItems = invoice.items.map((item, index) => ({
      ...item,
      sequenceNo: index + 1,
      totalPrice: calculateLineTotal(item.unitPrice, item.quantity),
    }));
    const subtotal = calculateSubtotal(updatedItems);
    const totalQuantity = calculateTotalQuantity(updatedItems);
    const grandTotal = calculateGrandTotal(subtotal, invoice.additionalCharges);

    const updated = {
      ...invoice,
      items: updatedItems,
      subtotal,
      totalQuantity,
      grandTotal,
      updatedAt: new Date().toISOString(),
    };
    saveInvoiceToHistory(updated);
    return updated;
  };

  return {
    profile: initialProfile,
    invoice: initialInvoice,
    zoom: 1.0,

    setZoom: (zoom: number) => set({ zoom: Math.min(Math.max(zoom, 0.4), 2.0) }),

    setOrientation: (pageOrientation: PageOrientation) => {
      set((state) => ({
        invoice: { ...state.invoice, pageOrientation },
      }));
    },

    updateProfile: (updatedFields: Partial<CompanyProfile>) => {
      set((state) => {
        const newProfile = { ...state.profile, ...updatedFields };
        saveProfileToStorage(newProfile);
        return {
          profile: newProfile,
          invoice: { ...state.invoice, shipper: newProfile },
        };
      });
    },

    updateInvoiceMetadata: (meta) => {
      set((state) => ({
        invoice: { ...state.invoice, ...meta },
      }));
    },

    updateConsignee: (consigneeData) => {
      set((state) => ({
        invoice: {
          ...state.invoice,
          consignee: { ...state.invoice.consignee, ...consigneeData },
        },
      }));
    },

    addItem: (itemData) => {
      set((state) => {
        const newItem: InvoiceItem = {
          ...itemData,
          id: "item-" + Date.now(),
          sequenceNo: state.invoice.items.length + 1,
          totalPrice: calculateLineTotal(itemData.unitPrice, itemData.quantity),
        };
        const updatedInvoice = {
          ...state.invoice,
          items: [...state.invoice.items, newItem],
        };
        return { invoice: recompute(updatedInvoice) };
      });
    },

    updateItem: (id, itemData) => {
      set((state) => {
        const updatedItems = state.invoice.items.map((it) =>
          it.id === id ? { ...it, ...itemData } : it
        );
        return { invoice: recompute({ ...state.invoice, items: updatedItems }) };
      });
    },

    removeItem: (id) => {
      set((state) => {
        const filtered = state.invoice.items.filter((it) => it.id !== id);
        return { invoice: recompute({ ...state.invoice, items: filtered }) };
      });
    },

    addCharge: (charge) => {
      set((state) => {
        const newCharge: AdditionalCharge = {
          id: "charge-" + Date.now(),
          ...charge,
        };
        return {
          invoice: recompute({
            ...state.invoice,
            additionalCharges: [...state.invoice.additionalCharges, newCharge],
          }),
        };
      });
    },

    updateCharge: (id, chargeData) => {
      set((state) => {
        const updated = state.invoice.additionalCharges.map((ch) =>
          ch.id === id ? { ...ch, ...chargeData } : ch
        );
        return {
          invoice: recompute({
            ...state.invoice,
            additionalCharges: updated,
          }),
        };
      });
    },

    removeCharge: (id) => {
      set((state) => {
        const filtered = state.invoice.additionalCharges.filter((ch) => ch.id !== id);
        return {
          invoice: recompute({
            ...state.invoice,
            additionalCharges: filtered,
          }),
        };
      });
    },

    updateTermsAndBanking: (data) => {
      set((state) => ({
        invoice: { ...state.invoice, ...data },
      }));
    },

    setSellerSignature: (url) => {
      set((state) => ({
        invoice: { ...state.invoice, shipperSignatureUrl: url },
      }));
    },

    createNewInvoice: () => {
      const history = loadInvoicesFromStorage();
      const existingNumbers = history.map((inv) => inv.invoiceNumber);
      const nextNumber = generateNextInvoiceNumber(existingNumbers);
      const fresh = createDefaultInvoice(get().profile, nextNumber);
      fresh.issueDate = new Date().toISOString().split("T")[0];
      set({ invoice: recompute(fresh) });
    },

    loadInvoice: (selectedInvoice) => {
      set({ invoice: selectedInvoice });
    },

    duplicateInvoice: (source) => {
      const history = loadInvoicesFromStorage();
      const existingNumbers = history.map((inv) => inv.invoiceNumber);
      const nextNumber = generateNextInvoiceNumber(existingNumbers);
      const duplicated: Invoice = {
        ...source,
        id: "inv-" + Date.now(),
        invoiceNumber: nextNumber,
        issueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ invoice: recompute(duplicated) });
    },

    deleteInvoice: (id) => {
      deleteInvoiceFromHistory(id);
      const history = loadInvoicesFromStorage();
      if (history.length > 0) {
        set({ invoice: history[0] });
      } else {
        get().createNewInvoice();
      }
    },

    applyTemplate: (template) => {
      set((state) => {
        const updatedInvoice: Invoice = {
          ...state.invoice,
          consignee: { ...template.consignee, id: "consignee-" + Date.now() },
          items: template.items.map((it) => ({ ...it, id: "item-" + Math.random() })),
          additionalCharges: template.additionalCharges.map((c) => ({
            ...c,
            id: "charge-" + Math.random(),
          })),
          paymentTerms: [...template.paymentTerms],
        };
        return { invoice: recompute(updatedInvoice) };
      });
    },

    setCurrencyAndSync: (newCurrency: "IDR" | "USD") => {
      set((state) => {
        const catalog = useProductStore.getState().products;
        const syncedItems = syncItemsToCurrency(state.invoice.items, newCurrency, catalog);
        const updatedInvoice = {
          ...state.invoice,
          currency: newCurrency,
          items: syncedItems,
        };
        return { invoice: recompute(updatedInvoice) };
      });
    },

    resetToSample: () => {
      const fresh = createSampleInvoice(get().profile);
      set({ invoice: recompute(fresh) });
    },
  };
});
