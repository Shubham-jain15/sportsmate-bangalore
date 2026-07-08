import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Plus, Filter, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SESSIONS, SPORTS } from '../data/users';
import './Sessions.css';

const LEVEL_PILL = { Any:'pill-green', Beginner:'pill-green', Intermediate:'pill-blue', Advanced:'pill-orange', Pro:'pill-purple' };

export default function Sessions() {
  const navigate = useNavigate();
  const { joinSession, joinedSessions } = useAuth();
  const [filter, setFilter] = useState('all');

  const list = filter === 'all' ? SESSIONS : SESSIONS.filter(s => s.sport === filter);

  return (
    <div className="sess-root">
      <div className="sess-topbar">
        <div>
          <h2 className="sess-title">Open Sessions</h2>
          <p className="sess-sub">{list.length} matches near Bangalore</p>
        </div>
        <button className="btn btn-orange create-btn" onClick={() => navigate('/sessions/create')}>
          <Plus size={16} /> Create
        </button>
      </div>

      {/* Sport filter */}
      <div className="sess-filters">
        <button className={`sport-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>🏅 All Sports</button>
        {SPORTS.map(s => (
          <button key={s.id} className={`sport-pill ${filter === s.id ? 'active' : ''}`} style={{ '--pc': s.color }} onClick={() => setFilter(s.id)}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <div className="sess-list">
        {list.map((s, i) => {
          const sport = SPORTS.find(sp => sp.id === s.sport);
          const joined = joinedSessions.includes(s.id);
          const full = s.spotsFilled >= s.spotsTotal;
          const pct = Math.round((s.spotsFilled / s.spotsTotal) * 100);

          return (
            <div key={s.id} className={`sess-card anim-up`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="sess-card-header" style={{ background: (sport?.color || '#FC8019') + '18', borderBottom: `1px solid ${(sport?.color || '#FC8019')}25` }}>
                <div className="sch-left">
                  <span className="sch-emoji">{sport?.emoji}</span>
                  <div>
                    <h4 className="sess-card-title">{s.title}</h4>
                    <p className="sess-host">by {s.host}</p>
                  </div>
                </div>
                <img src={s.hostPhoto} alt={s.host} className="host-avatar" />
              </div>

              <div className="sess-card-body">
                <div className="scb-row">
                  <span className="scb-chip"><Clock size={12} /> {s.date} · {s.time}</span>
                  <span className="scb-chip"><MapPin size={12} /> {s.venue}</span>
                </div>
                <div className="scb-row">
                  <span className="scb-chip">🎮 {s.format}</span>
                  <span className={`pill ${LEVEL_PILL[s.level] || 'pill-blue'}`}>{s.level}</span>
                </div>

                {/* Progress bar */}
                <div className="spots-section">
                  <div className="spots-label">
                    <span>{s.spotsFilled}/{s.spotsTotal} players</span>
                    <span className={full ? 'text-red' : 'text-green'}>{full ? 'Session Full' : `${s.spotsTotal - s.spotsFilled} spots left`}</span>
                  </div>
                  <div className="spots-bar">
                    <div className="spots-fill" style={{ width: `${pct}%`, background: full ? 'var(--red)' : sport?.color || 'var(--orange)' }} />
                  </div>
                </div>

                <div className="scb-footer">
                  <div>
                    <span className="sess-fee">{s.fee}</span>
                    <span className="sess-per-head">per head</span>
                  </div>
                  <button className={`btn ${joined ? 'btn-ghost' : full ? 'btn-ghost' : 'btn-orange'} sess-join-btn`}
                          onClick={() => !joined && !full && joinSession(s.id)}
                          disabled={full && !joined}>
                    {joined ? '✓ Joined' : full ? 'Full' : 'Join Session'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="sess-empty">
            <div style={{ fontSize:'3rem' }}>🏟️</div>
            <p>No sessions for this sport yet.</p>
            <button className="btn btn-orange" onClick={() => navigate('/sessions/create')} style={{ marginTop:12 }}>
              <Plus size={16} /> Create First Session
            </button>
          </div>
        )}
      </div>
      <div style={{ height: 100 }} />
    </div>
  );
}
