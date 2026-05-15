import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navLinkClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? "/dashboard" : "/login"} className="brand">
        TaskFlow
      </Link>

      <nav className="nav-actions" aria-label="Main navigation">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={navLinkClass}>
              Projects
            </NavLink>
            {user?.email && <span className="user-email">{user.email}</span>}
            <button className="button button-secondary" type="button" onClick={() => logout(true)}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className="button button-primary">
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
