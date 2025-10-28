import { tipsData } from "@/data/tips"

export default function TravelTips() {
  return (
    <section id="tips" className="bg-slate-50 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Travel Tips</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Practical advice to make your trip smoother and more enjoyable
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tipsData.map((tip, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                {tip.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium">{tip.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
