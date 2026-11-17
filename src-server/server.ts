import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface ProductRecord {
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

export interface CatalogContainer {
  version: string;
  exportedAt: string;
  companyName: string;
  totalProducts: number;
  products: ProductRecord[];
}

const DEFAULT_INITIAL_PRODUCTS: ProductRecord[] = [
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "data");
const DATA_FILE = join(DATA_DIR, "products.json");

function ensureStorage(): ProductRecord[] {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!existsSync(DATA_FILE)) {
      writeFileSync(
        DATA_FILE,
        JSON.stringify(DEFAULT_INITIAL_PRODUCTS, null, 2),
        "utf-8"
      );
      return [...DEFAULT_INITIAL_PRODUCTS];
    }
    const raw = readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [...DEFAULT_INITIAL_PRODUCTS];
  } catch (err) {
    console.error("Storage read error, using defaults:", err);
    return [...DEFAULT_INITIAL_PRODUCTS];
  }
}

function persistStorage(products: ProductRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Storage write error:", err);
  }
}

let productsCache = ensureStorage();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

const PORT = Number(process.env.PORT || 3001);

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // GET /api/products
    if (url.pathname === "/api/products" && method === "GET") {
      return jsonResponse(productsCache);
    }

    // GET /api/products/export
    if (url.pathname === "/api/products/export" && method === "GET") {
      const exportContainer: CatalogContainer = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        companyName: "CV. Sabila Multi Kreasindo",
        totalProducts: productsCache.length,
        products: productsCache,
      };
      return new Response(JSON.stringify(exportContainer, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="products_cvsabila.json"',
          ...CORS_HEADERS,
        },
      });
    }

    // POST /api/products/import
    if (url.pathname === "/api/products/import" && method === "POST") {
      try {
        const body = (await req.json()) as CatalogContainer | ProductRecord[];
        const incoming = Array.isArray(body)
          ? body
          : Array.isArray(body?.products)
          ? body.products
          : [];

        if (incoming.length === 0) {
          return jsonResponse({ error: "No products found in payload" }, 400);
        }

        const map = new Map<string, ProductRecord>();
        for (const p of productsCache) {
          map.set(p.id, p);
        }
        for (const item of incoming) {
          const id = item.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          map.set(id, {
            ...item,
            id,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        productsCache = Array.from(map.values());
        persistStorage(productsCache);

        return jsonResponse({
          success: true,
          importedCount: incoming.length,
          totalProducts: productsCache.length,
        });
      } catch (err: any) {
        return jsonResponse({ error: err.message || "Failed to parse import" }, 400);
      }
    }

    // POST /api/products (Create or Update)
    if (url.pathname === "/api/products" && method === "POST") {
      try {
        const payload = (await req.json()) as Partial<ProductRecord>;
        const now = new Date().toISOString();
        let targetId = payload.id;

        if (targetId) {
          const index = productsCache.findIndex((p) => p.id === targetId);
          if (index !== -1) {
            const updated: ProductRecord = {
              ...productsCache[index],
              ...payload,
              id: targetId,
              updatedAt: now,
            } as ProductRecord;
            productsCache[index] = updated;
            persistStorage(productsCache);
            return jsonResponse(updated);
          }
        }

        targetId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const created: ProductRecord = {
          id: targetId,
          code: payload.code || "UNTITLED",
          description: payload.description || "",
          colour: payload.colour || "Natural",
          dimDia: payload.dimDia ?? null,
          dimL: payload.dimL ?? null,
          dimW: payload.dimW ?? null,
          dimH: payload.dimH ?? null,
          priceIdr: Number(payload.priceIdr || 0),
          priceUsd: payload.priceUsd ? Number(payload.priceUsd) : null,
          photoUrl: payload.photoUrl || null,
          createdAt: now,
          updatedAt: now,
        };
        productsCache.unshift(created);
        persistStorage(productsCache);
        return jsonResponse(created, 201);
      } catch (err: any) {
        return jsonResponse({ error: err.message || "Invalid payload" }, 400);
      }
    }

    // DELETE /api/products/:id
    const deleteMatch = url.pathname.match(/^\/api\/products\/(.+)$/);
    if (deleteMatch && method === "DELETE") {
      const deleteId = decodeURIComponent(deleteMatch[1]);
      const initialLen = productsCache.length;
      productsCache = productsCache.filter((p) => p.id !== deleteId);
      persistStorage(productsCache);
      return jsonResponse({
        success: true,
        deletedId: deleteId,
        existed: productsCache.length < initialLen,
      });
    }

    return jsonResponse({ error: "Not Found" }, 404);
  },
});

console.log(`[CV-SABILA Backend] Bun HTTP Server running at http://localhost:${server.port}`);
