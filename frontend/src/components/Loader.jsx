export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/60">
      <span className="w-9 h-9 rounded-full border-2 border-ink/15 border-t-route animate-spin" />
      <p className="text-sm font-medium">{label}&hellip;</p>
    </div>
  );
}
