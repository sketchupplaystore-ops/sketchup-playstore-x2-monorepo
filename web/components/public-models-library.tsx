"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Star, Grid, List, Home, Upload, X } from "lucide-react"
import { getModelThumbnailUrl, getModelDownloadUrl } from "@/lib/cdn-utils"

interface Model {
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

interface PublicModelsLibraryProps {
  currentUser?: { role: "admin" | "designer" | "client"; name: string } | null
  onNavigateHome?: () => void
}

const categories = [
  { id: "hardscape", name: "Hardscape", count: 245 },
  { id: "outdoor-furniture", name: "Outdoor Furniture", count: 189 },
  { id: "textures", name: "Textures", count: 312 },
  { id: "plants", name: "Plants & Trees", count: 156 },
  { id: "lighting", name: "Lighting", count: 98 },
  { id: "water-features", name: "Water Features", count: 67 },
]

// Sample data - will be replaced with API calls
const sampleModels: Model[] = [
  {
    id: "1",
    title: "Modern Patio Set",
    description: "Contemporary outdoor dining set with clean lines",
    category: "outdoor-furniture",
    subcategory: "dining-sets",
    thumbnail: getModelThumbnailUrl("1", "modern-patio-dining-set.jpg"),
    downloadUrl: getModelDownloadUrl("1", "modern-patio-set.skp"),
    fileSize: "2.4 MB",
    format: "SKP",
    downloads: 1247,
    rating: 4.8,
    tags: ["modern", "patio", "dining", "furniture"],
    author: "DesignStudio",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Stone Pathway Texture",
    description: "High-resolution natural stone pathway texture",
    category: "textures",
    subcategory: "stone",
    thumbnail: getModelThumbnailUrl("2", "stone-pathway-texture.jpg"),
    downloadUrl: getModelDownloadUrl("2", "stone-pathway.jpg"),
    fileSize: "8.1 MB",
    format: "JPG",
    downloads: 892,
    rating: 4.6,
    tags: ["stone", "pathway", "natural", "texture"],
    author: "TexturePro",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    title: "Decorative Garden Fountain",
    description: "Classical tiered fountain for garden landscapes",
    category: "water-features",
    subcategory: "fountains",
    thumbnail: getModelThumbnailUrl("3", "decorative-garden-fountain.jpg"),
    downloadUrl: getModelDownloadUrl("3", "garden-fountain.skp"),
    fileSize: "5.2 MB",
    format: "SKP",
    downloads: 634,
    rating: 4.9,
    tags: ["fountain", "water", "classical", "garden"],
    author: "WaterDesigns",
    createdAt: "2024-01-10",
  },
]

export function PublicModelsLibrary({ currentUser, onNavigateHome }: PublicModelsLibraryProps) {
  const [models, setModels] = useState<Model[]>(sampleModels)
  const [filteredModels, setFilteredModels] = useState<Model[]>(sampleModels)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    format: "SKP",
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([])
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([])
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([])
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  const canUpload = currentUser && (currentUser.role === "admin" || currentUser.role === "designer")

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sketchupplaystore.com"
        const response = await fetch(`${apiUrl}/api/models`)

        if (response.ok) {
          const data = await response.json()
          setModels(data.models || sampleModels)
          setFilteredModels(data.models || sampleModels)
        } else {
          // Fallback to sample data if API fails
          setModels(sampleModels)
          setFilteredModels(sampleModels)
        }
      } catch (error) {
        console.log("[v0] API fetch failed, using sample data:", error)
        setModels(sampleModels)
        setFilteredModels(sampleModels)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  useEffect(() => {
    // Load from localStorage
    const savedTitles = JSON.parse(localStorage.getItem("model-titles") || "[]")
    const savedTags = JSON.parse(localStorage.getItem("model-tags") || "[]")
    const savedAuthors = JSON.parse(localStorage.getItem("model-authors") || "[]")

    setTitleSuggestions(savedTitles)
    setTagSuggestions(savedTags)
    setAuthorSuggestions(savedAuthors)
  }, [])

  // Filter models based on category and search
  useEffect(() => {
    let filtered = models

    if (selectedCategory !== "all") {
      filtered = filtered.filter((model) => model.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (model) =>
          model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredModels(filtered)
  }, [models, selectedCategory, searchQuery])

  const saveToAutocomplete = (type: string, value: string) => {
    if (!value.trim()) return

    const key = `model-${type}`
    const existing = JSON.parse(localStorage.getItem(key) || "[]")
    const updated = [value, ...existing.filter((item: string) => item !== value)].slice(0, 10)
    localStorage.setItem(key, JSON.stringify(updated))

    if (type === "titles") setTitleSuggestions(updated)
    if (type === "tags") setTagSuggestions(updated)
    if (type === "authors") setAuthorSuggestions(updated)
  }

  const handleDownload = async (model: Model) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sketchupplaystore.com"

      // Track download
      await fetch(`${apiUrl}/api/models/${model.id}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      // Trigger download
      const link = document.createElement("a")
      link.href = model.downloadUrl
      link.download = `${model.title}.${model.format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.log("[v0] Download tracking failed:", error)
      // Still allow download even if tracking fails
      const link = document.createElement("a")
      link.href = model.downloadUrl
      link.download = `${model.title}.${model.format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleUploadSubmit = async () => {
    if (!uploadData.title || !uploadData.description || !uploadData.category || !uploadedFile) {
      alert("Please fill in all required fields and select a file")
      return
    }

    if (uploadedFile.size > 5 * 1024 * 1024 * 1024) {
      // 5GB limit
      alert("File size exceeds 5GB limit. Please choose a smaller file.")
      return
    }

    saveToAutocomplete("titles", uploadData.title)
    saveToAutocomplete("tags", uploadData.tags)
    if (currentUser?.name) {
      saveToAutocomplete("authors", currentUser.name)
    }

    setIsUploading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sketchupplaystore.com"

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minute timeout

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("title", uploadData.title)
      formData.append("description", uploadData.description)
      formData.append("category", uploadData.category)
      formData.append("tags", uploadData.tags)
      formData.append("format", uploadData.format)
      formData.append("author", currentUser?.name || "Anonymous")

      console.log("[v0] Starting upload:", {
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        apiUrl: `${apiUrl}/api/models/upload`,
      })

      const response = await fetch(`${apiUrl}/api/models/upload`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      console.log("[v0] Upload response:", response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Upload successful:", result)

        const newModel: Model = {
          id: result.id || Date.now().toString(),
          title: uploadData.title,
          description: uploadData.description,
          category: uploadData.category,
          subcategory: uploadData.category,
          thumbnail: result.thumbnail || "/uploaded-model.jpg",
          downloadUrl: result.downloadUrl || "#",
          fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          format: uploadData.format,
          downloads: 0,
          rating: 5.0,
          tags: uploadData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          author: currentUser?.name || "Anonymous",
          createdAt: new Date().toISOString().split("T")[0],
        }

        setModels([newModel, ...models])
        setShowUploadForm(false)
        setUploadData({ title: "", description: "", category: "", tags: "", format: "SKP" })
        setUploadedFile(null)
        alert("Model uploaded successfully!")
      } else {
        const errorText = await response.text()
        console.log("[v0] Upload failed:", response.status, errorText)
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.log("[v0] Upload error:", error)
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          alert("Upload timed out. Please try again with a smaller file or check your connection.")
        } else {
          alert(`Upload failed: ${error.message}. Please check your connection and try again.`)
        }
      } else {
        alert("Upload failed. Please check your connection and try again.")
      }
    } finally {
      setIsUploading(false)
    }
  }

  const getFilteredSuggestions = (suggestions: string[], query: string) => {
    return suggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {onNavigateHome && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateHome}
                  className="gap-2 hover:bg-emerald-50 hover:border-emerald-200 bg-transparent"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Free SketchUp Models - Landscape Design Library</h1>
                <p className="text-emerald-600 mt-1">
                  Download high-quality free SketchUp models, textures, and 3D assets for your landscape designs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canUpload && (
                <Button
                  onClick={() => setShowUploadForm(true)}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Upload className="h-4 w-4" />
                  Upload Model
                </Button>
              )}
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Upload Free SketchUp Model</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowUploadForm(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Share your landscape design models with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="title">Model Title *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => {
                      setUploadData({ ...uploadData, title: e.target.value })
                      setShowTitleSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowTitleSuggestions(uploadData.title.length > 0)}
                    onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 200)}
                    placeholder="Modern Garden Bench"
                    autoComplete="off"
                  />
                  {showTitleSuggestions && titleSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                      {getFilteredSuggestions(titleSuggestions, uploadData.title).map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => {
                            setUploadData({ ...uploadData, title: suggestion })
                            setShowTitleSuggestions(false)
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={uploadData.category}
                    onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Describe your model, materials, and intended use..."
                  rows={3}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={uploadData.tags}
                    onChange={(e) => {
                      setUploadData({ ...uploadData, tags: e.target.value })
                      setShowTagSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowTagSuggestions(uploadData.tags.length > 0)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    placeholder="modern, outdoor, furniture, wood"
                    autoComplete="off"
                  />
                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                      {getFilteredSuggestions(tagSuggestions, uploadData.tags).map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => {
                            const currentTags = uploadData.tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t)
                            const newTags = [...currentTags, suggestion].join(", ")
                            setUploadData({ ...uploadData, tags: newTags })
                            setShowTagSuggestions(false)
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">File Format</Label>
                  <Select
                    value={uploadData.format}
                    onValueChange={(value) => setUploadData({ ...uploadData, format: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SKP">SketchUp (.skp)</SelectItem>
                      <SelectItem value="JPG">Texture (.jpg)</SelectItem>
                      <SelectItem value="PNG">Texture (.png)</SelectItem>
                      <SelectItem value="3DS">3D Studio (.3ds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File *</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileUpload}
                    accept=".skp,.jpg,.jpeg,.png,.3ds"
                    className="hidden"
                  />
                  <label htmlFor="file" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">SKP, JPG, PNG, 3DS files up to 5GB</p>
                    {uploadedFile && (
                      <div className="mt-2 text-center">
                        <p className="text-xs text-emerald-600">
                          File size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        {uploadedFile.size > 100 * 1024 * 1024 && (
                          <p className="text-xs text-amber-600 mt-1">
                            Large file detected. Upload may take several minutes.
                          </p>
                        )}
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUploadSubmit}
                  disabled={isUploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Model
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowUploadForm(false)} disabled={isUploading}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search free SketchUp models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Free Models
                  <Badge variant="secondary" className="ml-auto">
                    {models.length}
                  </Badge>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading free SketchUp models...</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Showing {filteredModels.length} of {models.length} free SketchUp models
                  </p>
                </div>

                {/* Models Grid/List */}
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {filteredModels.map((model) => (
                    <Card key={model.id} className="hover-lift">
                      <div className="relative">
                        <img
                          src={model.thumbnail || "/placeholder.svg"}
                          alt={model.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-emerald-600">{model.format}</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{model.title}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{model.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{model.fileSize}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {model.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleDownload(model)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>By {model.author}</span>
                          <span>{model.downloads} downloads</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredModels.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No free SketchUp models found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
