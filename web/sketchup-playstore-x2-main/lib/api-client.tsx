const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sketchupplaystore.com"

export interface Model {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  thumbnail: string
  downloadUrl: string
  fileSize: string
  format: string
  downloads: number
  rating: number
  tags: string[]
  author: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Models API
  async getModels(category?: string, search?: string): Promise<Model[]> {
    try {
      const params = new URLSearchParams()
      if (category && category !== "all") params.append("category", category)
      if (search) params.append("search", search)

      const queryString = params.toString()
      const endpoint = `/api/models${queryString ? `?${queryString}` : ""}`

      const response = await this.request<ApiResponse<{ models: Model[] }>>(endpoint)
      return response.data.models
    } catch (error) {
      console.log("[v0] Failed to fetch models from API, using fallback")
      return []
    }
  }

  async getModelById(id: string): Promise<Model | null> {
    try {
      const response = await this.request<ApiResponse<{ model: Model }>>(`/api/models/${id}`)
      return response.data.model
    } catch (error) {
      console.log("[v0] Failed to fetch model by ID:", error)
      return null
    }
  }

  async trackDownload(modelId: string): Promise<boolean> {
    try {
      await this.request(`/api/models/${modelId}/download`, {
        method: "POST",
      })
      return true
    } catch (error) {
      console.log("[v0] Failed to track download:", error)
      return false
    }
  }

  async getCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
    try {
      const response =
        await this.request<ApiResponse<{ categories: Array<{ id: string; name: string; count: number }> }>>(
          "/api/categories",
        )
      return response.data.categories
    } catch (error) {
      console.log("[v0] Failed to fetch categories, using fallback")
      return [
        { id: "hardscape", name: "Hardscape", count: 245 },
        { id: "outdoor-furniture", name: "Outdoor Furniture", count: 189 },
        { id: "textures", name: "Textures", count: 312 },
        { id: "plants", name: "Plants & Trees", count: 156 },
        { id: "lighting", name: "Lighting", count: 98 },
        { id: "water-features", name: "Water Features", count: 67 },
      ]
    }
  }
}

export const apiClient = new ApiClient()
