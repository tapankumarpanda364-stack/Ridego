import { Link } from "react-router-dom";

const STATUS_STYLES = {
  completed: "text-route bg-route/10",
  cancelled: "text-alert bg-alert/10",
  ongoing: "text-marigold bg-marigold/15",
};

export default function RideCard({ ride }) {
  const { id, pickup, drop, date, fare, status } = ride;
  const style = STATUS_STYLES[status] || "text-ink/60 bg-ink/5";

  return (
    <Link
      to={`/rides/${id}`}
      className="card p-5 flex items-center justify-between hover:border-ink/30 transition-colors"
    >
      <div>
        <p className="font-medium">{pickup} &rarr; {drop}</p>
        <p className="text-sm text-ink/50 mt-1">{date}</p>
      </div>
      <div className="text-right">
        <p className="font-display font-semibold">₹{fare}</p>
        <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${style}`}>
          {status}
        </span>
      </div>
    </Link>
  );
}
