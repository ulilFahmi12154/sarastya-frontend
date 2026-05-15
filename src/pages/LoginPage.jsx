import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
};

function validateLogin(form) {
  if (!form.email.trim()) {
    return "Email wajib diisi.";
  }

  if (!form.password) {
    return "Password wajib diisi.";
  }

  if (form.password.length < 8) {
    return "Password minimal 8 karakter.";
  }

  return "";
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateLogin(form);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Login gagal. Periksa kembali email dan password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">TaskFlow Web</p>
        <h1>Masuk ke akun</h1>
        <p className="auth-copy">Kelola project dan task dengan alur kerja yang lebih rapi.</p>

        <Alert type="error" message={error} />

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              placeholder="user@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={updateField}
              placeholder="Minimal 8 karakter"
            />
          </label>

          <button className="button button-primary full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="switch-auth">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </p>
      </section>
    </main>
  );
}
