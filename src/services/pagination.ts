import {
  InvoiceItem,
  InvoicePageSegment,
  PageOrientation,
  PaginationConfig,
} from "../models/types";

export const LANDSCAPE_PAGINATION: PaginationConfig = {
  maxItemsFirstPage: 7,
  maxItemsMiddlePage: 12,
  maxItemsLastPageWithFooter: 6,
};

export const PORTRAIT_PAGINATION: PaginationConfig = {
  maxItemsFirstPage: 12,
  maxItemsMiddlePage: 18,
  maxItemsLastPageWithFooter: 10,
};

export function splitInvoicePages(
  items: InvoiceItem[],
  orientation: PageOrientation
): InvoicePageSegment[] {
  const config =
    orientation === "landscape" ? LANDSCAPE_PAGINATION : PORTRAIT_PAGINATION;

  // Single page document
  if (items.length <= config.maxItemsFirstPage) {
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        isFirstPage: true,
        isLastPage: true,
        items,
        startIndex: 0,
        showMainHeader: true,
        showShipperConsignee: true,
        showTotalsAndSignatures: true,
      },
    ];
  }

  // Multi-page document
  const pages: InvoicePageSegment[] = [];
  let remaining = [...items];
  let currentOffset = 0;

  // Page 1: Main Header + Shipper & Consignee + First Item Batch
  const firstBatch = remaining.slice(0, config.maxItemsFirstPage);
  remaining = remaining.slice(config.maxItemsFirstPage);

  pages.push({
    pageNumber: 1,
    totalPages: 1, // patched at end
    isFirstPage: true,
    isLastPage: false,
    items: firstBatch,
    startIndex: currentOffset,
    showMainHeader: true,
    showShipperConsignee: true,
    showTotalsAndSignatures: false,
  });
  currentOffset += firstBatch.length;

  // Subsequent pages
  while (remaining.length > 0) {
    // If remaining items can fit on the final page together with the footer
    if (remaining.length <= config.maxItemsLastPageWithFooter) {
      pages.push({
        pageNumber: pages.length + 1,
        totalPages: 1,
        isFirstPage: false,
        isLastPage: true,
        items: remaining,
        startIndex: currentOffset,
        showMainHeader: false,
        showShipperConsignee: false,
        showTotalsAndSignatures: true,
      });
      currentOffset += remaining.length;
      remaining = [];
    } else {
      // Middle page or continuation page with up to maxItemsMiddlePage
      const batchSize = Math.min(remaining.length, config.maxItemsMiddlePage);
      const batch = remaining.slice(0, batchSize);
      remaining = remaining.slice(batchSize);

      const hasMore = remaining.length > 0;
      pages.push({
        pageNumber: pages.length + 1,
        totalPages: 1,
        isFirstPage: false,
        isLastPage: !hasMore,
        items: batch,
        startIndex: currentOffset,
        showMainHeader: false,
        showShipperConsignee: false,
        showTotalsAndSignatures: !hasMore,
      });
      currentOffset += batch.length;
    }
  }

  const total = pages.length;
  return pages.map((p) => ({ ...p, totalPages: total }));
}
