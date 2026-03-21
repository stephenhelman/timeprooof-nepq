import { HashRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Overview from './pages/Overview'
import BySection from './pages/BySection'
import Scripts from './pages/Scripts'
import Flashcards from './pages/Flashcards'
import Glossary from './pages/Glossary'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navigation />
        <Routes>
          <Route path="/"           element={<Overview />} />
          <Route path="/section"    element={<BySection />} />
          <Route path="/scripts"    element={<Scripts />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/glossary"   element={<Glossary />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
