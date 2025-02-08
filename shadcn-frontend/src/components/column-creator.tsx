"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

interface ColumnCreatorProps {
  categories: string[]
  onAddColumn: (category: string, subcategory: string) => void
}

export function ColumnCreator({ categories, onAddColumn }: ColumnCreatorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        try {
          const response = await fetch(`${API_URL}/api/subcategories?category=${encodeURIComponent(selectedCategory)}`)
          if (!response.ok) {
            throw new Error("Failed to fetch subcategories")
          }
          const data = await response.json()
          setSubcategories(data)
        } catch (error) {
          console.error("Error fetching subcategories:", error)
          toast({
            title: "Error",
            description: "Failed to load subcategories. Please try again later.",
            variant: "destructive",
          })
        }
      }

      fetchSubcategories()
    }
  }, [selectedCategory, toast])

  const handleAddColumn = () => {
    if (selectedCategory && selectedSubcategory) {
      onAddColumn(selectedCategory, selectedSubcategory)
      setSelectedCategory("")
      setSelectedSubcategory("")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory && (
            <Select onValueChange={setSelectedSubcategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button onClick={handleAddColumn} disabled={!selectedCategory || !selectedSubcategory}>
          Add Column
        </Button>
      </DialogContent>
    </Dialog>
  )
}

