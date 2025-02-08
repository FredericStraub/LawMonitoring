"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Change {
  date: string
  description: string
}

interface Committee {
  name: string
  role: string
  rapporteur?: {
    name: string
    date: string
    political_group: string
  }[]
}

interface Event {
  type: string
  date: string
  description: string
  docs?: {
    type: string
    title: string
    date: string
    url: string
  }[]
}

interface Law {
  title?: string
  stage_reached?: string
  instrument?: string | string[] | { [key: string]: any }
  last_change_date?: string
  reference?: string
  procedure?: {
    title?: string
    reference?: string
    type?: string
    status?: string
  }
  committees?: Array<{
    name?: string
    role?: string
    rapporteur?: Array<{
      name?: string
      date?: string
      political_group?: string
    }>
  }>
  events?: Array<{
    type?: string
    date?: string
    description?: string
    docs?: Array<{
      type?: string
      title?: string
      date?: string
      url?: string
    }>
  }>
  changes?: Record<string, string>
}

interface LawCardProps {
  law: Law
}

export function LawCard({ law }: LawCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isCompleted = law.stage_reached?.toLowerCase()?.includes('completed') ?? false

  const formatInstrument = (instrument: Law['instrument']) => {
    try {
      if (Array.isArray(instrument)) {
        return instrument.filter(Boolean).join(', ') || 'N/A'
      } else if (typeof instrument === 'object' && instrument !== null) {
        return JSON.stringify(instrument)
      }
      return instrument?.toString() || 'N/A'
    } catch (error) {
      console.error('Error formatting instrument:', error)
      return 'N/A'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="mb-4 cursor-pointer hover:shadow-lg transition-shadow relative">
          {isCompleted && (
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500" />
          )}
          <CardHeader>
            <CardTitle className="text-sm">{law.title || 'Untitled'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={isCompleted ? "success" : "secondary"}>
                {law.stage_reached || 'Status Unknown'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Reference: {law.reference || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                Last change: {law.last_change_date || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{law.title || 'Untitled'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Procedure Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Procedure Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Reference</h4>
                  <p>{law.procedure?.reference || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Type</h4>
                  <p>{law.procedure?.type || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <Badge variant={isCompleted ? "success" : "secondary"}>
                    {law.stage_reached || 'Status Unknown'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Instrument</h4>
                  <p>{formatInstrument(law.instrument)}</p>
                </div>
              </div>
            </div>

            {/* Committees */}
            {law.committees && law.committees.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Committees</h3>
                <div className="space-y-4">
                  {law.committees.map((committee, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <h4 className="font-medium">{committee.name || 'Unnamed Committee'}</h4>
                      <p className="text-sm text-muted-foreground">Role: {committee.role || 'N/A'}</p>
                      {committee.rapporteur && committee.rapporteur.length > 0 && (
                        committee.rapporteur.map((r, idx) => (
                          <div key={idx} className="mt-2 text-sm">
                            <p>Rapporteur: {r.name || 'N/A'}</p>
                            <p>Political Group: {r.political_group || 'N/A'}</p>
                            <p>Date: {r.date || 'N/A'}</p>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {law.events && law.events.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Events</h3>
                <div className="space-y-4">
                  {law.events.map((event, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <h4 className="font-medium">{event.type || 'Unnamed Event'}</h4>
                      <p className="text-sm">{event.description || 'No description available'}</p>
                      <p className="text-sm text-muted-foreground">Date: {event.date || 'N/A'}</p>
                      {event.docs && event.docs.length > 0 && (
                        <div className="mt-2">
                          <h5 className="font-medium text-sm">Related Documents</h5>
                          <ul className="list-disc list-inside text-sm">
                            {event.docs.map((doc, idx) => (
                              <li key={idx}>
                                {doc.url ? (
                                  <a 
                                    href={doc.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {doc.title || 'Untitled Document'}
                                  </a>
                                ) : (
                                  <span>{doc.title || 'Untitled Document'}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Changes */}
            {law.changes && Object.keys(law.changes).length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Changes</h3>
                <div className="space-y-2">
                  {Object.entries(law.changes).map(([date, description], index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <p className="text-sm font-medium">{date || 'Unknown Date'}</p>
                      <p className="text-sm text-muted-foreground">{description || 'No description available'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

