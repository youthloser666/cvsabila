import { CompanyProfile, Invoice, InvoiceTemplate } from "../models/types";

const SETTINGS_KEY = "cvsabila_settings";
const INVOICES_KEY = "cvsabila_invoices";
const TEMPLATES_KEY = "cvsabila_templates";

// Company Profile Persistence
export function saveProfileToStorage(profile: CompanyProfile): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save profile to storage:", err);
  }
}

export function loadProfileFromStorage(): CompanyProfile | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CompanyProfile;
  } catch (err) {
    console.error("Failed to load profile from storage:", err);
    return null;
  }
}

// Invoices Archive & History Persistence
export function saveInvoicesToStorage(invoices: Invoice[]): void {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error("Failed to save invoices to storage:", err);
  }
}

export function loadInvoicesFromStorage(): Invoice[] {
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Invoice[];
  } catch (err) {
    console.error("Failed to load invoices from storage:", err);
    return [];
  }
}

export function saveInvoiceToHistory(invoice: Invoice): void {
  try {
    const existing = loadInvoicesFromStorage();
    const index = existing.findIndex((inv) => inv.id === invoice.id);
    let updated: Invoice[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = invoice;
    } else {
      updated = [invoice, ...existing];
    }
    saveInvoicesToStorage(updated);
  } catch (err) {
    console.error("Failed to save invoice to history:", err);
  }
}

export function deleteInvoiceFromHistory(id: string): void {
  try {
    const existing = loadInvoicesFromStorage();
    const filtered = existing.filter((inv) => inv.id !== id);
    saveInvoicesToStorage(filtered);
  } catch (err) {
    console.error("Failed to delete invoice from history:", err);
  }
}

// Templates / Memory Persistence
export function saveTemplate(template: InvoiceTemplate): void {
  try {
    const existing = loadTemplates();
    const index = existing.findIndex((t) => t.id === template.id);
    let updated: InvoiceTemplate[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = template;
    } else {
      updated = [template, ...existing];
    }
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save template:", err);
  }
}

export function loadTemplates(): InvoiceTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InvoiceTemplate[];
  } catch (err) {
    console.error("Failed to load templates:", err);
    return [];
  }
}

export function deleteTemplate(id: string): void {
  try {
    const existing = loadTemplates();
    const filtered = existing.filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete template:", err);
  }
}
