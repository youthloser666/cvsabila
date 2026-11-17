import { describe, expect, it } from "bun:test";
import { InvoiceItem } from "../src/models/types";
import { splitInvoicePages } from "../src/services/pagination";

function createDummyItems(count: number): InvoiceItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    sequenceNo: i + 1,
    productCode: `ST-${String(i + 1).padStart(3, "0")}`,
    description: `Sample Artisan Item ${i + 1}`,
    colour: "Natural",
    unitPrice: 15000,
    dimDia: null,
    dimL: 10,
    dimW: 10,
    dimH: 1,
    quantity: 1,
    totalPrice: 15000,
    photoUrl: null,
  }));
}

describe("A4 Multi-Page Invoice Pagination Engine", () => {
  it("should keep a small invoice (4 items) on a single page", () => {
    const items = createDummyItems(4);
    const pages = splitInvoicePages(items, "landscape");

    expect(pages.length).toBe(1);
    expect(pages[0].pageNumber).toBe(1);
    expect(pages[0].totalPages).toBe(1);
    expect(pages[0].isFirstPage).toBe(true);
    expect(pages[0].isLastPage).toBe(true);
    expect(pages[0].showMainHeader).toBe(true);
    expect(pages[0].showShipperConsignee).toBe(true);
    expect(pages[0].showTotalsAndSignatures).toBe(true);
    expect(pages[0].items.length).toBe(4);
  });

  it("should split 18 items into multiple pages without squishing", () => {
    const items = createDummyItems(18);
    const pages = splitInvoicePages(items, "landscape");

    expect(pages.length).toBeGreaterThanOrEqual(2);
    expect(pages[0].pageNumber).toBe(1);
    expect(pages[0].isFirstPage).toBe(true);
    expect(pages[0].isLastPage).toBe(false);
    expect(pages[0].showMainHeader).toBe(true);
    expect(pages[0].showTotalsAndSignatures).toBe(false);

    // Final page must have totals & signatures
    const lastPage = pages[pages.length - 1];
    expect(lastPage.isLastPage).toBe(true);
    expect(lastPage.showTotalsAndSignatures).toBe(true);
    expect(lastPage.showMainHeader).toBe(false);

    // Total item count across all pages must equal 18
    const totalItemCount = pages.reduce((sum, p) => sum + p.items.length, 0);
    expect(totalItemCount).toBe(18);

    // Verify startIndex continuity
    let expectedStart = 0;
    for (const page of pages) {
      expect(page.startIndex).toBe(expectedStart);
      expectedStart += page.items.length;
    }
  });

  it("should handle portrait orientation with higher item capacity per page", () => {
    const items = createDummyItems(10);
    const pages = splitInvoicePages(items, "portrait");

    expect(pages.length).toBe(1);
    expect(pages[0].items.length).toBe(10);
    expect(pages[0].showTotalsAndSignatures).toBe(true);
  });
});
