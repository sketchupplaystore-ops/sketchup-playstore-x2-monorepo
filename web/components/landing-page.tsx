"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Users,
  Palette,
  Shield,
  ArrowRight,
  Play,
  Menu,
  X,
  Download,
  Home,
  TreePine,
  Sofa,
  Paintbrush,
  Plug,
  Sparkles,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: (role: "admin" | "designer" | "client" | "models" | "free-downloads" | "public-models") => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "AI-Powered Design",
      description: "Transform your landscape vision with cutting-edge AI tools and professional expertise.",
      delay: "0ms",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaborative Workflow",
      description: "Seamless collaboration between clients, designers, and project managers in real-time.",
      delay: "100ms",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Premium Quality",
      description: "Professional-grade 3D modeling, rendering, and project management for luxury landscapes.",
      delay: "200ms",
    },
  ]

  const libraryCategories = [
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Hardscape",
      description: "Pathways, decks, patios, and structural elements",
      count: "2,400+ models",
      delay: "0ms",
    },
    {
      icon: <Sofa className="h-8 w-8 text-emerald-600" />,
      title: "Outdoor Furniture",
      description: "Seating, dining sets, and outdoor accessories",
      count: "1,800+ models",
      delay: "100ms",
    },
    {
      icon: <TreePine className="h-8 w-8 text-emerald-600" />,
      title: "Plants & Shrubs",
      description: "Trees, bushes, flowers, and botanical elements",
      count: "3,200+ models",
      delay: "200ms",
    },
    {
      icon: <Paintbrush className="h-8 w-8 text-emerald-600" />,
      title: "Textures",
      description: "Materials, surfaces, and realistic textures",
      count: "1,500+ textures",
      delay: "300ms",
    },
    {
      icon: <Plug className="h-8 w-8 text-emerald-600" />,
      title: "Plugins",
      description: "SketchUp extensions and productivity tools",
      count: "150+ plugins",
      delay: "400ms",
    },
    {
      icon: <Home className="h-8 w-8 text-emerald-600" />,
      title: "ADU Plans",
      description: "Accessory dwelling unit designs and layouts",
      count: "200+ plans",
      delay: "500ms",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-emerald-600" />,
      title: "What's New",
      description: "Latest completed projects and fresh models",
      count: "Updated daily",
      delay: "600ms",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">LandscapeAI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onGetStarted("designer")}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Designer
              </button>
              <button
                onClick={() => onGetStarted("client")}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Client
              </button>
              <button
                onClick={() => onGetStarted("public-models")}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Download Models
              </button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => onGetStarted("public-models")}
              >
                <Download className="h-4 w-4" />
                Model Library
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4 animate-slide-down">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => onGetStarted("designer")}
                  className="text-muted-foreground hover:text-primary transition-colors py-2 text-left font-medium"
                >
                  Designer
                </button>
                <button
                  onClick={() => onGetStarted("client")}
                  className="text-muted-foreground hover:text-primary transition-colors py-2 text-left font-medium"
                >
                  Client
                </button>
                <button
                  onClick={() => onGetStarted("public-models")}
                  className="text-muted-foreground hover:text-primary transition-colors py-2 text-left font-medium"
                >
                  Download Models
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 justify-start bg-transparent"
                  onClick={() => onGetStarted("public-models")}
                >
                  <Download className="h-4 w-4" />
                  Model Library
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              AI-Powered Landscape Design Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Transform Your
              <span className="block bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                Landscape Vision
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional landscape design meets cutting-edge technology. Collaborate with expert designers to create
              stunning outdoor spaces with precision and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold hover-lift"
                onClick={() => onGetStarted("public-models")}
              >
                Download Free Models
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold hover-lift bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Role Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">Start Here</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Pick your role to get started with your landscape projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Designer Card */}
            <Card
              className="hover-lift border-0 shadow-xl animate-slide-up group cursor-pointer transition-all duration-500 hover:shadow-2xl relative overflow-hidden"
              onClick={() => onGetStarted("designer")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl">
                  <Palette className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-balance group-hover:text-primary transition-colors duration-300">
                  Designer
                </h3>
                <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
                  Upload work, track milestones, and collaborate with clients and admin, download free models
                </p>

                <Button
                  className="w-full group-hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg hover:shadow-2xl"
                  size="lg"
                >
                  Pick Job
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card
              className="hover-lift border-0 shadow-xl animate-slide-up group cursor-pointer transition-all duration-500 hover:shadow-2xl relative overflow-hidden"
              style={{ animationDelay: "100ms" }}
              onClick={() => onGetStarted("client")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-balance group-hover:text-primary transition-colors duration-300">
                  Client
                </h3>
                <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
                  Share project details, view progress, and download final files
                </p>

                <Button
                  className="w-full group-hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-400/90 hover:to-emerald-500/90 shadow-lg hover:shadow-2xl"
                  size="lg"
                >
                  Post Job
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SketchUp Model Library Section */}
      <section id="library" className="py-20 px-4 bg-gradient-to-b from-emerald-50/30 to-white relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">
              Download free landscape sketchup models
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Browse our comprehensive collection of high-quality 3D models, textures, and tools. Download instantly or
              use tokens for premium content. New models added from completed projects daily.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {libraryCategories.map((category, index) => (
              <Card
                key={index}
                className="hover-lift border-0 shadow-lg animate-slide-up group cursor-pointer transition-all duration-300"
                style={{ animationDelay: category.delay }}
                onClick={() => onGetStarted("public-models")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{category.description}</p>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold hover-lift"
                onClick={() => onGetStarted("public-models")}
              >
                <Download className="mr-2 h-5 w-5" />
                Access Full Library
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold hover-lift bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Free downloads available • Premium models with tokens • New content from completed projects • Compatible
              with SketchUp 2019+
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">LandscapeAI</span>
              </div>
              <p className="text-slate-300 text-pretty">
                Transforming outdoor spaces with AI-powered design and professional expertise.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#library" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Model Library
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2024 LandscapeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
