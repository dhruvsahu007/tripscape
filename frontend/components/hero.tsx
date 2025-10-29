"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Users, Plane } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative h-screen w-full">
        <Image
          src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=1920&auto=format&fit=crop"
          alt="Beautiful travel destination landscape"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white mb-16">
          Explore the World's Magnificent Landscapes
        </h1>
        
        {/* Search Section */}
        <div className="w-full max-w-6xl">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <Tabs defaultValue="tours" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tours">Tours</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="flights">Flights</TabsTrigger>
              </TabsList>
              <TabsContent value="tours" className="mt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select destination</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select date</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Travelers</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select travelers</span>
                    </div>
                  </div>
                  <Button className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
                </div>
              </TabsContent>
              <TabsContent value="hotels" className="mt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select city</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-in/Check-out</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select dates</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rooms & Guests</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select rooms</span>
                    </div>
                  </div>
                  <Button className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
                </div>
              </TabsContent>
              <TabsContent value="flights" className="mt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departure</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select city</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select city</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select date</span>
                    </div>
                  </div>
                  <Button className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
