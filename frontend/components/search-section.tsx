"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Users, Plane } from "lucide-react"

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

export default function SearchSection() {
  const router = useRouter()
  const [tourDestination, setTourDestination] = useState("")
  const [tourDate, setTourDate] = useState("")
  const [tourTravelers, setTourTravelers] = useState("")

  const handleTourSearch = () => {
    // Navigate to packages page with query params
    router.push('/packages')
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-16 relative z-10">
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
                  value={tourDestination} 
                  onChange={(e) => setTourDestination(e.target.value)}
                  className="relative z-50 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ pointerEvents: 'auto' }}
                >
                  <option value="">Select destination</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <select
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select date</option>
                  <option value="december-2025">December 2025</option>
                  <option value="january-2026">January 2026</option>
                  <option value="february-2026">February 2026</option>
                  <option value="march-2026">March 2026</option>
                  <option value="april-2026">April 2026</option>
                  <option value="may-2026">May 2026</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Travelers</label>
                <select
                  value={tourTravelers}
                  onChange={(e) => setTourTravelers(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select travelers</option>
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4 Travelers</option>
                  <option value="5">5+ Travelers</option>
                </select>
              </div>
              <Button onClick={handleTourSearch} className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
            </div>
          </TabsContent>
          <TabsContent value="hotels" className="mt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city.toLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in/Check-out</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select dates</option>
                  <option value="dec-15-20">Dec 15 - Dec 20</option>
                  <option value="dec-20-25">Dec 20 - Dec 25</option>
                  <option value="jan-1-5">Jan 1 - Jan 5</option>
                  <option value="jan-15-20">Jan 15 - Jan 20</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rooms & Guests</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select rooms</option>
                  <option value="1-2">1 Room, 2 Guests</option>
                  <option value="2-4">2 Rooms, 4 Guests</option>
                  <option value="3-6">3 Rooms, 6 Guests</option>
                </select>
              </div>
              <Button onClick={() => router.push('/packages')} className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
            </div>
          </TabsContent>
          <TabsContent value="flights" className="mt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Departure</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={`dep-${city}`} value={city.toLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={`arr-${city}`} value={city.toLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select date</option>
                  <option value="dec-15">December 15, 2025</option>
                  <option value="dec-20">December 20, 2025</option>
                  <option value="jan-1">January 1, 2026</option>
                  <option value="jan-15">January 15, 2026</option>
                </select>
              </div>
              <Button onClick={() => router.push('/packages')} className="mt-auto bg-rose-600 hover:bg-rose-700">Search</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
