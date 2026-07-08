import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth         from './components/Auth';
import Home         from './components/Home';
import Discovery    from './components/Discovery';
import Sessions     from './components/Sessions';
import CreateMatch  from './components/CreateMatch';
import Matches      from './components/Matches';
import Courts       from './components/Courts';
import Profile      from './components/Profile';
import Navigation   from './components/Navigation';
import './App.css';

function App() {
  const { user } = useAuth();

  if (!user) return (
    <div className="app-shell">
      <Auth />
    </div>
  );

  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/discover"        element={<Discovery />} />
          <Route path="/sessions"        element={<Sessions />} />
          <Route path="/sessions/create" element={<CreateMatch />} />
          <Route path="/matches"         element={<Matches />} />
          <Route path="/courts"          element={<Courts />} />
          <Route path="/profile"         element={<Profile />} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Navigation />
    </div>
  );
}

export default App;
