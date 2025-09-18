"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download,
  Search,
  Star,
  Eye,
  Grid,
  Home,
  TreePine,
  Sofa,
  Paintbrush,
  Plug,
  Shield,
  ArrowRight,
} from "lucide-react"

interface FreeModel {
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
  tags: string[]
  author: string
  slug?: string
}

interface CategoryData {
  id: string
  name: string
  count: number
  slug?: string
}

interface ApiResponse {
  models: FreeModel[]
  categories: CategoryData[]
}

const freeModels: FreeModel[] = [
  // Hardscape - Free Models
  {
    id: "free-1",
    name: "Modern Stone Pathway",
    description: "Contemporary stone pathway with natural textures",
    category: "Hardscape",
    thumbnail: "/modern-stone-pathway-landscape.jpg",
    downloadUrl: "/models/stone-pathway.skp",
    fileSize: "2.4 MB",
    downloads: 1250,
    rating: 4.8,
    uploadDate: "2024-01-15",
    tags: ["pathway", "stone", "modern"],
    author: "James Wilson",
  },
  {
    id: "free-2",
    name: "Brick Patio Design",
    description: "Classic brick patio with herringbone pattern",
    category: "Hardscape",
    thumbnail: "/brick-patio-herringbone-pattern.jpg",
    downloadUrl: "/models/brick-patio.skp",
    fileSize: "3.1 MB",
    downloads: 890,
    rating: 4.7,
    uploadDate: "2024-01-12",
    tags: ["patio", "brick", "herringbone"],
    author: "Sarah Davis",
  },
  {
    id: "free-3",
    name: "Wooden Deck Platform",
    description: "Simple wooden deck with railings",
    category: "Hardscape",
    thumbnail: "/wooden-deck-platform-railings.jpg",
    downloadUrl: "/models/wooden-deck.skp",
    fileSize: "2.8 MB",
    downloads: 1100,
    rating: 4.6,
    uploadDate: "2024-01-10",
    tags: ["deck", "wood", "railings"],
    author: "Mike Johnson",
  },

  // Outdoor Furniture - Free Models
  {
    id: "free-4",
    name: "Teak Dining Set",
    description: "Premium teak outdoor dining furniture set",
    category: "Outdoor Furniture",
    thumbnail: "/teak-outdoor-dining-furniture-set.jpg",
    downloadUrl: "/models/teak-dining.skp",
    fileSize: "3.2 MB",
    downloads: 2100,
    rating: 4.7,
    uploadDate: "2024-01-12",
    tags: ["dining", "teak", "furniture"],
    author: "Dennis Chen",
  },
  {
    id: "free-5",
    name: "Garden Bench Collection",
    description: "Various styles of outdoor garden benches",
    category: "Outdoor Furniture",
    thumbnail: "/garden-bench-collection-outdoor.jpg",
    downloadUrl: "/models/garden-benches.skp",
    fileSize: "4.1 MB",
    downloads: 1650,
    rating: 4.8,
    uploadDate: "2024-01-14",
    tags: ["bench", "garden", "seating"],
    author: "Lisa Park",
  },
  {
    id: "free-6",
    name: "Outdoor Umbrella Set",
    description: "Patio umbrellas in different sizes and colors",
    category: "Outdoor Furniture",
    thumbnail: "/patio-umbrella-outdoor-furniture.jpg",
    downloadUrl: "/models/umbrellas.skp",
    fileSize: "2.3 MB",
    downloads: 980,
    rating: 4.5,
    uploadDate: "2024-01-08",
    tags: ["umbrella", "patio", "shade"],
    author: "Tom Wilson",
  },

  // Plants & Shrubs - Free Models
  {
    id: "free-7",
    name: "Japanese Maple Collection",
    description: "Detailed Japanese maple trees in various sizes",
    category: "Plants & Shrubs",
    thumbnail: "/japanese-maple-trees-collection.jpg",
    downloadUrl: "/models/japanese-maple.skp",
    fileSize: "4.7 MB",
    downloads: 3200,
    rating: 4.9,
    uploadDate: "2024-01-14",
    tags: ["maple", "trees", "japanese"],
    author: "Sharon Davis",
  },
  {
    id: "free-8",
    name: "Rose Garden Collection",
    description: "Beautiful rose bushes and climbing roses",
    category: "Plants & Shrubs",
    thumbnail: "/rose-garden-bushes-climbing-roses.jpg",
    downloadUrl: "/models/roses.skp",
    fileSize: "5.2 MB",
    downloads: 2800,
    rating: 4.8,
    uploadDate: "2024-01-16",
    tags: ["roses", "garden", "flowers"],
    author: "Emma Rodriguez",
  },
  {
    id: "free-9",
    name: "Evergreen Tree Pack",
    description: "Pine, spruce, and fir trees for landscaping",
    category: "Plants & Shrubs",
    thumbnail: "/evergreen-pine-spruce-fir-trees.jpg",
    downloadUrl: "/models/evergreens.skp",
    fileSize: "6.1 MB",
    downloads: 2400,
    rating: 4.7,
    uploadDate: "2024-01-11",
    tags: ["evergreen", "pine", "trees"],
    author: "Forest Design",
  },

  // Textures - Free Models
  {
    id: "free-10",
    name: "Natural Stone Textures Pack",
    description: "High-resolution stone and rock texture collection",
    category: "Textures",
    thumbnail: "/placeholder-1lqik.png",
    downloadUrl: "/models/stone-textures.zip",
    fileSize: "45.2 MB",
    downloads: 2800,
    rating: 4.8,
    uploadDate: "2024-01-12",
    tags: ["stone", "texture", "natural", "pack"],
    author: "Texture Studio",
  },
  {
    id: "free-11",
    name: "Grass Texture Collection",
    description: "Various grass textures for lawns and fields",
    category: "Textures",
    thumbnail: "/grass-texture-lawn-field-green.jpg",
    downloadUrl: "/models/grass-textures.zip",
    fileSize: "32.4 MB",
    downloads: 3100,
    rating: 4.9,
    uploadDate: "2024-01-15",
    tags: ["grass", "lawn", "texture"],
    author: "Green Textures",
  },

  // Plugins - Free Models
  {
    id: "free-12",
    name: "Plant Library Manager",
    description: "Organize and manage your plant component library",
    category: "Plugins",
    thumbnail: "/placeholder-p8w48.png",
    downloadUrl: "/plugins/plant-manager.rbz",
    fileSize: "8.9 MB",
    downloads: 850,
    rating: 4.6,
    uploadDate: "2024-01-08",
    tags: ["plugin", "plants", "library", "manager"],
    author: "Garden Tools",
  },
  {
    id: "free-13",
    name: "Terrain Generator Lite",
    description: "Basic terrain generation tool for landscapes",
    category: "Plugins",
    thumbnail: "/terrain-generator-landscape-tool.jpg",
    downloadUrl: "/plugins/terrain-lite.rbz",
    fileSize: "12.1 MB",
    downloads: 1200,
    rating: 4.7,
    uploadDate: "2024-01-13",
    tags: ["plugin", "terrain", "landscape"],
    author: "Terrain Tools",
  },

  // ADU Plans - Free Models
  {
    id: "free-14",
    name: "Tiny House ADU",
    description: "Compact 250 sq ft tiny house design with loft",
    category: "ADU",
    thumbnail: "/placeholder-2hsen.png",
    downloadUrl: "/models/tiny-house-adu.skp",
    fileSize: "6.8 MB",
    downloads: 950,
    rating: 4.7,
    uploadDate: "2024-01-16",
    tags: ["adu", "tiny", "loft", "compact"],
    author: "Sarah Johnson",
  },
  {
    id: "free-15",
    name: "Basic Studio ADU",
    description: "Simple 300 sq ft studio accessory dwelling unit",
    category: "ADU",
    thumbnail: "/studio-adu-simple-design-300-sqft.jpg",
    downloadUrl: "/models/basic-studio-adu.skp",
    fileSize: "5.4 MB",
    downloads: 720,
    rating: 4.5,
    uploadDate: "2024-01-09",
    tags: ["adu", "studio", "basic"],
    author: "ADU Designs",
  },

  // Others - Free Models
  {
    id: "free-16",
    name: "Outdoor Lighting Kit",
    description: "Complete outdoor lighting system with fixtures and wiring",
    category: "Others",
    thumbnail: "/outdoor-lighting-fixtures.jpg",
    downloadUrl: "/models/outdoor-lighting.skp",
    fileSize: "7.2 MB",
    downloads: 1150,
    rating: 4.7,
    uploadDate: "2024-01-17",
    tags: ["lighting", "outdoor", "fixtures", "electrical"],
    author: "Lighting Pro",
  },
  {
    id: "free-17",
    name: "Irrigation System Components",
    description: "Sprinkler heads, pipes, and irrigation system parts",
    category: "Others",
    thumbnail: "/irrigation-sprinkler-system.jpg",
    downloadUrl: "/models/irrigation-system.skp",
    fileSize: "6.1 MB",
    downloads: 720,
    rating: 4.8,
    uploadDate: "2024-01-11",
    tags: ["irrigation", "sprinkler", "water", "system"],
    author: "Water Works",
  },
  {
    id: "free-18",
    name: "Garden Tool Shed",
    description: "Compact storage shed for garden tools and equipment",
    category: "Others",
    thumbnail: "/garden-tool-shed.jpg",
    downloadUrl: "/models/tool-shed.skp",
    fileSize: "4.8 MB",
    downloads: 890,
    rating: 4.5,
    uploadDate: "2024-01-13",
    tags: ["shed", "storage", "tools", "garden"],
    author: "Storage Solutions",
  },
]

// Map category IDs to icons
const categoryIcons: Record<string, any> = {
  "all": Grid,
  "Hardscape": Shield,
  "Outdoor Furniture": Sofa,
  "Plants & Shrubs": TreePine,
  "Textures": Paintbrush,
  "Plugins": Plug,
  "ADU": Home,
  "Others": Grid,
}

// Map category IDs to colors
const categoryColors: Record<string, string> = {
  "all": "bg-slate-100",
  "Hardscape": "bg-stone-100",
  "Outdoor Furniture": "bg-amber-100",
  "Plants & Shrubs": "bg-green-100",
  "Textures": "bg-purple-100",
  "Plugins": "bg-blue-100",
  "ADU": "bg-indigo-100",
  "Others": "bg-gray-100",
}

interface FreeDownloadsPageProps {
  onNavigate: (page: string) => void
}

export function FreeDownloadsPage({ onNavigate }: FreeDownloadsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [models, setModels] = useState<FreeModel[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [filteredModels, setFilteredModels] = useState<FreeModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://www.sketchupplaystore.com/api/public/models');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status}`);
        }
        
        const data = await response.json() as ApiResponse;
        
        // Validate response data structure
        if (!Array.isArray(data?.models) || !Array.isArray(data?.categories)) {
          throw new Error('Invalid API response format');
        }
        
        // Process and validate models
        const validatedModels = data.models.map(model => ({
          ...model,
          // Ensure all models have required fields
          id: model.id || `model-${Math.random().toString(36).substr(2, 9)}`,
          name: model.name || 'Untitled Model',
          description: model.description || 'No description available',
          category: model.category || 'Others',
          thumbnail: model.thumbnail || '/placeholder.svg',
          downloadUrl: model.downloadUrl || '#',
          fileSize: model.fileSize || 'Unknown',
          downloads: model.downloads || 0,
          rating: model.rating || 0,
          uploadDate: model.uploadDate || new Date().toISOString().split('T')[0],
          tags: Array.isArray(model.tags) ? model.tags : [],
          author: model.author || 'Unknown Author',
        }));
        
        setModels(validatedModels);
        setCategories(data.categories);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
        
        // Fallback to mock data if API fails
        setModels(freeModels);
        
        // Create categories from mock data if needed
        if (categories.length === 0) {
          const uniqueCategories = Array.from(new Set(freeModels.map(model => model.category)));
          const mockCategories: CategoryData[] = uniqueCategories.map(name => ({
            id: name,
            name,
            count: freeModels.filter(model => model.category === name).length,
            slug: name.toLowerCase().replace(/\s+/g, '-')
          }));
          setCategories(mockCategories);
        }
      }
    };
    
    fetchModels();
  }, [categories.length]);
  
  // Filter models based on category and search query
  useEffect(() => {
    if (!models.length) return;
    
    let filtered = models;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((model) => model.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    setFilteredModels(filtered);
  }, [selectedCategory, searchQuery, models]);

  const handleDownload = (model: FreeModel) => {
    if (!model?.downloadUrl) {
      alert('Download URL not available');
      return;
    }
    
    try {
      // Create full URL if it's not already absolute
      const downloadUrl = model.downloadUrl.startsWith('http') 
        ? model.downloadUrl 
        : `https://www.sketchupplaystore.com${model.downloadUrl}`;
      
      // Create and click download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${model.name || 'sketchup-model'}.skp`;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Show success message
      alert(`Downloading ${model.name}...`);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Please try again.');
    }
  }

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return models.length;
    
    // Try to find the category in the API response first
    const category = categories.find(cat => cat.id === categoryId);
    if (category && typeof category.count === 'number') {
      return category.count;
    }
    
    // Fallback to counting models
    return models.filter((model) => model.category === categoryId).length;
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
                <h1 className="text-2xl font-bold text-emerald-900">Free Landscape Models</h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                100% Free Downloads
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
                  placeholder="Search free models..."
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-emerald-900 mb-4">Download Free Landscape SketchUp Models</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional-quality landscape models, completely free. No tokens required, no registration needed. Just
            click and download to enhance your landscape designs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Download className="w-4 h-4 mr-2" />
              {models.length} Free Models
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Professional Quality
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              No Registration Required
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Always include "All Categories" option */}
            <Button
              key="all"
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`gap-2 ${selectedCategory === "all" ? "bg-emerald-600 text-white" : "hover:bg-emerald-50"}`}
              onClick={() => setSelectedCategory("all")}
            >
              <Grid className="w-4 h-4" />
              All Categories
              <Badge variant="secondary" className="text-xs ml-1">
                {models.length}
              </Badge>
            </Button>
            
            {/* Map through API categories */}
            {categories.map((category) => {
              // Get icon from mapping or fallback to Grid
              const Icon = categoryIcons[category.id] || Grid;
              const count = category.count || getCategoryCount(category.id);
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-emerald-700 font-medium">Loading models...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
            <p className="text-lg text-red-700 font-medium mb-2">Error loading models</p>
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        )}
        
        {/* Models Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id} className="glass hover-lift animate-fade-in group cursor-pointer" 
                onClick={() => {
                  // Navigate to model detail page using slug or id
                  const modelSlug = model.slug || model.id;
                  window.open(`https://www.sketchupplaystore.com/models/${modelSlug}`, '_blank');
                }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={model.thumbnail 
                      ? (model.thumbnail.startsWith('http') 
                        ? model.thumbnail 
                        : `https://www.sketchupplaystore.com${model.thumbnail}`)
                      : '/placeholder.svg'
                    }
                    alt={model.name || 'SketchUp Model'}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white">Free</Badge>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(model);
                      }} 
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredModels.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">Need More Models?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our full library with premium models, textures, and plugins. Use tokens for exclusive content or
            browse thousands more free options.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onNavigate("playstore")}>
            <Grid className="w-5 h-5 mr-2" />
            Browse Full Library
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add default export for better compatibility
export default FreeDownloadsPage;