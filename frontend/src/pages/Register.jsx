import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "rider",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(user.role === "driver" ? "/driver" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Create your account</h1>
      <p className="text-ink/60 mb-8">Sign up as a rider or a driver.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input required className="input-field" value={form.name} onChange={update("name")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={update("email")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" required className="input-field" value={form.phone} onChange={update("phone")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required className="input-field" value={form.password} onChange={update("password")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">I'm signing up as a</label>
          <div className="flex gap-3">
            {["rider", "driver"].map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-2.5 rounded-lg border capitalize font-medium ${
                  form.role === role ? "border-route bg-route/10 text-route" : "border-ink/15"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-alert">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account? <Link to="/login" className="text-route font-medium">Log in</Link>
      </p>
    </div>
  );
}
