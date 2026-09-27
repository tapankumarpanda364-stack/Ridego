import { Link } from "react-router-dom";

const SECTIONS = [
  { to: "/admin/users", label: "Users", metricKey: "totalUsers" },
  { to: "/admin/drivers", label: "Drivers", metricKey: "totalDrivers" },
  { to: "/admin/vehicles", label: "Vehicles", metricKey: "totalVehicles" },
  { to: "/admin/rides", label: "Rides", metricKey: "totalRides" },
];

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Admin overview</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className="card p-6 hover:border-ink/30">
            <p className="text-sm text-ink/50 mb-2">{section.label}</p>
            <p className="font-display text-2xl font-semibold">Manage &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
