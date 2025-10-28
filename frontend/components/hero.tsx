import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative h-[600px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=1920&auto=format&fit=crop"
          alt="Great Wall of China landscape"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Explore the World's Magnificent Landscapes
        </h1>
        <p className="mt-6 max-w-2xl text-lg">
          From ancient wonders to modern marvels, discover the world's most beautiful
          attractions and unique cultural experiences with Tripscape
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
            Start Planning
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/30">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
