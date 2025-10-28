import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { destinationsData } from "@/data/destinations"

export default function Destinations() {
  return (
    <section id="destinations" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular Destinations</h2>
        <p className="mt-4 max-w-[85%] text-muted-foreground">
          Explore the world's most popular tourist attractions, from historical landmarks to natural wonders
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinationsData.map((destination, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{destination.name}</CardTitle>
              <CardDescription>{destination.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button variant="outline">View More Destinations</Button>
      </div>
    </section>
  )
}
