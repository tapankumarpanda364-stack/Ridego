import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { driverAPI } from "../services/api";

const RANGES = ["today", "week", "month"];

export default function Earnings() {
  const [range, setRange] = useState("week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    driverAPI
      .getEarnings(range)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Earnings</h1>

      <div className="flex gap-2 mb-8">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border ${
              range === r ? "border-route bg-route/10 text-route" : "border-ink/15"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading && <Loader label="Tallying earnings" />}

      {!loading && data && (
        <>
          <div className="card p-6 mb-6">
            <p className="text-sm text-ink/50 mb-1">Total earned</p>
            <p className="font-display text-3xl font-semibold">₹{data.total}</p>
            <p className="text-sm text-ink/50 mt-2">{data.tripsCompleted} trips completed</p>
          </div>

          <div className="space-y-3">
            {data.breakdown.map((day) => (
              <div key={day.label} className="card p-4 flex justify-between text-sm">
                <span className="text-ink/60">{day.label}</span>
                <span className="font-medium">₹{day.amount}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
