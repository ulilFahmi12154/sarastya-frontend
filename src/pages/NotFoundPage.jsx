import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <section className="auth-card">
        <p className="eyebrow">404</p>
        <h1>Halaman tidak ditemukan</h1>
        <p className="auth-copy">Alamat yang kamu buka tidak tersedia di TaskFlow Web.</p>
        <Link className="button button-primary" to="/dashboard">
          Kembali ke dashboard
        </Link>
      </section>
    </main>
  );
}
