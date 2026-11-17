export type PageOrientation = "portrait" | "landscape";
export type DocumentStatus = "draft" | "finalized";
export type DocumentType = "PROFORMA INVOICE" | "COMMERCIAL INVOICE";
export type Currency = "IDR" | "USD";

export interface CompanyProfile {
  id: string;
  companyName: string;
  tagline?: string;
  logoDataUrl?: string;
  address: string;
  cityRegion: string;
  email: string;
  phone: string;
  defaultBankName: string;
  defaultBankAccount: string;
  defaultAccountName: string;
  defaultTerms: string[];
  defaultSignature?: string;
  authorizedSigner: string;
}

export interface Consignee {
  id: string;
  companyName: string;
  contactPerson?: string;
  streetAddress: string;
  cityRegion: string;
  phone: string;
  country: string;
}

export interface InvoiceItem {
  id: string;
  sequenceNo: number;
  productCode: string;
  photoUrl?: string | null;
  description: string;
  colour: string;
  unitPrice: number;
  dimDia?: number | null;
  dimL?: number | null;
  dimW?: number | null;
  dimH?: number | null;
  quantity: number;
  totalPrice: number;
}

export interface AdditionalCharge {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  documentType: DocumentType;
  issueDate: string; // YYYY-MM-DD
  countryOfOrigin: string;
  countryOfDestination: string;
  shipper: CompanyProfile;
  consignee: Consignee;
  items: InvoiceItem[];
  additionalCharges: AdditionalCharge[];
  totalQuantity: number;
  subtotal: number;
  grandTotal: number;
  currency: string;
  paymentTerms: string[];
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  shipperSigner: string;
  buyerSigner: string;
  shipperSignatureUrl?: string | null;
  pageOrientation: PageOrientation;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  consignee: Consignee;
  items: InvoiceItem[];
  additionalCharges: AdditionalCharge[];
  paymentTerms: string[];
  createdAt: string;
}

export interface ProductMaster {
  id: string;
  code: string;
  photoUrl?: string | null;
  description: string;
  colour: string;
  dimDia?: number | null;
  dimL?: number | null;
  dimW?: number | null;
  dimH?: number | null;
  priceIdr: number;
  priceUsd?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogMemoryContainer {
  version: string;
  exportedAt: string;
  companyName: string;
  totalProducts: number;
  products: ProductMaster[];
}

export interface InvoicePageSegment {
  pageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  items: InvoiceItem[];
  startIndex: number;
  showMainHeader: boolean;
  showShipperConsignee: boolean;
  showTotalsAndSignatures: boolean;
}

export interface PaginationConfig {
  maxItemsFirstPage: number;
  maxItemsMiddlePage: number;
  maxItemsLastPageWithFooter: number;
}
