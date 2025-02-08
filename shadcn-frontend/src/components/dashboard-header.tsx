import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Law Dashboard</h1>
      <ModeToggle />
    </header>
  )
}

