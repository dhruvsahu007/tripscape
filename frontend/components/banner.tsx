import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Banner() {
  return (
    <section className="py-16 bg-gradient-to-r from-rose-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:w-1/2 p-8 md:p-12">
            <span className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
              Special Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Summer Sale - Up to 30% Off
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Book your dream vacation now and save big on selected destinations. Limited time offer!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Book Now
              </Button>
              <Button size="lg" variant="outline">
                View Deals
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-96 w-full">
            <Image
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop"
              alt="Travel destination"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
