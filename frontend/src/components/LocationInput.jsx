export default function LocationInput({
  label,
  value,
  onChange,
  placeholder,
  markerColor = "bg-route",
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={`w-2.5 h-2.5 rounded-full ${markerColor} mt-3.5 shrink-0`} />
      <div className="flex-1">
        <label className="block text-xs font-medium text-ink/50 mb-1">{label}</label>
        <input
          type="text"
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
