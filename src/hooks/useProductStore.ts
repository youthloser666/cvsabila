import { create } from "zustand";
import { ProductMaster } from "../models/types";
import {
  deleteProductFromApi,
  exportCatalogWithNativeDialog,
  ExportDialogResult,
  fetchProductsFromApi,
  loadProductsFromStorage,
  saveProductsToStorage,
  saveProductToApi,
} from "../services/productCatalog";

interface ProductStoreState {
  products: ProductMaster[];
  searchQuery: string;
  isCatalogModalOpen: boolean;
  isFormModalOpen: boolean;
  editingProduct: ProductMaster | null;
  isLoading: boolean;

  setSearchQuery: (query: string) => void;
  openCatalogModal: () => void;
  closeCatalogModal: () => void;
  openCreateModal: () => void;
  openEditModal: (product: ProductMaster) => void;
  closeFormModal: () => void;

  addProduct: (
    item: Omit<ProductMaster, "id" | "createdAt" | "updatedAt">
  ) => Promise<ProductMaster>;
  updateProduct: (
    id: string,
    updates: Partial<Omit<ProductMaster, "id" | "createdAt" | "updatedAt">>
  ) => Promise<ProductMaster | null>;
  deleteProduct: (id: string) => Promise<void>;
  importCatalog: (
    incoming: ProductMaster[],
    mergeMode?: "merge" | "replace"
  ) => void;
  exportCatalog: (companyName?: string) => Promise<ExportDialogResult>;
  getProductByCode: (code: string) => ProductMaster | undefined;
  syncFromBackend: () => Promise<void>;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: loadProductsFromStorage(),
  searchQuery: "",
  isCatalogModalOpen: false,
  isFormModalOpen: false,
  editingProduct: null,
  isLoading: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  openCatalogModal: () => {
    set({ isCatalogModalOpen: true });
    get().syncFromBackend();
  },

  closeCatalogModal: () => set({ isCatalogModalOpen: false }),

  openCreateModal: () => set({ isFormModalOpen: true, editingProduct: null }),

  openEditModal: (product) =>
    set({ isFormModalOpen: true, editingProduct: product }),

  closeFormModal: () => set({ isFormModalOpen: false, editingProduct: null }),

  addProduct: async (item) => {
    const now = new Date().toISOString();
    const newProduct: ProductMaster = {
      ...item,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newProduct, ...get().products];
    set({ products: updatedList });
    saveProductsToStorage(updatedList);

    // Sync with Bun server in background if available
    saveProductToApi(newProduct).catch(() => {});

    return newProduct;
  },

  updateProduct: async (id, updates) => {
    const currentList = get().products;
    const index = currentList.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const updatedItem: ProductMaster = {
      ...currentList[index],
      ...updates,
      updatedAt: now,
    };

    const updatedList = [...currentList];
    updatedList[index] = updatedItem;

    set({ products: updatedList });
    saveProductsToStorage(updatedList);

    // Sync with Bun server in background if available
    saveProductToApi(updatedItem).catch(() => {});

    return updatedItem;
  },

  deleteProduct: async (id) => {
    const updatedList = get().products.filter((p) => p.id !== id);
    set({ products: updatedList });
    saveProductsToStorage(updatedList);

    // Sync with Bun server in background if available
    deleteProductFromApi(id).catch(() => {});
  },

  importCatalog: (incoming, mergeMode = "merge") => {
    const current = get().products;
    let finalProducts: ProductMaster[];

    if (mergeMode === "replace") {
      finalProducts = incoming;
    } else {
      // Merge by code or ID
      const map = new Map<string, ProductMaster>();
      for (const p of current) {
        map.set(p.code.trim().toUpperCase(), p);
      }
      for (const item of incoming) {
        map.set(item.code.trim().toUpperCase(), item);
      }
      finalProducts = Array.from(map.values());
    }

    set({ products: finalProducts });
    saveProductsToStorage(finalProducts);
  },

  exportCatalog: async (companyName) => {
    return await exportCatalogWithNativeDialog(get().products, companyName);
  },

  getProductByCode: (code) => {
    const normalized = code.trim().toUpperCase();
    return get().products.find(
      (p) => p.code.trim().toUpperCase() === normalized
    );
  },

  syncFromBackend: async () => {
    set({ isLoading: true });
    try {
      const serverProducts = await fetchProductsFromApi();
      if (serverProducts && serverProducts.length > 0) {
        set({ products: serverProducts });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
