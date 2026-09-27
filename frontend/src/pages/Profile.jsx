import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="w-16 h-16 rounded-full bg-ink/10 mb-5" />
      <h1 className="text-2xl font-semibold mb-1">{user.name}</h1>
      <p className="text-ink/60 capitalize mb-8">{user.role}</p>

      <div className="card divide-y divide-ink/10">
        <div className="p-4 flex justify-between">
          <span className="text-ink/50 text-sm">Email</span>
          <span className="font-medium text-sm">{user.email}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-ink/50 text-sm">Phone</span>
          <span className="font-medium text-sm">{user.phone}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-ink/50 text-sm">Member since</span>
          <span className="font-medium text-sm">{user.joinedAt || "—"}</span>
        </div>
      </div>
    </div>
  );
}
