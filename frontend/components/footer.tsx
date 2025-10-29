import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Tripscape Logo" 
                width={40} 
                height={40}
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">Tripscape</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Providing comprehensive travel information and services to make your journey more convenient and
              enjoyable.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Destinations</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Delhi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Jaipur
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Goa
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Kerala
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Travel Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Hotel Booking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Flight Booking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Custom Travel
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Travel Insurance
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">About Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Company Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Join Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-rose-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="https://ai.dreamthere.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-rose-600"
                >
                  AI Navigation
                </Link>
              </li>
              <li>
                <Link
                  href="https://qiqu.dreamthere.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-rose-600"
                >
                  Interesting Sites
                </Link>
              </li>
              <li>
                <Link
                  href="https://nav.dreamthere.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-rose-600"
                >
                  Dream Navigation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tripscape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
