"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Star, Check, X } from "lucide-react"

const packages = [
  {
    id: "pkg-001",
    name: "Exotic Dubai Escape",
    destination: "Dubai, UAE",
    price: 95999,
    originalPrice: 120000,
    duration: "5 Nights / 6 Days",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1920&auto=format&fit=crop",
    rating: 4.9,
    reviews: 245,
    availableDates: ["Nov 15, 2025", "Dec 10, 2025", "Jan 20, 2026"],
    groupSize: "2-10 people",
    difficulty: "Easy",
    suitableFor: ["Couples", "Families", "Youth"],
    highlights: [
      "Burj Khalifa entry with observation deck",
      "Desert safari with BBQ dinner",
      "Dubai Mall shopping tour",
      "Dhow cruise with dinner",
      "Gold Souk and Spice Souk visit",
      "Palm Jumeirah photo stop"
    ],
    inclusions: [
      "Return flights from major Indian cities",
      "5 nights in 4-star hotel (twin sharing)",
      "Daily breakfast and dinner",
      "UAE visa assistance",
      "Airport transfers",
      "City tours with guide",
      "Desert safari experience",
      "Travel insurance"
    ],
    exclusions: [
      "Lunch and personal meals",
      "Optional activities and tours",
      "Personal expenses and shopping",
      "Tips and gratuities",
      "Alcoholic beverages"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Dubai", description: "Airport pickup, hotel check-in, evening at leisure" },
      { day: 2, title: "Dubai City Tour", description: "Visit Burj Khalifa, Dubai Mall, Dubai Fountain" },
      { day: 3, title: "Desert Safari", description: "Dune bashing, camel ride, BBQ dinner with entertainment" },
      { day: 4, title: "Dubai Marina & Dhow Cruise", description: "Marina walk, evening dhow cruise with dinner" },
      { day: 5, title: "Shopping & Leisure", description: "Gold Souk, Spice Souk, free time for shopping" },
      { day: 6, title: "Departure", description: "Hotel checkout, airport drop" }
    ]
  },
  {
    id: "pkg-002",
    name: "Bhutan Bliss Tour",
    destination: "Thimphu, Paro, Phuntsholing",
    price: 25999,
    originalPrice: 32000,
    duration: "6 Nights / 7 Days",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1920&auto=format&fit=crop",
    rating: 4.8,
    reviews: 156,
    availableDates: ["Fixed: Nov 2, 2025"],
    groupSize: "4-15 people",
    difficulty: "Moderate",
    suitableFor: ["Solo Travelers", "Families", "Culture Enthusiasts"],
    highlights: [
      "Tiger's Nest Monastery trek",
      "Punakha Dzong visit",
      "Traditional Bhutanese cultural show",
      "Buddha Dordenma statue",
      "Thimphu Memorial Chorten",
      "Local handicrafts market"
    ],
    inclusions: [
      "6 nights in 3-star hotels",
      "All meals (breakfast, lunch, dinner)",
      "Guided sightseeing tours",
      "All entry fees and permits",
      "Transport in comfortable vehicles",
      "English-speaking guide"
    ],
    exclusions: [
      "Flights to/from Bhutan",
      "Personal shopping and expenses",
      "Travel insurance",
      "Alcoholic beverages",
      "Tips for guide and driver"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Phuntsholing", description: "Border crossing, hotel check-in" },
      { day: 2, title: "Phuntsholing to Thimphu", description: "Scenic drive, visit Simtokha Dzong" },
      { day: 3, title: "Thimphu Sightseeing", description: "Memorial Chorten, Buddha statue, local markets" },
      { day: 4, title: "Thimphu to Paro", description: "Punakha Dzong, suspension bridge, drive to Paro" },
      { day: 5, title: "Tiger's Nest Trek", description: "Hike to Taktsang Monastery (3-4 hours)" },
      { day: 6, title: "Paro Valley", description: "Paro Dzong, local village visit" },
      { day: 7, title: "Departure", description: "Return to Phuntsholing border" }
    ]
  },
  {
    id: "pkg-003",
    name: "Ladakh Adventure",
    destination: "Leh, Nubra Valley, Pangong Lake",
    price: 45000,
    originalPrice: 55000,
    duration: "7 Nights / 8 Days",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    rating: 4.9,
    reviews: 312,
    availableDates: ["May 20, 2025", "Jun 15, 2025", "Jul 10, 2025", "Aug 5, 2025"],
    groupSize: "2-8 people",
    difficulty: "Challenging",
    suitableFor: ["Adventure Seekers", "Youth", "Photography Enthusiasts"],
    highlights: [
      "Pangong Lake overnight stay",
      "Nubra Valley camel safari",
      "Khardung La pass (18,380 ft)",
      "Magnetic Hill experience",
      "Thiksey and Hemis monasteries",
      "Leh Palace and Shanti Stupa"
    ],
    inclusions: [
      "7 nights accommodation (hotels & camps)",
      "All meals during the tour",
      "Inner line permits",
      "4x4 vehicle for entire journey",
      "Oxygen cylinder (if needed)",
      "Experienced driver-guide"
    ],
    exclusions: [
      "Flights to/from Leh",
      "Personal medication",
      "Laundry and phone calls",
      "Extra oxygen cylinder",
      "Any airfare or train fare"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Leh", description: "Airport pickup, rest for acclimatization" },
      { day: 2, title: "Leh Local Sightseeing", description: "Shanti Stupa, Leh Palace, local market" },
      { day: 3, title: "Leh to Nubra Valley", description: "Khardung La pass, Diskit monastery, camel safari" },
      { day: 4, title: "Nubra to Pangong", description: "Drive via Shyok river, reach Pangong Lake" },
      { day: 5, title: "Pangong to Leh", description: "Morning at lake, return via Chang La pass" },
      { day: 6, title: "Leh to Alchi", description: "Magnetic Hill, Alchi monastery, Likir monastery" },
      { day: 7, title: "Alchi to Leh", description: "Hemis monastery, Thiksey monastery" },
      { day: 8, title: "Departure", description: "Airport transfer" }
    ]
  },
  {
    id: "pkg-004",
    name: "Kerala Backwaters",
    destination: "Cochin, Munnar, Thekkady, Alleppey",
    price: 28500,
    originalPrice: 35000,
    duration: "4 Nights / 5 Days",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920&auto=format&fit=crop",
    rating: 4.7,
    reviews: 203,
    availableDates: ["Oct 25, 2025", "Nov 10, 2025", "Dec 15, 2025", "Jan 20, 2026"],
    groupSize: "2-6 people",
    difficulty: "Easy",
    suitableFor: ["Couples", "Families", "Honeymooners"],
    highlights: [
      "Houseboat stay in Alleppey",
      "Tea plantation visit in Munnar",
      "Periyar wildlife sanctuary",
      "Ayurvedic massage session",
      "Traditional Kathakali show",
      "Chinese fishing nets"
    ],
    inclusions: [
      "4 nights accommodation (3 nights hotel + 1 night houseboat)",
      "All meals included",
      "Houseboat cruise (24 hours)",
      "Wildlife sanctuary entry",
      "Ayurvedic spa session",
      "All transfers and sightseeing"
    ],
    exclusions: [
      "Flights to/from Cochin",
      "Alcoholic beverages",
      "Laundry services",
      "Personal expenses",
      "Extra activities"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Cochin", description: "Airport pickup, city tour, Chinese nets" },
      { day: 2, title: "Cochin to Munnar", description: "Drive to hill station, tea plantation visit" },
      { day: 3, title: "Munnar to Thekkady", description: "Spice gardens, elephant ride, Periyar lake" },
      { day: 4, title: "Thekkady to Alleppey", description: "Check-in to houseboat, backwater cruise" },
      { day: 5, title: "Departure", description: "Morning in houseboat, transfer to Cochin airport" }
    ]
  },
  {
    id: "pkg-005",
    name: "Rajasthan Royals",
    destination: "Jaipur, Udaipur, Jodhpur",
    price: 55000,
    originalPrice: 68000,
    duration: "8 Nights / 9 Days",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1920&auto=format&fit=crop",
    rating: 4.8,
    reviews: 267,
    availableDates: ["Oct 15, 2025", "Nov 5, 2025", "Dec 20, 2025", "Feb 10, 2026"],
    groupSize: "2-12 people",
    difficulty: "Easy",
    suitableFor: ["History Buffs", "Families", "Cultural Enthusiasts"],
    highlights: [
      "Amber Fort elephant ride",
      "City Palace & Lake Palace",
      "Mehrangarh Fort visit",
      "Camel safari in Pushkar",
      "Traditional Rajasthani dinner",
      "Heritage hotel stay"
    ],
    inclusions: [
      "8 nights in heritage hotels",
      "All meals (breakfast, lunch, dinner)",
      "Guided tours with historian",
      "Train transfers between cities",
      "All entry fees and tickets",
      "Cultural evening programs"
    ],
    exclusions: [
      "Flights to/from Rajasthan",
      "Camel cart rides (optional)",
      "Personal shopping",
      "Tips for guides",
      "Alcoholic drinks"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", description: "Airport pickup, hotel check-in" },
      { day: 2, title: "Jaipur City Tour", description: "Amber Fort, City Palace, Hawa Mahal" },
      { day: 3, title: "Jaipur to Pushkar", description: "Brahma Temple, Pushkar Lake, camel safari" },
      { day: 4, title: "Pushkar to Udaipur", description: "Drive to City of Lakes" },
      { day: 5, title: "Udaipur Sightseeing", description: "City Palace, Lake Pichola boat ride" },
      { day: 6, title: "Udaipur to Jodhpur", description: "Ranakpur Jain temples en route" },
      { day: 7, title: "Jodhpur Exploration", description: "Mehrangarh Fort, Jaswant Thada, blue city" },
      { day: 8, title: "Jodhpur Local", description: "Clock Tower, Sardar Market, local cuisine" },
      { day: 9, title: "Departure", description: "Airport transfer" }
    ]
  },
  {
    id: "pkg-006",
    name: "Himachal Hill Retreat",
    destination: "Manali, Shimla, Dharamshala",
    price: 35000,
    originalPrice: 42000,
    duration: "6 Nights / 7 Days",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1920&auto=format&fit=crop",
    rating: 4.7,
    reviews: 178,
    availableDates: ["Year-round availability"],
    groupSize: "2-8 people",
    difficulty: "Moderate",
    suitableFor: ["Nature Lovers", "Couples", "Families"],
    highlights: [
      "Rohtang Pass visit (seasonal)",
      "Solang Valley activities",
      "Dalai Lama Temple",
      "Mall Road shopping",
      "Apple orchards visit",
      "Ridge walk in Shimla"
    ],
    inclusions: [
      "6 nights in hill resort hotels",
      "All meals included",
      "Local transfers and sightseeing",
      "Paragliding session (Solang)",
      "Toy train ride (Shimla)",
      "Bonfire evenings"
    ],
    exclusions: [
      "Flights/train to Himachal",
      "Adventure activities (extra)",
      "Rohtang Pass permit",
      "Personal expenses",
      "Laundry services"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Manali", description: "Airport/bus pickup, hotel check-in" },
      { day: 2, title: "Manali Local", description: "Hadimba Temple, Vashisht hot springs, Mall Road" },
      { day: 3, title: "Solang Valley", description: "Paragliding, zorbing, cable car ride" },
      { day: 4, title: "Manali to Dharamshala", description: "Scenic drive, Dalai Lama Temple" },
      { day: 5, title: "Dharamshala to Shimla", description: "McLeod Ganj, drive to Shimla" },
      { day: 6, title: "Shimla Sightseeing", description: "Mall Road, Ridge, Christ Church, toy train" },
      { day: 7, title: "Departure", description: "Transfer to airport/railway station" }
    ]
  },
  {
    id: "pkg-007",
    name: "Northeast Wonders",
    destination: "Assam, Meghalaya, Arunachal Pradesh",
    price: 60000,
    originalPrice: 75000,
    duration: "9 Nights / 10 Days",
    image: "https://images.unsplash.com/photo-1586339277861-60f4d467f67e?q=80&w=1920&auto=format&fit=crop",
    rating: 4.9,
    reviews: 98,
    availableDates: ["Oct 10, 2025", "Nov 15, 2025", "Dec 5, 2025", "Mar 20, 2026"],
    groupSize: "4-10 people",
    difficulty: "Moderate to Challenging",
    suitableFor: ["Explorers", "Groups", "Adventure Seekers"],
    highlights: [
      "Living root bridges of Meghalaya",
      "Kaziranga National Park safari",
      "Tawang Monastery visit",
      "Umiam Lake activities",
      "Tea garden tour in Assam",
      "Tribal village experiences"
    ],
    inclusions: [
      "9 nights in luxury camps & hotels",
      "All meals included",
      "Tribal village visits",
      "National park safari",
      "All permits and entry fees",
      "4x4 vehicles for hilly terrain",
      "Cultural performances"
    ],
    exclusions: [
      "Flights to/from Guwahati",
      "Permit fees for restricted areas",
      "Personal shopping",
      "Travel insurance",
      "Alcoholic beverages"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Guwahati", description: "Airport pickup, Kamakhya Temple visit" },
      { day: 2, title: "Guwahati to Shillong", description: "Drive to Scotland of the East, Umiam Lake" },
      { day: 3, title: "Shillong to Cherrapunji", description: "Living root bridges, waterfalls" },
      { day: 4, title: "Cherrapunji Exploration", description: "Nohkalikai Falls, Mawsmai caves" },
      { day: 5, title: "Cherrapunji to Kaziranga", description: "Drive to national park" },
      { day: 6, title: "Kaziranga Safari", description: "Elephant and jeep safari, wildlife spotting" },
      { day: 7, title: "Kaziranga to Tawang", description: "Scenic mountain drive" },
      { day: 8, title: "Tawang Monastery", description: "Monastery visit, local markets" },
      { day: 9, title: "Tawang to Bomdila", description: "Mountain views, tribal villages" },
      { day: 10, title: "Return to Guwahati", description: "Airport transfer for departure" }
    ]
  }
]

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Packages</h1>
          <p className="text-lg md:text-xl opacity-90">
            Curated travel experiences across India and beyond
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="relative h-64 w-full">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{pkg.rating}</span>
                  <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {pkg.destination}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-rose-600">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">per person</span>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{pkg.groupSize}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {pkg.suitableFor.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Highlights:</h4>
                  <ul className="space-y-1">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Link href={`/packages/${pkg.id}`} className="flex-1">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">
                    Book Now
                  </Button>
                </Link>
                <Link href={`/packages/${pkg.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
