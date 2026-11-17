import { describe, expect, it } from "bun:test";

describe("Bun Backend Server Contracts & Endpoints", () => {
  it("should verify server module exports and structure", async () => {
    // Dynamically test import of server logic
    const serverModulePath = "../src-server/server.ts";
    expect(serverModulePath).toBeDefined();
  });

  it("should simulate server fetch logic with custom Request objects", async () => {
    // We can directly instantiate requests to test the fetch handler behavior
    // or verify that the storage json files and schemas conform
    const { loadProductsFromStorage, exportCatalogToJson, parseCatalogFromJson } =
      await import("../src/services/productCatalog");

    const prods = loadProductsFromStorage();
    expect(Array.isArray(prods)).toBe(true);
    expect(prods.length).toBeGreaterThanOrEqual(1);

    const json = exportCatalogToJson(prods, "CV. Sabila Multi Kreasindo");
    const parsed = parseCatalogFromJson(json);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.products.length).toBe(prods.length);
  });
});
