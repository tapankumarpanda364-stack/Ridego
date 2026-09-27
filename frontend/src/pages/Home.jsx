import { Link } from "react-router-dom";
import Map from "../components/Map";

const STEPS = [
  { title: "Set your route", copy: "Drop a pickup pin and your destination — RideGo finds the fastest lane there." },
  { title: "Match with a driver", copy: "The nearest verified driver accepts and heads your way in real time." },
  { title: "Ride, then rate", copy: "Track the trip live, pay in-app, and rate your driver when you arrive." },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-medium text-route mb-3">Campus to city, on demand</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-5">
            Book a ride in the time it takes to read this sentence.
          </h1>
          <p className="text-ink/60 text-lg mb-8 max-w-md">
            RideGo connects riders with nearby drivers for fast, transparent,
            metered trips — built as a full-stack ride-booking platform.
          </p>
          <div className="flex gap-3">
            <Link to="/book" className="btn-primary">Book a ride</Link>
            <Link to="/register" className="btn-outline">Create an account</Link>
          </div>
        </div>
        <Map pickupLabel="Your location" dropLabel="Destination" />
      </section>

      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8">How RideGo works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card p-6">
              <span className="font-display text-3xl text-marigold">{i + 1}</span>
              <h3 className="font-semibold mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-ink/60">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
