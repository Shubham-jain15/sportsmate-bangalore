import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Star, X, Heart, Zap, Shield, ChevronDown, Clock, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USERS, SPORTS } from '../data/users';
import './Discovery.css';

const SKILL_BADGE = {
  Beginner:     { cls: 'pill-green',  label: '🌱 Beginner' },
  Intermediate: { cls: 'pill-blue',   label: '⚡ Intermediate' },
  Advanced:     { cls: 'pill-orange', label: '🔥 Advanced' },
  Pro:          { cls: 'pill-purple', label: '🏆 Pro' },
};

export default function Discovery() {
  const { likedIds, likeUser } = useAuth();
  const [params] = useSearchParams();
  const defaultSport = params.get('sport') || 'all';

  const [sportFilter, setSportFilter] = useState(defaultSport);
  const [skillFilter, setSkillFilter] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null);
  const [matchToast, setMatchToast] = useState(null);
  const [localIndex, setLocalIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const touchStartX = React.useRef(null);
  const cardRef = React.useRef(null);

  const pool = USERS.filter(u => !likedIds.includes(u.id)).filter(u => {
    const sportOk = sportFilter === 'all' || u.sports?.includes(sportFilter);
    const skillOk = skillFilter === 'All' || u.skillLevel === skillFilter;
    return sportOk && skillOk;
  });

  const currentUser = pool[localIndex];
  const sport = currentUser ? SPORTS.find(s => s.id === currentUser.primarySport) : null;
  const badge = currentUser ? (SKILL_BADGE[currentUser.skillLevel] || SKILL_BADGE.Intermediate) : null;
  const winRate = currentUser ? Math.round((currentUser.wins / currentUser.matchesPlayed) * 100) : 0;

  const handleAction = (dir) => {
    if (!currentUser) return;
    setSwipeDir(dir); setExpanded(false);
    if (dir === 'right') {
      const isMatch = likeUser(currentUser);
      if (isMatch) {
        setMatchToast(currentUser);
        setTimeout(() => setMatchToast(null), 3000);
      }
    }
    setTimeout(() => { setSwipeDir(null); setLocalIndex(i => i + 1); }, 320);
  };

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove  = e => {
    const dx = e.touches[0].clientX - touchStartX.current;
    if (cardRef.current) cardRef.current.style.transform = `translateX(${dx}px) rotate(${dx * 0.04}deg)`;
  };
  const onTouchEnd   = e => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (cardRef.current) cardRef.current.style.transform = '';
    if (Math.abs(dx) > 80) handleAction(dx > 0 ? 'right' : 'left');
  };

  const skills = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Pro'];

  return (
    <div className="disc-root">

      {/* Match toast */}
      {matchToast && (
        <div className="match-toast anim-pop">
          <span className="mt-emoji">🎉</span>
          <div><strong>It's a Match!</strong><p>{matchToast.name} wants to play!</p></div>
        </div>
      )}

      {/* Header */}
      <div className="disc-topbar">
        <div>
          <h2 className="disc-title">Find Players</h2>
          <p className="disc-sub">{pool.length - localIndex} players · <MapPin size={11} /> Bangalore</p>
        </div>
        <button className="icon-btn" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={18} />
        </button>
      </div>

      {/* Sport filter pills */}
      <div className="sport-pills-row">
        <button className={`sport-pill ${sportFilter === 'all' ? 'active' : ''}`} onClick={() => { setSportFilter('all'); setLocalIndex(0); }}>All</button>
        {SPORTS.map(s => (
          <button key={s.id} className={`sport-pill ${sportFilter === s.id ? 'active' : ''}`}
                  style={{ '--pc': s.color }} onClick={() => { setSportFilter(s.id); setLocalIndex(0); }}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      {/* Skill filter (toggle) */}
      {showFilters && (
        <div className="skill-filter-row anim-fade">
          {skills.map(sk => (
            <button key={sk} className={`skill-pill ${skillFilter === sk ? 'active' : ''}`}
                    onClick={() => { setSkillFilter(sk); setLocalIndex(0); }}>
              {sk}
            </button>
          ))}
        </div>
      )}

      {/* Card area */}
      {!currentUser ? (
        <div className="disc-empty">
          <div style={{ fontSize: '3.5rem' }}>🏸</div>
          <h3>No players found</h3>
          <p>Try a different sport or skill filter</p>
          <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => { setSportFilter('all'); setSkillFilter('All'); setLocalIndex(0); }}>Reset Filters</button>
        </div>
      ) : (
        <>
          <div className="card-arena">
            {/* Ghost behind */}
            {pool[localIndex + 1] && (
              <div className="pcard ghost">
                <img src={pool[localIndex + 1].photo} alt="" className="pcard-img" />
              </div>
            )}

            {/* Main card */}
            <div ref={cardRef}
                 className={`pcard main ${swipeDir === 'left' ? 'fly-left' : ''} ${swipeDir === 'right' ? 'fly-right' : ''}`}
                 onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
              <img src={currentUser.photo} alt={currentUser.name} className="pcard-img" draggable={false} />

              {/* Sport badge on image */}
              <div className="pcard-sport-badge" style={{ background: sport?.color + '33', borderColor: sport?.color + '66' }}>
                {sport?.emoji} {sport?.name}
              </div>

              {swipeDir === 'left'  && <div className="swipe-label sl-pass">PASS</div>}
              {swipeDir === 'right' && <div className="swipe-label sl-smash">SMASH</div>}

              {currentUser.online && <div className="pcard-online"><span className="dot-online" style={{ width:6, height:6 }} />Live</div>}

              {/* Overlay info */}
              <div className="pcard-overlay">
                <div className="pcard-name-row">
                  <h3>{currentUser.name}, {currentUser.age}</h3>
                  <Shield size={16} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                </div>
                <div className="pcard-tags">
                  <span className={`pill ${badge.cls}`}>{badge.label}</span>
                  <span className="pill pill-orange"><MapPin size={9} /> {currentUser.area}</span>
                  <span className="pill pill-green">{currentUser.distance}</span>
                </div>
                <p className="pcard-bio">{currentUser.bio}</p>

                {/* Stats */}
                <div className="pcard-stats">
                  <div className="ps"><span className="ps-v">{currentUser.wins}</span><span className="ps-l">Wins</span></div>
                  <div className="ps-div" />
                  <div className="ps"><span className="ps-v">{winRate}%</span><span className="ps-l">Win Rate</span></div>
                  <div className="ps-div" />
                  <div className="ps"><span className="ps-v">⭐{currentUser.rating}</span><span className="ps-l">Rating</span></div>
                </div>

                {/* Multi-sport tags */}
                <div className="pcard-sports-row">
                  {currentUser.sports?.map(sid => {
                    const sp = SPORTS.find(s => s.id === sid);
                    return sp ? <span key={sid} className="sport-micro">{sp.emoji} {sp.name}</span> : null;
                  })}
                </div>

                {/* Expand */}
                <button className="expand-toggle" onClick={() => setExpanded(!expanded)}>
                  <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  {expanded ? 'Less' : 'More info'}
                </button>

                {expanded && (
                  <div className="pcard-detail anim-fade">
                    <p style={{ fontSize:'0.78rem', color:'var(--t-3)', display:'flex', gap:6 }}>
                      <Clock size={12} /> {currentUser.availability?.join(' · ')}
                    </p>
                    <p style={{ fontSize:'0.78rem', color:'var(--t-3)', display:'flex', gap:6 }}>
                      <MapPin size={12} /> {currentUser.courts?.join(' · ')}
                    </p>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {currentUser.badges?.map(b => <span key={b} className="pill pill-purple" style={{ fontSize:'0.65rem' }}>{b}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="disc-actions">
            <button className="da-btn da-pass"  onClick={() => handleAction('left')}  title="Pass"><X size={24} /></button>
            <button className="da-btn da-super" title="Super Like"><Zap size={18} fill="currentColor" /></button>
            <button className="da-btn da-smash" onClick={() => handleAction('right')} title="Smash"><Heart size={24} /></button>
          </div>
        </>
      )}
    </div>
  );
}
