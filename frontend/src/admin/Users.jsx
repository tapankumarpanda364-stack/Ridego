import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { adminAPI } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getUsers()
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading users" />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Users</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-ink/10 text-ink/50">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-ink/60">{u.email}</td>
                <td className="p-4 text-ink/60">{u.phone}</td>
                <td className="p-4 text-ink/60">{u.joinedAt}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    u.status === "active" ? "text-route bg-route/10" : "text-alert bg-alert/10"
                  }`}>
                    {u.status}
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
