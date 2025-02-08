"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ColumnCreator } from "@/components/column-creator"
import { LawColumn } from "@/components/law-column"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider } from "@/components/ui/toast"

import { API_URL } from '@/config'

export default function DashboardPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [columns, setColumns] = useState<{ id: string; category: string; subcategory: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`)
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  const addColumn = (category: string, subcategory: string) => {
    setColumns((prev) => [...prev, { id: Date.now().toString(), category, subcategory }])
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <ToastProvider>
      <div className="container mx-auto p-4">
        <DashboardHeader />
        <div className="mb-4">
          <ColumnCreator categories={categories} onAddColumn={addColumn} />
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {columns.map((column) => (
            <LawColumn key={column.id} category={column.category} subcategory={column.subcategory} />
          ))}
        </div>
      </div>
    </ToastProvider>
  )
}

