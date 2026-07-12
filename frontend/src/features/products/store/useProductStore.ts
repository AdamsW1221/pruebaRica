import { create } from 'zustand'
import type { Product, ProductCreateData, ProductUpdateData } from '../services/productService'
import {
  getAllProductsIncludeDeactivated,
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProduct,
  setProductActive,
} from '../services/productService'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (data: ProductCreateData) => Promise<void>
  editProduct: (id: number, data: ProductUpdateData) => Promise<void>
  deactivateProduct: (id: number) => Promise<void>
  removeProduct: (id: number) => Promise<void>
  toggleActive: (id: number, active: boolean) => Promise<void>
  clearError: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const products = await getAllProductsIncludeDeactivated()
      set({ products, loading: false })
    } catch {
      set({ error: 'Error al cargar los productos.', loading: false })
    }
  },

  addProduct: async (data) => {
    const product = await createProduct(data)
    set((state) => ({ products: [product, ...state.products] }))
  },

  editProduct: async (id, data) => {
    const updated = await updateProduct(id, data)
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? updated : p)),
    }))
  },

  deactivateProduct: async (id) => {
    await deactivateProduct(id)
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, active: false, isDesactivate: true } : p
      ),
    }))
  },

  removeProduct: async (id) => {
    await deleteProduct(id)
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }))
  },

  toggleActive: async (id, active) => {
    await setProductActive(id, active)
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, active, isDesactivate: active ? false : p.isDesactivate } : p
      ),
    }))
  },

  clearError: () => set({ error: null }),
}))
