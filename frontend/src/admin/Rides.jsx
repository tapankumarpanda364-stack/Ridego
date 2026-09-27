import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { adminAPI } from "../services/api";

const STATUS_STYLES = {
  completed: "text-route bg-route/10",
  cancelled: "text-alert bg-alert/10",
  ongoing: "text-marigold bg-marigold/15",
};

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getRides()
      .then(({ data }) => setRides(data.rides))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading rides" />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Rides</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-ink/10 text-ink/50">
              <th className="p-4 font-medium">Route</th>
              <th className="p-4 font-medium">Rider</th>
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Fare</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((r) => (
              <tr key={r.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4 font-medium">{r.pickup} &rarr; {r.drop}</td>
                <td className="p-4 text-ink/60">{r.riderName}</td>
                <td className="p-4 text-ink/60">{r.driverName || "—"}</td>
                <td className="p-4 text-ink/60">₹{r.fare}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[r.status] || "text-ink/50 bg-ink/5"}`}>
                    {r.status}
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
