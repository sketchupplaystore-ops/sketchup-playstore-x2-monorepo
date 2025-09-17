"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download,
  Search,
  Star,
  Eye,
  Coins,
  Grid,
  Home,
  TreePine,
  Sofa,
  Paintbrush,
  Plug,
  Sparkles,
} from "lucide-react"

interface SketchUpModel {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  downloadUrl: string
  fileSize: string
  downloads: number
  rating: number
  uploadDate: string
  isFree: boolean
  tokenCost?: number
  tags: string[]
  author: string
}

const quickDownloadModels: SketchUpModel[] = [
  {
    id: "quick-1",
    name: "Modern Stone Pathway",
    description: "Contemporary stone pathway with natural textures",
    category: "Hardscape",
    thumbnail: "/modern-stone-pathway-landscape.jpg",
    downloadUrl: "/models/stone-pathway.skp",
    fileSize: "2.4 MB",
    downloads: 1250,
    rating: 4.8,
    uploadDate: "2024-01-15",
    isFree: true,
    tags: ["pathway", "stone", "modern"],
    author: "James Wilson",
  },
  {
    id: "quick-2",
    name: "Teak Dining Set",
    description: "Premium teak outdoor dining furniture set",
    category: "Outdoor Furniture",
    thumbnail: "/teak-outdoor-dining-furniture-set.jpg",
    downloadUrl: "/models/teak-dining.skp",
    fileSize: "3.2 MB",
    downloads: 2100,
    rating: 4.7,
    uploadDate: "2024-01-12",
    isFree: true,
    tags: ["dining", "teak", "furniture"],
    author: "Dennis Chen",
  },
  {
    id: "quick-3",
    name: "Japanese Maple Collection",
    description: "Detailed Japanese maple trees in various sizes",
    category: "Plants & Shrubs",
    thumbnail: "/japanese-maple-trees-collection.jpg",
    downloadUrl: "/models/japanese-maple.skp",
    fileSize: "4.7 MB",
    downloads: 3200,
    rating: 4.9,
    uploadDate: "2024-01-14",
    isFree: true,
    tags: ["maple", "trees", "japanese"],
    author: "Sharon Davis",
  },
  {
    id: "quick-4",
    name: "Tiny House ADU",
    description: "Compact 250 sq ft tiny house design with loft",
    category: "ADU",
    thumbnail: "/placeholder-2hsen.png",
    downloadUrl: "/models/tiny-house-adu.skp",
    fileSize: "6.8 MB",
    downloads: 950,
    rating: 4.7,
    uploadDate: "2024-01-16",
    isFree: true,
    tags: ["adu", "tiny", "loft", "compact"],
    author: "Sarah Johnson",
  },
  {
    id: "quick-5",
    name: "Natural Stone Textures Pack",
    description: "High-resolution stone and rock texture collection",
    category: "Textures",
    thumbnail: "/placeholder-1lqik.png",
    downloadUrl: "/models/stone-textures.zip",
    fileSize: "45.2 MB",
    downloads: 2800,
    rating: 4.8,
    uploadDate: "2024-01-12",
    isFree: true,
    tags: ["stone", "texture", "natural", "pack"],
    author: "Texture Studio",
  },
  {
    id: "quick-6",
    name: "Plant Library Manager",
    description: "Organize and manage your plant component library",
    category: "Plugins",
    thumbnail: "/placeholder-p8w48.png",
    downloadUrl: "/plugins/plant-manager.rbz",
    fileSize: "8.9 MB",
    downloads: 850,
    rating: 4.6,
    uploadDate: "2024-01-08",
    isFree: true,
    tags: ["plugin", "plants", "library", "manager"],
    author: "Garden Tools",
  },
  {
    id: "quick-7",
    name: "Outdoor Lighting Kit",
    description: "Complete outdoor lighting system with fixtures and wiring",
    category: "Others",
    thumbnail: "/outdoor-lighting-fixtures.jpg",
    downloadUrl: "/models/outdoor-lighting.skp",
    fileSize: "7.2 MB",
    downloads: 1150,
    rating: 4.7,
    uploadDate: "2024-01-17",
    isFree: true,
    tags: ["lighting", "outdoor", "fixtures", "electrical"],
    author: "Lighting Pro",
  },
  {
    id: "quick-8",
    name: "Johnson Family Backyard",
    description: "Complete luxury backyard transformation project",
    category: "What's New",
    thumbnail: "/luxury-backyard-transformation-complete-project.jpg",
    downloadUrl: "/models/johnson-backyard.skp",
    fileSize: "12.3 MB",
    downloads: 450,
    rating: 5.0,
    uploadDate: "2024-01-16",
    isFree: false,
    tokenCost: 10,
    tags: ["complete", "luxury", "backyard", "transformation"],
    author: "James Wilson",
  },
]

const categories = [
  { id: "all", name: "All Categories", icon: Grid, color: "bg-slate-100" },
  { id: "Hardscape", name: "Hardscape", icon: Grid, color: "bg-stone-100" },
  { id: "Outdoor Furniture", name: "Outdoor Furniture", icon: Sofa, color: "bg-amber-100" },
  { id: "Plants & Shrubs", name: "Plants & Shrubs", icon: TreePine, color: "bg-green-100" },
  { id: "Textures", name: "Textures", icon: Paintbrush, color: "bg-purple-100" },
  { id: "Plugins", name: "Plugins", icon: Plug, color: "bg-blue-100" },
  { id: "ADU", name: "ADU Plans", icon: Home, color: "bg-indigo-100" },
  { id: "Others", name: "Others", icon: Grid, color: "bg-gray-100" },
  { id: "What's New", name: "What's New", icon: Sparkles, color: "bg-emerald-100" },
]

interface ModelsPageProps {
  onNavigate: (page: string) => void
}

export function ModelsPage({ onNavigate }: ModelsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [userTokens, setUserTokens] = useState(25)
  const [filteredModels, setFilteredModels] = useState(quickDownloadModels)

  useEffect(() => {
    let filtered = quickDownloadModels

    if (selectedCategory !== "all") {
      filtered = filtered.filter((model) => model.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredModels(filtered)
  }, [selectedCategory, searchQuery])

  const handleDownload = (model: SketchUpModel) => {
    if (!model.isFree && model.tokenCost) {
      if (userTokens >= model.tokenCost) {
        setUserTokens((prev) => prev - model.tokenCost!)
        console.log(`Downloading ${model.name} for ${model.tokenCost} tokens`)
      } else {
        alert("Insufficient tokens!")
        return
      }
    }

    // Simulate download
    const link = document.createElement("a")
    link.href = model.downloadUrl
    link.download = `${model.name}.skp`
    link.click()
  }

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return quickDownloadModels.length
    return quickDownloadModels.filter((model) => model.category === categoryId).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <div className="glass border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-900">Quick Download Models</h1>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <Coins className="w-3 h-3 mr-1" />
                {userTokens} Tokens
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 bg-transparent"
                onClick={() => onNavigate("landing")}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 bg-transparent"
                onClick={() => onNavigate("playstore")}
              >
                <Grid className="h-4 w-4" />
                Full Library
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search quick download models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Quick Download Models</h2>
          <p className="text-gray-600 mb-6">Fast access to our most popular free models for immediate download</p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const count = getCategoryCount(category.id)
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`gap-2 ${selectedCategory === category.id ? "bg-emerald-600 text-white" : "hover:bg-emerald-50"}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="text-xs ml-1">
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="glass hover-lift animate-fade-in group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={model.thumbnail || "/placeholder.svg"}
                  alt={model.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  {model.isFree ? (
                    <Badge className="bg-green-500 text-white">Free</Badge>
                  ) : (
                    <Badge className="bg-emerald-600 text-white">
                      <Coins className="w-3 h-3 mr-1" />
                      {model.tokenCost}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-500 text-white text-xs">{model.category}</Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {model.rating}
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {model.downloads}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {model.fileSize}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {model.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">by {model.author}</span>
                  <Button
                    onClick={() => handleDownload(model)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={!model.isFree && model.tokenCost! > userTokens}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
