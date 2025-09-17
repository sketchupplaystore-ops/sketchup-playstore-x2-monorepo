"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock, User } from "lucide-react"

interface LoginPageProps {
  onLogin: (role: "admin" | "designer" | "client", userData: any) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "designer" as "admin" | "designer" | "client",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data based on role
    const userData = {
      id: Math.random(),
      name:
        formData.name ||
        (formData.role === "admin" ? "John Admin" : formData.role === "designer" ? "Sarah Wilson" : "Johnson Family"),
      email: formData.email,
      role: formData.role,
    }

    onLogin(formData.role, userData)
    setIsLoading(false)
  }

  const handleDemoLogin = (role: "admin" | "designer" | "client") => {
    const demoUsers = {
      admin: { name: "John Admin", email: "admin@demo.com" },
      designer: { name: "Sarah Wilson", email: "designer@demo.com" },
      client: { name: "Johnson Family", email: "client@demo.com" },
    }

    onLogin(role, { ...demoUsers[role], role, id: Math.random() })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">SketchUp Playstore</h1>
          <p className="text-slate-600">Landscape Design Management</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <p className="text-slate-600 text-center text-sm">
              {isLogin ? "Sign in to your account" : "Get started with your account"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-12 border-slate-200 focus:border-red-400 focus:ring-red-400/20 rounded-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 border-slate-200 focus:border-red-400 focus:ring-red-400/20 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12 border-slate-200 focus:border-red-400 focus:ring-red-400/20 focus:outline-none bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                    Role
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "admin" | "designer" | "client" })
                    }
                    className="w-full h-12 px-3 border border-slate-200 rounded-xl focus:border-red-400 focus:ring-red-400/20 focus:outline-none bg-white"
                  >
                    <option value="designer">Designer</option>
                    <option value="admin">Admin</option>
                    <option value="client">Client</option>
                  </select>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator className="bg-slate-200" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-500">
                OR TRY DEMO
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("admin")}
                className="h-10 text-xs border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-lg"
              >
                Admin Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("designer")}
                className="h-10 text-xs border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-lg"
              >
                Designer Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("client")}
                className="h-10 text-xs border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-lg"
              >
                Client Demo
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-600 hover:text-red-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
