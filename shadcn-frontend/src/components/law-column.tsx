"use client"

import { useState, useEffect } from "react"
import { LawCard } from "@/components/law-card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

interface Law {
  title: string
  stage_reached: string
  instrument: string
  last_change_date: string
}

interface LawColumnProps {
  category: string
  subcategory: string
}

export function LawColumn({ category, subcategory }: LawColumnProps) {
  const [laws, setLaws] = useState<Law[]>([])
  const [filteredLaws, setFilteredLaws] = useState<Law[]>([])
  const [filter, setFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/laws?category=${encodeURIComponent(category)}&sub_category=${encodeURIComponent(subcategory)}`,
        )
        if (!response.ok) {
          throw new Error("Failed to fetch laws")
        }
        const data = await response.json()
        setLaws(data)
        setFilteredLaws(data)
      } catch (error) {
        console.error("Error fetching laws:", error)
        toast({
          title: "Error",
          description: "Failed to load laws. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLaws()
  }, [category, subcategory, toast])

  useEffect(() => {
    const lowercasedFilter = filter.toLowerCase()
    const filtered = laws.filter(
      (law) =>
        law.title.toLowerCase().includes(lowercasedFilter) ||
        law.stage_reached.toLowerCase().includes(lowercasedFilter) ||
        law.instrument.toLowerCase().includes(lowercasedFilter),
    )
    setFilteredLaws(filtered)
  }, [filter, laws])

  if (isLoading) {
    return <div className="w-80 flex-shrink-0 bg-card rounded-lg shadow-md p-4">Loading...</div>
  }

  return (
    <div className="w-80 flex-shrink-0 bg-card rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">{subcategory}</h2>
      <Input placeholder="Filter laws..." value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-4" />
      <ScrollArea className="h-[calc(100vh-200px)]">
        {filteredLaws.map((law, index) => (
          <LawCard key={index} law={law} />
        ))}
      </ScrollArea>
    </div>
  )
}

