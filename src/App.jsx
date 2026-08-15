import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import Productions from './pages/Productions';
import Museum from './pages/Museum';
import HallOfFame from './pages/HallOfFame';
import Community from './pages/Community';
import Events from './pages/Events';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// V2.0 New Pages
import CariAngkatan from './pages/CariAngkatan';
import AlumniMap from './pages/AlumniMap';
import Sponsor from './pages/Sponsor';
import Pengurus from './pages/Pengurus';
import SenapatiTV from './pages/SenapatiTV';
import Donasi from './pages/Donasi';
import DigitalWall from './pages/DigitalWall';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary font-body text-neutral selection:bg-accent-primary selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/productions" element={<Productions />} />
          <Route path="/museum" element={<Museum />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/community" element={<Community />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* V2.0 Routes */}
          <Route path="/cari-angkatan" element={<CariAngkatan />} />
          <Route path="/alumni-map" element={<AlumniMap />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/pengurus" element={<Pengurus />} />
          <Route path="/tv" element={<SenapatiTV />} />
          <Route path="/donasi" element={<Donasi />} />
          <Route path="/digital-wall" element={<DigitalWall />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
