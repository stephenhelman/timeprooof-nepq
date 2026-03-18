import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Overview from "./pages/Overview";
import ByDay from "./pages/ByDay";
import Scripts from "./pages/Scripts";
import Flashcards from "./pages/Flashcards";
import Glossary from "./pages/Glossary";
import "./styles/index.css";

function App() {
  return (
    <Router basename="/timeproof-training">
      <div className="container">
        <header className="header">
          <h1>🚀 TIMEPROOFUSA Complete Training Guide</h1>
        </header>

        <Navigation />

        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/by-day" element={<ByDay />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
