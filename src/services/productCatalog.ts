import { catalogMemorySchema, productMasterSchema } from "../models/schemas";
import { CatalogMemoryContainer, ProductMaster } from "../models/types";

const PRODUCT_STORAGE_KEY = "cv_sabila_product_catalog_v1";
const API_BASE_URL = "http://localhost:3001/api/products";

export const DEFAULT_INITIAL_PRODUCTS: ProductMaster[] = [
  {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-st-016",
    code: "ST - 016",
    description: "Coaster Capiz Shell",
    colour: "Combine",
    dimDia: null,
    dimL: 10.0,
    dimW: 10.0,
    dimH: 1.0,
    priceIdr: 9000,
    priceUsd: 0.6,
    photoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-sc-004-coaster",
    code: "SC - 004",
    description: "Coaster Capiz Shell",
    colour: "Combine",
    dimDia: null,
    dimL: 10.0,
    dimW: 10.0,
    dimH: 1.0,
    priceIdr: 8500,
    priceUsd: 0.55,
    photoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-sc-004-bowl",
    code: "SC - 004",
    description: "Bowl Capiz Shell",
    colour: "Combine",
    dimDia: null,
    dimL: 15.0,
    dimW: 15.0,
    dimH: 3.5,
    priceIdr: 25000,
    priceUsd: 1.65,
    photoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-st-005",
    code: "ST - 005",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    dimDia: null,
    dimL: 10.0,
    dimW: 18.0,
    dimH: 3.0,
    priceIdr: 20000,
    priceUsd: 1.3,
    photoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-st-023",
    code: "ST - 023",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    dimDia: null,
    dimL: 12.0,
    dimW: 20.0,
    dimH: 1.5,
    priceIdr: 20000,
    priceUsd: 1.3,
    photoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-st-021",
    code: "ST - 021",
    description: "Serving Plate Capiz Shell",
    colour: "Natural",
    dimDia: null,
    dimL: 8.3,
    dimW: 11.0,
    dimH: 2.2,
    priceIdr: 15000,
    priceUsd: 1.0,
    photoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function loadProductsFromStorage(): ProductMaster[] {
  try {
    if (typeof localStorage === "undefined") {
      return [...DEFAULT_INITIAL_PRODUCTS];
    }
    const raw = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) {
      saveProductsToStorage(DEFAULT_INITIAL_PRODUCTS);
      return [...DEFAULT_INITIAL_PRODUCTS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [...DEFAULT_INITIAL_PRODUCTS];
  } catch (err) {
    return [...DEFAULT_INITIAL_PRODUCTS];
  }
}

export function saveProductsToStorage(products: ProductMaster[]): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
    }
  } catch (err) {
    console.error("Could not save products to local storage:", err);
  }
}

export async function fetchProductsFromApi(): Promise<ProductMaster[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(API_BASE_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveProductsToStorage(data);
        return data;
      }
    }
    return null;
  } catch {
    // Backend server might not be running; fallback cleanly
    return null;
  }
}

export async function saveProductToApi(product: Partial<ProductMaster>): Promise<ProductMaster | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteProductFromApi(id: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export function exportCatalogToJson(
  products: ProductMaster[],
  companyName = "CV. Sabila Multi Kreasindo"
): string {
  const container: CatalogMemoryContainer = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    companyName,
    totalProducts: products.length,
    products,
  };
  return JSON.stringify(container, null, 2);
}

export function parseCatalogFromJson(jsonString: string): {
  success: boolean;
  data?: CatalogMemoryContainer;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    // Allow either container format or direct array of products
    if (Array.isArray(parsed)) {
      const validProducts: ProductMaster[] = [];
      for (const item of parsed) {
        const val = productMasterSchema.safeParse(item);
        if (val.success) {
          validProducts.push(val.data as ProductMaster);
        }
      }
      return {
        success: true,
        data: {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
          companyName: "CV. Sabila Multi Kreasindo",
          totalProducts: validProducts.length,
          products: validProducts,
        },
      };
    }

    const val = catalogMemorySchema.safeParse(parsed);
    if (val.success) {
      return {
        success: true,
        data: val.data as CatalogMemoryContainer,
      };
    } else {
      return {
        success: false,
        error: val.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Invalid JSON structure",
    };
  }
}

export function downloadCatalogJsonFile(
  products: ProductMaster[],
  companyName = "CV. Sabila Multi Kreasindo"
): void {
  const jsonStr = exportCatalogToJson(products, companyName);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `katalog_produk_cvsabila_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ExportDialogResult {
  success: boolean;
  savedPath?: string;
  canceled?: boolean;
  error?: string;
}

export async function exportCatalogWithNativeDialog(
  products: ProductMaster[],
  companyName = "CV. Sabila Multi Kreasindo"
): Promise<ExportDialogResult> {
  const jsonStr = exportCatalogToJson(products, companyName);
  const dateStr = new Date().toISOString().slice(0, 10);
  const defaultFileName = `katalog_produk_cvsabila_${dateStr}.json`;

  // 1. Try Tauri native dialog & filesystem
  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile } = await import("@tauri-apps/plugin-fs");

    const targetPath = await save({
      defaultPath: defaultFileName,
      filters: [{ name: "JSON Catalog", extensions: ["json"] }],
    });

    if (targetPath) {
      await writeFile(targetPath, new TextEncoder().encode(jsonStr));
      return { success: true, savedPath: targetPath };
    } else {
      return { success: false, canceled: true };
    }
  } catch {
    // 2. Try modern web File System Access API (showSaveFilePicker)
    try {
      if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [
            {
              description: "JSON Catalog File",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(jsonStr);
        await writable.close();
        return { success: true, savedPath: handle.name || defaultFileName };
      }
    } catch (pickerErr: any) {
      if (pickerErr.name === "AbortError") {
        return { success: false, canceled: true };
      }
    }

    // 3. Fallback to direct download
    downloadCatalogJsonFile(products, companyName);
    return { success: true, savedPath: defaultFileName };
  }
}
