import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { adminAPI } from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getDrivers()
      .then(({ data }) => setDrivers(data.drivers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading drivers" />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Drivers</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-ink/10 text-ink/50">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Vehicle</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Trips</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4 font-medium">{d.name}</td>
                <td className="p-4 text-ink/60">{d.vehicleModel}</td>
                <td className="p-4 text-ink/60">&#9733; {d.rating}</td>
                <td className="p-4 text-ink/60">{d.tripsCompleted}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    d.status === "online" ? "text-route bg-route/10" : "text-ink/50 bg-ink/5"
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
