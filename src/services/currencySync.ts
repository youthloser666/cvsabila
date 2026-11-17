import { InvoiceItem, ProductMaster } from "../models/types";

export function syncItemsToCurrency(
  items: InvoiceItem[],
  newCurrency: "IDR" | "USD",
  catalog: ProductMaster[],
  fallbackRate = 15000
): InvoiceItem[] {
  return items.map((item) => {
    const matched = catalog.find(
      (p) => p.code.trim().toUpperCase() === item.productCode.trim().toUpperCase()
    );

    let unitPrice = item.unitPrice;

    if (newCurrency === "USD") {
      if (matched && matched.priceUsd != null && matched.priceUsd > 0) {
        unitPrice = matched.priceUsd;
      } else {
        unitPrice = Number((item.unitPrice / fallbackRate).toFixed(2));
      }
    } else {
      if (matched && matched.priceIdr > 0) {
        unitPrice = matched.priceIdr;
      } else {
        unitPrice = Math.round(item.unitPrice * fallbackRate);
      }
    }

    const totalPrice = Math.round(unitPrice * item.quantity * 100) / 100;

    return {
      ...item,
      unitPrice,
      totalPrice,
    };
  });
}
