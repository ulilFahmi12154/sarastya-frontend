import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
};

function validateRegister(form) {
  if (!form.email.trim()) {
    return "Email wajib diisi.";
  }

  if (form.password.length < 8) {
    return "Password minimal 8 karakter.";
  }

  return "";
}

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

    const validationMessage = validateRegister(form);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Register gagal. Coba gunakan email lain.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">TaskFlow Web</p>
        <h1>Buat akun baru</h1>
        <p className="auth-copy">Mulai susun project dan task pertama kamu dalam satu tempat.</p>

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
              autoComplete="new-password"
              value={form.password}
              onChange={updateField}
              placeholder="Minimal 8 karakter"
            />
          </label>

          <button className="button button-primary full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Register"}
          </button>
        </form>

        <p className="switch-auth">
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
