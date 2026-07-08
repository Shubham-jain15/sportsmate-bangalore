import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bell, ChevronRight, Flame, Users, Plus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SPORTS, SESSIONS, USERS } from '../data/users';
import './Home.css';

const BANNERS = [
  { bg: 'linear-gradient(135deg,#FC8019,#E16B0A)', emoji: '🏸', title: 'Badminton Nights', sub: 'Courts open till 10 PM · Book now', sport: 'badminton' },
  { bg: 'linear-gradient(135deg,#4F90F7,#1A5DC5)', emoji: '⚽', title: 'Weekend Football', sub: '5-a-side pickup · Join a team', sport: 'football' },
  { bg: 'linear-gradient(135deg,#60B246,#2E7D32)', emoji: '🎾', title: 'Tennis Tuesdays', sub: 'Beginner friendly · All levels', sport: 'tennis' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, joinSession, joinedSessions } = useAuth();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [search, setSearch] = useState('');

  const nearbyPlayers = USERS.filter(u => u.online).slice(0, 4);
  const hotSessions = SESSIONS.slice(0, 3);

  return (
    <div className="home-root">

      {/* ── Top bar ── */}
      <div className="home-topbar">
        <div className="home-location">
          <MapPin size={14} className="loc-icon" />
          <div>
            <span className="loc-label">Your location</span>
            <span className="loc-city">{user?.area || 'Koramangala'}, Bangalore</span>
          </div>
        </div>
        <button className="icon-btn" onClick={() => navigate('/activity')}>
          <Bell size={20} />
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="home-search" onClick={() => navigate('/search')}>
        <Search size={16} className="search-icon" />
        <span className="search-placeholder">Search sports, players, courts…</span>
      </div>

      {/* ── Hero banners ── */}
      <div className="banner-section">
        <div className="banner-track" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
          {BANNERS.map((b, i) => (
            <div key={i} className="banner-slide" style={{ background: b.bg }}
                 onClick={() => navigate(`/discover?sport=${b.sport}`)}>
              <div className="banner-text">
                <p className="banner-sub">{b.sub}</p>
                <h3 className="banner-title">{b.title}</h3>
                <span className="banner-cta">Find Players <ChevronRight size={14} /></span>
              </div>
              <div className="banner-emoji">{b.emoji}</div>
            </div>
          ))}
        </div>
        <div className="banner-dots">
          {BANNERS.map((_, i) => (
            <button key={i} className={`banner-dot ${i === bannerIdx ? 'active' : ''}`}
                    onClick={() => setBannerIdx(i)} />
          ))}
        </div>
      </div>

      {/* ── Sport categories ── */}
      <section className="home-section">
        <div className="sec-head">
          <span className="sec-title">Play a Sport</span>
          <span className="sec-link" onClick={() => navigate('/discover')}>See all</span>
        </div>
        <div className="sport-grid">
          {SPORTS.map((s, i) => (
            <button key={s.id} className={`sport-chip anim-up d${Math.min(i+1,5)}`}
                    style={{ '--sc': s.color }}
                    onClick={() => navigate(`/discover?sport=${s.id}`)}>
              <span className="sport-emoji">{s.emoji}</span>
              <span className="sport-name">{s.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Live / open sessions ── */}
      <section className="home-section">
        <div className="sec-head">
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Flame size={16} style={{ color: 'var(--orange)' }} />
            <span className="sec-title">Open Sessions Near You</span>
          </div>
          <span className="sec-link" onClick={() => navigate('/sessions')}>View all</span>
        </div>
        <div className="sessions-scroll">
          {hotSessions.map((s, i) => {
            const sport = SPORTS.find(sp => sp.id === s.sport);
            const joined = joinedSessions.includes(s.id);
            const full = s.spotsFilled >= s.spotsTotal;
            return (
              <div key={s.id} className={`session-card anim-up d${i+1}`} onClick={() => navigate('/sessions')}>
                <div className="sc-header" style={{ background: sport ? sport.color + '22' : 'var(--bg-3)' }}>
                  <span className="sc-emoji">{sport?.emoji}</span>
                  <span className="pill pill-orange">{s.date} · {s.time}</span>
                </div>
                <div className="sc-body">
                  <h4 className="sc-title">{s.title}</h4>
                  <p className="sc-venue"><MapPin size={12} /> {s.venue}</p>
                  <div className="sc-meta">
                    <span className="sc-format">{s.format}</span>
                    <span className={`pill ${full ? 'pill-red' : 'pill-green'}`}>
                      {s.spotsFilled}/{s.spotsTotal} joined
                    </span>
                  </div>
                  <div className="sc-footer">
                    <span className="sc-fee">{s.fee}</span>
                    <button className={`btn ${joined ? 'btn-ghost' : 'btn-orange'} sc-join-btn`}
                            onClick={e => { e.stopPropagation(); if (!joined && !full) joinSession(s.id); }}
                            disabled={full && !joined}>
                      {joined ? '✓ Joined' : full ? 'Full' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ── Online players near you ── */}
      <section className="home-section">
        <div className="sec-head">
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Users size={16} style={{ color: 'var(--green)' }} />
            <span className="sec-title">Players Online Now</span>
          </div>
          <span className="sec-link" onClick={() => navigate('/discover')}>Match</span>
        </div>
        <div className="online-players-row">
          {nearbyPlayers.map((p, i) => {
            const sport = SPORTS.find(s => s.id === p.primarySport);
            return (
              <div key={p.id} className={`online-player-card anim-up d${i+1}`} onClick={() => navigate('/discover')}>
                <div className="opc-avatar-wrap">
                  <img src={p.photo} alt={p.name} className="opc-avatar" />
                  <span className="dot-online opc-dot" />
                </div>
                <p className="opc-name">{p.name.split(' ')[0]}</p>
                <p className="opc-sport">{sport?.emoji} {sport?.name}</p>
                <span className={`pill pill-${p.skillLevel === 'Pro' ? 'purple' : p.skillLevel === 'Advanced' ? 'orange' : 'blue'}`}
                      style={{ fontSize:'0.65rem', padding:'2px 8px' }}>
                  {p.skillLevel}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ── Quick actions ── */}
      <section className="home-section">
        <p className="sec-title" style={{ marginBottom: 12 }}>Quick Actions</p>
        <div className="quick-actions">
          <button className="qa-btn" onClick={() => navigate('/sessions/create')}>
            <div className="qa-icon qa-orange"><Plus size={20} /></div>
            <span>Create Match</span>
          </button>
          <button className="qa-btn" onClick={() => navigate('/discover')}>
            <div className="qa-icon qa-blue"><Users size={20} /></div>
            <span>Find Players</span>
          </button>
          <button className="qa-btn" onClick={() => navigate('/courts')}>
            <div className="qa-icon qa-green"><MapPin size={20} /></div>
            <span>Book Court</span>
          </button>
          <button className="qa-btn" onClick={() => navigate('/leaderboard')}>
            <div className="qa-icon qa-purple"><Flame size={20} /></div>
            <span>Leaderboard</span>
          </button>
        </div>
      </section>

      <div style={{ height: 100 }} />
    </div>
  );
}
