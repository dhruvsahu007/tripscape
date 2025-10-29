import Header from "@/components/header"
import Hero from "@/components/hero"
import Banner from "@/components/banner"
import Destinations from "@/components/destinations"
import TravelTips from "@/components/travel-tips"
import Testimonials from "@/components/testimonials"
import Newsletter from "@/components/newsletter"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Banner />
        <Destinations />
        <TravelTips />
        <Testimonials />
        <Newsletter />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
