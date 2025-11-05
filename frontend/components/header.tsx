import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Jetsetwonders Logo" 
            width={64} 
            height={64}
            className="h-16 w-16"
          />
          <span className="text-xl font-bold">Jetsetwonders</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/#destinations" className="text-sm font-medium transition-colors hover:text-rose-600">
            Destinations
          </Link>
          <Link href="/packages" className="text-sm font-medium transition-colors hover:text-rose-600">
            Packages
          </Link>
          <Link href="/#tips" className="text-sm font-medium transition-colors hover:text-rose-600">
            Travel Tips
          </Link>
          <Link href="/#testimonials" className="text-sm font-medium transition-colors hover:text-rose-600">
            Reviews
          </Link>
          <Link href="/#contact" className="text-sm font-medium transition-colors hover:text-rose-600">
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
            Sign In
          </Button>
          <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
            Book Now
          </Button>
        </div>
      </div>
    </header>
  )
}
