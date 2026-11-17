import { describe, expect, it } from "bun:test";
import { InvoiceItem, ProductMaster } from "../src/models/types";
import { syncItemsToCurrency } from "../src/services/currencySync";

describe("Catalog Currency Price Synchronization", () => {
  const catalog: ProductMaster[] = [
    {
      id: "prod-1",
      code: "ST - 020",
      description: "Serving Plate Capiz Shell",
      colour: "Natural",
      priceIdr: 18000,
      priceUsd: 1.2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-2",
      code: "ST - 016",
      description: "Coaster Capiz Shell",
      colour: "Combine",
      priceIdr: 9000,
      priceUsd: 0.6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const items: InvoiceItem[] = [
    {
      id: "it-1",
      sequenceNo: 1,
      productCode: "ST - 020",
      description: "Serving Plate",
      colour: "Natural",
      unitPrice: 18000,
      quantity: 2,
      totalPrice: 36000,
      photoUrl: null,
    },
    {
      id: "it-2",
      sequenceNo: 2,
      productCode: "CUSTOM-01",
      description: "Custom Item without catalog entry",
      colour: "Natural",
      unitPrice: 30000,
      quantity: 1,
      totalPrice: 30000,
      photoUrl: null,
    },
  ];

  it("should synchronize catalog items to USD prices when switching to USD", () => {
    const synced = syncItemsToCurrency(items, "USD", catalog);

    // Matched item
    expect(synced[0].unitPrice).toBe(1.2);
    expect(synced[0].totalPrice).toBe(2.4);

    // Fallback item (30000 / 15000 = 2)
    expect(synced[1].unitPrice).toBe(2);
    expect(synced[1].totalPrice).toBe(2);
  });

  it("should synchronize catalog items to IDR prices when switching back to IDR", () => {
    const usdItems: InvoiceItem[] = [
      {
        ...items[0],
        unitPrice: 1.2,
        totalPrice: 2.4,
      },
      {
        ...items[1],
        unitPrice: 2.0,
        totalPrice: 2.0,
      },
    ];

    const synced = syncItemsToCurrency(usdItems, "IDR", catalog);

    expect(synced[0].unitPrice).toBe(18000);
    expect(synced[0].totalPrice).toBe(36000);

    // Fallback item (2 * 15000 = 30000)
    expect(synced[1].unitPrice).toBe(30000);
    expect(synced[1].totalPrice).toBe(30000);
  });
});
