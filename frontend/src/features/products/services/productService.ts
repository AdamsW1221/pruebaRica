import api from '../../../services/api'

export interface Product {
  id: number
  name: string
  description: string
  quantity: number
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  active: boolean
  isDesactivate: boolean
}

export interface ProductCreateData {
  name: string
  description: string
  quantity: number
  imageUrl?: string | null
}

export interface ProductUpdateData {
  name: string
  description: string
  quantity: number
  imageUrl?: string | null
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>('/api/products')
  return res.data
}

export const getAllProductsIncludeDeactivated = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>('/api/products/all')
  return res.data
}

export const getPagedProducts = async (page: number, pageSize: number = 8, search: string = '', filter: string = 'active'): Promise<PagedResult<Product>> => {
  const res = await api.get<PagedResult<Product>>(`/api/products/paged?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&filter=${filter}`)
  return res.data
}

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get<Product>(`/api/products/${id}`)
  return res.data
}

export const createProduct = async (data: ProductCreateData): Promise<Product> => {
  const res = await api.post<Product>('/api/products', data)
  return res.data
}

export const updateProduct = async (id: number, data: ProductUpdateData): Promise<Product> => {
  const res = await api.put<Product>(`/api/products/${id}`, data)
  return res.data
}

export const deactivateProduct = async (id: number): Promise<void> => {
  await api.patch(`/api/products/${id}/deactivate`)
}

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/api/products/${id}`)
}

export const setProductActive = async (id: number, active: boolean): Promise<void> => {
  await api.patch(`/api/products/${id}/active?active=${active}`)
}
