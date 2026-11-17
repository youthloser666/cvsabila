import { describe, expect, it } from "bun:test";
import { DEFAULT_COMPANY_PROFILE } from "../src/assets/svk-logo";
import { companyProfileSchema, invoiceItemSchema, invoiceSchema } from "../src/models/schemas";

describe("Zod Schema & Constraint Validation", () => {
  it("should validate default CV. Sabila company profile", () => {
    const parsed = companyProfileSchema.safeParse(DEFAULT_COMPANY_PROFILE);
    expect(parsed.success).toBe(true);
  });

  it("should reject invoice item with negative price or zero quantity", () => {
    const invalidItem = {
      id: "item-1",
      sequenceNo: 1,
      productCode: "TEST-01",
      description: "Invalid item",
      colour: "Natural",
      unitPrice: -500,
      quantity: 0,
      totalPrice: 0,
    };

    const parsed = invoiceItemSchema.safeParse(invalidItem);
    expect(parsed.success).toBe(false);
  });

  it("should validate valid invoice item with dimensions", () => {
    const validItem = {
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
    };

    const parsed = invoiceItemSchema.safeParse(validItem);
    expect(parsed.success).toBe(true);
  });

  it("should validate complete invoice matching PI026SMK291026.pdf", () => {
    const fullInvoice = {
      id: "inv-001",
      invoiceNumber: "026/PI/SMK-SL-V/2026",
      documentType: "PROFORMA INVOICE",
      issueDate: "2026-10-26",
      countryOfOrigin: "Indonesia",
      countryOfDestination: "Indonesia, Jakarta",
      shipper: DEFAULT_COMPANY_PROFILE,
      consignee: {
        id: "c-1",
        companyName: "PT KAFE BATAVIA FATAHILLAH",
        streetAddress: "Cafe Batavia Jl. Kali Besar Timur 4 No.14, RT.7/RW.6, Pinangsia",
        cityRegion: "Kec. Taman Sari, Kota Jakarta Barat, DKI Jakarta 11110",
        phone: "085156062423",
        country: "Indonesia, Jakarta",
      },
      items: [
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
        },
      ],
      additionalCharges: [{ id: "ac-1", description: "Ongkos Kirim", amount: 23000 }],
      totalQuantity: 1,
      subtotal: 18000,
      grandTotal: 41000,
      currency: "IDR",
      paymentTerms: DEFAULT_COMPANY_PROFILE.defaultTerms,
      bankName: DEFAULT_COMPANY_PROFILE.defaultBankName,
      bankAccountNo: DEFAULT_COMPANY_PROFILE.defaultBankAccount,
      bankAccountName: DEFAULT_COMPANY_PROFILE.defaultAccountName,
      shipperSigner: DEFAULT_COMPANY_PROFILE.authorizedSigner,
      buyerSigner: "PT.KAFE BATAVIA FATAHILLAH",
      pageOrientation: "portrait",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const parsed = invoiceSchema.safeParse(fullInvoice);
    expect(parsed.success).toBe(true);
  });
});
