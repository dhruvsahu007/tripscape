"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIChatbot, { AIChatTeaser } from "./ai-chatbot"

const destinations = [
  "Dubai, UAE",
  "Bhutan",
  "Ladakh, India",
  "Kerala, India",
  "Rajasthan, India",
  "Himachal Pradesh, India",
  "Northeast India",
]

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Jaipur",
  "Dubai",
]

export default function Hero() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    dest: "",
    date: "",
    travelers: "",
  })

  const handleFormFill = (data: { dest: string; date: string; travelers: number }) => {
    setSearchData({
      dest: data.dest,
      date: data.date,
      travelers: data.travelers.toString(),
    })
    console.log("Auto-fill data:", data)
  }

  const handleSearch = () => {
    router.push('/packages')
  }

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
                    <select
                      value={searchData.dest}
                      onChange={(e) => setSearchData({ ...searchData, dest: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select destination</option>
                      {destinations.map((dest) => (
                        <option key={dest} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={searchData.date}
                      onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Travelers</label>
                    <select
                      value={searchData.travelers}
                      onChange={(e) => setSearchData({ ...searchData, travelers: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select travelers</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Person" : "People"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleSearch} className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
                </div>
              </TabsContent>
              <TabsContent value="hotels" className="mt-6">
                <div className="flex items-center justify-center py-12">
                  <p className="text-lg text-muted-foreground">Coming Soon...</p>
                </div>
              </TabsContent>
              <TabsContent value="flights" className="mt-6">
                <div className="flex items-center justify-center py-12">
                  <p className="text-lg text-muted-foreground">Coming Soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* AI Chatbot Widget */}
      <AIChatbot onFormFill={handleFormFill} />
    </section>
  )
}
