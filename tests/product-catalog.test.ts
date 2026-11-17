import { describe, expect, it } from "bun:test";
import { catalogMemorySchema, productMasterSchema } from "../src/models/schemas";
import { CatalogMemoryContainer, ProductMaster } from "../src/models/types";

describe("Product Master Catalog & Memory Validation", () => {
  const sampleProduct: ProductMaster = {
    id: "prod-st-020",
    code: "ST - 020",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    dimDia: null,
    dimL: 14.0,
    dimW: 14.0,
    dimH: 1.5,
    priceIdr: 18000,
    priceUsd: 1.2,
    photoUrl: null,
    createdAt: "2026-11-17T21:00:00Z",
    updatedAt: "2026-11-17T21:00:00Z",
  };

  it("should validate a complete product master with all 7 attributes", () => {
    const result = productMasterSchema.safeParse(sampleProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("ST - 020");
      expect(result.data.priceIdr).toBe(18000);
      expect(result.data.priceUsd).toBe(1.2);
      expect(result.data.dimL).toBe(14.0);
    }
  });

  it("should validate a product with diameter (Dia) instead of L/W", () => {
    const roundBowl: ProductMaster = {
      id: "prod-round-01",
      code: "RD - 100",
      description: "Round Capiz Bowl",
      colour: "Silver",
      dimDia: 20.0,
      dimL: null,
      dimW: null,
      dimH: 5.0,
      priceIdr: 35000,
      priceUsd: 2.3,
      photoUrl: "data:image/png;base64,samplephoto",
      createdAt: "2026-11-17T21:00:00Z",
      updatedAt: "2026-11-17T21:00:00Z",
    };
    const result = productMasterSchema.safeParse(roundBowl);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dimDia).toBe(20.0);
    }
  });

  it("should reject product with empty code or negative price", () => {
    const invalidProduct = {
      ...sampleProduct,
      code: "",
      priceIdr: -500,
    };
    const result = productMasterSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it("should validate catalog memory JSON container", () => {
    const container: CatalogMemoryContainer = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      companyName: "CV. Sabila Multi Kreasindo",
      totalProducts: 1,
      products: [sampleProduct],
    };
    const result = catalogMemorySchema.safeParse(container);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalProducts).toBe(1);
      expect(result.data.products[0].code).toBe("ST - 020");
    }
  });

  it("should correctly export to JSON and parse back catalog memory", async () => {
    const { exportCatalogToJson, parseCatalogFromJson } = await import(
      "../src/services/productCatalog"
    );
    const jsonStr = exportCatalogToJson([sampleProduct]);
    const parsed = parseCatalogFromJson(jsonStr);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.totalProducts).toBe(1);
    expect(parsed.data?.products[0].code).toBe("ST - 020");
    expect(parsed.data?.products[0].priceIdr).toBe(18000);
  });

  it("should parse legacy raw array of products gracefully", async () => {
    const { parseCatalogFromJson } = await import(
      "../src/services/productCatalog"
    );
    const rawArrayStr = JSON.stringify([sampleProduct]);
    const parsed = parseCatalogFromJson(rawArrayStr);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.totalProducts).toBe(1);
    expect(parsed.data?.products[0].code).toBe("ST - 020");
  });
});
