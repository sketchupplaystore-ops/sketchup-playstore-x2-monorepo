"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, Search, Star, Eye, Calendar, Coins, Grid, List, Home } from "lucide-react"

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

const mockModels: SketchUpModel[] = [
  // Hardscape
  {
    id: "1",
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
    id: "2",
    name: "Luxury Pool Deck",
    description: "Premium pool deck with integrated lighting",
    category: "Hardscape",
    thumbnail: "/luxury-pool-deck-with-lighting.jpg",
    downloadUrl: "/models/pool-deck.skp",
    fileSize: "5.1 MB",
    downloads: 890,
    rating: 4.9,
    uploadDate: "2024-01-10",
    isFree: false,
    tokenCost: 5,
    tags: ["pool", "deck", "luxury", "lighting"],
    author: "Sharon Davis",
  },
  // Outdoor Furniture
  {
    id: "3",
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
    id: "4",
    name: "Modern Lounge Chairs",
    description: "Contemporary outdoor lounge seating",
    category: "Outdoor Furniture",
    thumbnail: "/modern-outdoor-lounge-chairs.jpg",
    downloadUrl: "/models/lounge-chairs.skp",
    fileSize: "1.8 MB",
    downloads: 1650,
    rating: 4.6,
    uploadDate: "2024-01-08",
    isFree: false,
    tokenCost: 3,
    tags: ["lounge", "modern", "seating"],
    author: "James Wilson",
  },
  // Plants & Shrubs
  {
    id: "5",
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
    id: "7",
    name: "Modern Studio ADU",
    description: "Contemporary 400 sq ft studio accessory dwelling unit",
    category: "ADU",
    thumbnail: "/placeholder-axuw3.png",
    downloadUrl: "/models/modern-studio-adu.skp",
    fileSize: "8.2 MB",
    downloads: 680,
    rating: 4.8,
    uploadDate: "2024-01-18",
    isFree: false,
    tokenCost: 8,
    tags: ["adu", "studio", "modern", "small"],
    author: "Maria Rodriguez",
  },
  {
    id: "8",
    name: "Two-Bedroom ADU Plan",
    description: "Spacious 800 sq ft two-bedroom accessory dwelling unit",
    category: "ADU",
    thumbnail: "/placeholder-w41ek.png",
    downloadUrl: "/models/two-bedroom-adu.skp",
    fileSize: "12.1 MB",
    downloads: 420,
    rating: 4.9,
    uploadDate: "2024-01-20",
    isFree: false,
    tokenCost: 12,
    tags: ["adu", "two-bedroom", "family", "spacious"],
    author: "David Kim",
  },
  {
    id: "9",
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
    id: "10",
    name: "Garage Conversion ADU",
    description: "Complete garage to ADU conversion plan",
    category: "ADU",
    thumbnail: "/placeholder-p35cs.png",
    downloadUrl: "/models/garage-conversion-adu.skp",
    fileSize: "9.5 MB",
    downloads: 730,
    rating: 4.6,
    uploadDate: "2024-01-14",
    isFree: false,
    tokenCost: 7,
    tags: ["adu", "garage", "conversion", "renovation"],
    author: "Michael Chen",
  },
  // Textures
  {
    id: "11",
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
    id: "12",
    name: "Wood Grain Collection",
    description: "Premium wood textures for outdoor applications",
    category: "Textures",
    thumbnail: "/placeholder-b6flk.png",
    downloadUrl: "/models/wood-textures.zip",
    fileSize: "38.7 MB",
    downloads: 1950,
    rating: 4.7,
    uploadDate: "2024-01-10",
    isFree: false,
    tokenCost: 4,
    tags: ["wood", "grain", "texture", "outdoor"],
    author: "Texture Studio",
  },
  // Plugins
  {
    id: "13",
    name: "Landscape Generator Pro",
    description: "Advanced terrain and landscape generation plugin",
    category: "Plugins",
    thumbnail: "/placeholder-uuki9.png",
    downloadUrl: "/plugins/landscape-generator.rbz",
    fileSize: "15.3 MB",
    downloads: 1200,
    rating: 4.9,
    uploadDate: "2024-01-15",
    isFree: false,
    tokenCost: 15,
    tags: ["plugin", "landscape", "terrain", "generator"],
    author: "SketchUp Extensions",
  },
  {
    id: "14",
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
  // Others category models
  {
    id: "15",
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
    id: "16",
    name: "Garden Tool Shed",
    description: "Compact storage shed for garden tools and equipment",
    category: "Others",
    thumbnail: "/garden-tool-shed.jpg",
    downloadUrl: "/models/tool-shed.skp",
    fileSize: "4.8 MB",
    downloads: 890,
    rating: 4.5,
    uploadDate: "2024-01-13",
    isFree: false,
    tokenCost: 6,
    tags: ["shed", "storage", "tools", "garden"],
    author: "Storage Solutions",
  },
  {
    id: "17",
    name: "Irrigation System Components",
    description: "Sprinkler heads, pipes, and irrigation system parts",
    category: "Others",
    thumbnail: "/irrigation-sprinkler-system.jpg",
    downloadUrl: "/models/irrigation-system.skp",
    fileSize: "6.1 MB",
    downloads: 720,
    rating: 4.8,
    uploadDate: "2024-01-11",
    isFree: true,
    tags: ["irrigation", "sprinkler", "water", "system"],
    author: "Water Works",
  },
  // What's New (Completed Projects)
  {
    id: "6",
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
  { id: "all", name: "All Categories", icon: Grid },
  { id: "Hardscape", name: "Hardscape", icon: Grid },
  { id: "Outdoor Furniture", name: "Outdoor Furniture", icon: Grid },
  { id: "Plants & Shrubs", name: "Plants & Shrubs", icon: Grid },
  { id: "Textures", name: "Textures", icon: Grid },
  { id: "Plugins", name: "Plugins", icon: Grid },
  { id: "ADU", name: "ADU Plans", icon: Home },
  { id: "Others", name: "Others", icon: Grid },
  { id: "What's New", name: "What's New", icon: Star },
]

export default function SketchUpPlaystore() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [userTokens, setUserTokens] = useState(25) // Mock user tokens
  const [filteredModels, setFilteredModels] = useState(mockModels)
  const [completedProjects, setCompletedProjects] = useState<SketchUpModel[]>([])

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("completedProjects") || "[]")
    setCompletedProjects(storedProjects)
  }, [])

  useEffect(() => {
    const allModels = [...mockModels, ...completedProjects]
    let filtered = allModels

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
  }, [selectedCategory, searchQuery, completedProjects])

  const handleDownload = (model: SketchUpModel) => {
    if (!model.isFree && model.tokenCost) {
      if (userTokens >= model.tokenCost) {
        setUserTokens((prev) => prev - model.tokenCost!)
        // Simulate download
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
    if (categoryId === "all") return mockModels.length + completedProjects.length
    return [...mockModels, ...completedProjects].filter((model) => model.category === categoryId).length
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
                <h1 className="text-2xl font-bold text-emerald-900">SketchUp Playstore</h1>
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
                onClick={() => (window.location.href = "/")}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search models, ADUs, textures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>

              <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="glass hover-lift">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = getCategoryCount(category.id)
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-emerald-900 mb-2">
                {selectedCategory === "all" ? "All Models" : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">{filteredModels.length} models available</p>
              {selectedCategory === "ADU" && (
                <p className="text-sm text-emerald-600 mt-1">
                  Professional ADU plans and designs for accessory dwelling units
                </p>
              )}
            </div>

            {/* Models Grid */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      {model.category === "ADU" && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-500 text-white">
                            <Home className="w-3 h-3 mr-1" />
                            ADU
                          </Badge>
                        </div>
                      )}
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
            ) : (
              // List View
              <div className="space-y-4">
                {filteredModels.map((model) => (
                  <Card key={model.id} className="glass hover-lift animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <img
                          src={model.thumbnail || "/placeholder.svg"}
                          alt={model.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-semibold text-emerald-900">{model.name}</h3>
                                {model.category === "ADU" && (
                                  <Badge className="bg-blue-500 text-white text-xs">
                                    <Home className="w-3 h-3 mr-1" />
                                    ADU
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">{model.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  {model.rating}
                                </div>
                                <div className="flex items-center">
                                  <Download className="w-4 h-4 mr-1" />
                                  {model.downloads}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(model.uploadDate).toLocaleDateString()}
                                </div>
                                <span>by {model.author}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              {model.isFree ? (
                                <Badge className="bg-green-500 text-white">Free</Badge>
                              ) : (
                                <Badge className="bg-emerald-600 text-white">
                                  <Coins className="w-3 h-3 mr-1" />
                                  {model.tokenCost}
                                </Badge>
                              )}

                              <Button
                                onClick={() => handleDownload(model)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={!model.isFree && model.tokenCost! > userTokens}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

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
      </div>
    </div>
  )
}

export { SketchUpPlaystore }
