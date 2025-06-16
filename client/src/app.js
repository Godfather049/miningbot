import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clan from './pages/Clan';
import Shop from './pages/Shop';
import Wallet from './pages/Wallet';
import Tasks from './pages/Tasks';
import Leaderboard from './pages/Leaderboard';
import BottomMenu from './components/BottomMenu';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clan" element={<Clan />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <BottomMenu />
      </div>
    </Router>
  );
}

export default App;
