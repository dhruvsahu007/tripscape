"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { Phone, Mail } from "@/components/icons"
import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    setFormData({ name: "", email: "", subject: "", message: "" })
    alert("Your message has been sent!")
  }

  return (
    <section id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-muted-foreground">
            If you have any questions or need a custom travel plan, feel free to contact us
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-rose-600" />
              <p>Mumbai, Andheri East, Western Express Highway</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-rose-600" />
              <p>+91 22 1234 5678</p>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-rose-600" />
              <p>info@tripscape.com</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
