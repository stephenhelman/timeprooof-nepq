import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="tab-nav">
      <NavLink
        to="/overview"
        className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
      >
        📊 Overview
      </NavLink>
      <NavLink
        to="/by-day"
        className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
      >
        📅 By Day
      </NavLink>
      <NavLink
        to="/scripts"
        className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
      >
        📝 Scripts
      </NavLink>
      <NavLink
        to="/flashcards"
        className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
      >
        🎴 Flashcards
      </NavLink>
      <NavLink
        to="/glossary"
        className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
      >
        📖 Glossary
      </NavLink>
    </nav>
  );
}

export default Navigation;
