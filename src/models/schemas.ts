import { z } from "zod";

export const companyProfileSchema = z.object({
  id: z.string(),
  companyName: z.string().min(2, "Nama perusahaan wajib diisi"),
  tagline: z.string().optional(),
  logoDataUrl: z.string().optional(),
  address: z.string().min(3, "Alamat wajib diisi"),
  cityRegion: z.string().min(2, "Kota / Wilayah wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(6, "Nomor telepon wajib diisi"),
  defaultBankName: z.string().min(2, "Nama bank wajib diisi"),
  defaultBankAccount: z.string().min(4, "Nomor rekening wajib diisi"),
  defaultAccountName: z.string().min(2, "Atas nama rekening wajib diisi"),
  defaultTerms: z.array(z.string()),
  defaultSignature: z.string().optional(),
  authorizedSigner: z.string().min(2, "Nama penandatangan wajib diisi"),
});

export const consigneeSchema = z.object({
  id: z.string(),
  companyName: z.string().min(2, "Nama pemesan/klien wajib diisi"),
  contactPerson: z.string().optional(),
  streetAddress: z.string().min(3, "Alamat pengiriman wajib diisi"),
  cityRegion: z.string().min(2, "Kota / Daerah pengiriman wajib diisi"),
  phone: z.string().min(5, "Nomor kontak wajib diisi"),
  country: z.string().min(2, "Negara tujuan wajib diisi"),
});

export const invoiceItemSchema = z.object({
  id: z.string(),
  sequenceNo: z.number().int().min(1),
  productCode: z.string().min(1, "Kode produk wajib diisi"),
  photoUrl: z.string().nullable().optional(),
  description: z.string().min(1, "Deskripsi produk wajib diisi"),
  colour: z.string().min(1, "Warna/finishing wajib diisi"),
  unitPrice: z.number().min(0, "Harga satuan minimal 0"),
  dimDia: z.number().positive().nullable().optional(),
  dimL: z.number().positive().nullable().optional(),
  dimW: z.number().positive().nullable().optional(),
  dimH: z.number().positive().nullable().optional(),
  quantity: z.number().int().min(1, "Jumlah minimal 1"),
  totalPrice: z.number().min(0),
});

export const additionalChargeSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Keterangan biaya wajib diisi"),
  amount: z.number().min(0, "Nominal biaya minimal 0"),
});

export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string().min(1, "Nomor invoice wajib diisi"),
  documentType: z.enum(["PROFORMA INVOICE", "COMMERCIAL INVOICE"]),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  countryOfOrigin: z.string().min(2),
  countryOfDestination: z.string().min(2),
  shipper: companyProfileSchema,
  consignee: consigneeSchema,
  items: z.array(invoiceItemSchema),
  additionalCharges: z.array(additionalChargeSchema),
  totalQuantity: z.number().int().min(0),
  subtotal: z.number().min(0),
  grandTotal: z.number().min(0),
  currency: z.string().default("IDR"),
  paymentTerms: z.array(z.string()),
  bankName: z.string().min(2),
  bankAccountNo: z.string().min(4),
  bankAccountName: z.string().min(2),
  shipperSigner: z.string().min(2),
  buyerSigner: z.string().min(2),
  shipperSignatureUrl: z.string().nullable().optional(),
  pageOrientation: z.enum(["portrait", "landscape"]),
  status: z.enum(["draft", "finalized"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const invoiceTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nama template wajib diisi"),
  description: z.string().optional(),
  consignee: consigneeSchema,
  items: z.array(invoiceItemSchema),
  additionalCharges: z.array(additionalChargeSchema),
  paymentTerms: z.array(z.string()),
  createdAt: z.string(),
});

export const productMasterSchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Kode produk wajib diisi"),
  photoUrl: z.string().nullable().optional(),
  description: z.string().min(1, "Deskripsi produk wajib diisi"),
  colour: z.string().min(1, "Warna/finishing wajib diisi"),
  dimDia: z.number().positive().nullable().optional(),
  dimL: z.number().positive().nullable().optional(),
  dimW: z.number().positive().nullable().optional(),
  dimH: z.number().positive().nullable().optional(),
  priceIdr: z.number().min(0, "Harga IDR minimal 0"),
  priceUsd: z.number().min(0, "Harga USD minimal 0").nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const catalogMemorySchema = z.object({
  version: z.string().default("1.0.0"),
  exportedAt: z.string(),
  companyName: z.string().min(1),
  totalProducts: z.number().int().min(0),
  products: z.array(productMasterSchema),
});

// Helper math calculations
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return Math.round(unitPrice * quantity);
}

export function calculateSubtotal(items: { totalPrice: number }[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateTotalQuantity(items: { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateGrandTotal(
  subtotal: number,
  additionalCharges: { amount: number }[]
): number {
  const chargesTotal = additionalCharges.reduce((sum, c) => sum + c.amount, 0);
  return subtotal + chargesTotal;
}

// Auto-numbering helper
export function generateNextInvoiceNumber(
  existingNumbers: string[],
  fallbackYear = "2026"
): string {
  const defaultSuffix = `/PI/SMK-SL-V/${fallbackYear}`;
  if (!existingNumbers || existingNumbers.length === 0) {
    return `026${defaultSuffix}`;
  }

  let maxSeq = 25; // Base starting point so the first default is 026
  let matchedSuffix = defaultSuffix;

  for (const num of existingNumbers) {
    const match = num.match(/^(\d+)\/(.*)$/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > maxSeq) {
        maxSeq = val;
        matchedSuffix = `/${match[2]}`;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  return `${String(nextSeq).padStart(3, "0")}${matchedSuffix}`;
}
