import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { adminAPI } from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getVehicles()
      .then(({ data }) => setVehicles(data.vehicles))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading vehicles" />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Vehicles</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-ink/10 text-ink/50">
              <th className="p-4 font-medium">Plate</th>
              <th className="p-4 font-medium">Model</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Verified</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4 font-medium">{v.plateNumber}</td>
                <td className="p-4 text-ink/60">{v.model}</td>
                <td className="p-4 text-ink/60">{v.type}</td>
                <td className="p-4 text-ink/60">{v.driverName}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    v.verified ? "text-route bg-route/10" : "text-marigold bg-marigold/15"
                  }`}>
                    {v.verified ? "Verified" : "Pending"}
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
