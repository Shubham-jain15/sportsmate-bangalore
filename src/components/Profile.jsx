import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Star, Trophy, MapPin, Clock, Edit, Award } from 'lucide-react';
import { SPORTS } from '../data/users';
import './Profile.css';

const SKILL_CLR = { Beginner:'#60B246', Intermediate:'#4F90F7', Advanced:'#FC8019', Pro:'#9B59B6' };

export default function Profile() {
  const { user, matchedUsers, logout } = useAuth();
  if (!user) return null;

  const clr = SKILL_CLR[user.skillLevel] || '#FC8019';
  const winRate = Math.round(((user.wins || 0) / Math.max(user.matchesPlayed || 1, 1)) * 100);

  return (
    <div className="prof-root">
      {/* Hero */}
      <div className="prof-hero" style={{'--clr':clr}}>
        <div className="prof-hero-bg"/>
        <div className="prof-topbar">
          <button className="btn btn-ghost edit-btn"><Edit size={16}/> Edit Profile</button>
        </div>
        <div className="prof-avatar-section">
          <div className="prof-av-wrap">
            <img src={user.photo} alt={user.name} className="prof-av"/>
            <span className="online-badge-hero"/>
          </div>
          <div className="prof-name-info">
            <h2 className="prof-name">{user.name}</h2>
            <p className="prof-loc"><MapPin size={13}/> {user.area || 'Bangalore'}</p>
            <span className="skill-badge" style={{background:clr+'22',border:`1px solid ${clr}44`,color:clr}}>{user.skillLevel || 'Intermediate'}</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="prof-stats-bar">
        {[
          { v: user.wins || 45,           l: 'Wins' },
          { v: user.matchesPlayed || 70,  l: 'Played' },
          { v: `${winRate}%`,             l: 'Win Rate' },
          { v: matchedUsers.length,       l: 'Mates' },
          { v: `⭐${user.rating || 4.5}`, l: 'Rating' },
        ].map((s,i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="psb-div"/>}
            <div className="psb-block">
              <span className="psb-val">{s.v}</span>
              <span className="psb-lbl">{s.l}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Sports */}
      <div className="prof-section">
        <p className="sec-title" style={{marginBottom:12}}>Sports I Play</p>
        <div className="sport-tags-wrap">
          {(user.sports || ['badminton']).map(sid => {
            const sp = SPORTS.find(s => s.id === sid);
            return sp ? (
              <span key={sid} className="sport-tag-big" style={{'--stc':sp.color}}>
                {sp.emoji} {sp.name}
                {sid === user.primarySport && <span className="primary-dot"/>}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <div className="divider"/>

      {/* Bio */}
      <div className="prof-section">
        <p className="sec-title" style={{marginBottom:10}}>About</p>
        <p className="prof-bio">{user.bio || '🏸 Sports enthusiast from Bangalore!'}</p>
      </div>

      <div className="divider"/>

      {/* Achievements */}
      {user.badges && (
        <div className="prof-section">
          <p className="sec-title" style={{marginBottom:12}}>Achievements</p>
          <div className="badges-grid">
            {user.badges.map(b => (
              <div key={b} className="achiev-card">
                <Award size={18} style={{color:'var(--orange)'}}/>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divider"/>

      {/* Availability + courts */}
      {user.availability && (
        <div className="prof-section">
          <p className="sec-title" style={{marginBottom:10}}>Availability</p>
          {user.availability.map(a => (
            <div key={a} className="info-row"><Clock size={13} className="ir-icon"/><span>{a}</span></div>
          ))}
        </div>
      )}

      <div className="divider"/>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={17}/> Sign Out
      </button>
      <div style={{height:100}}/>
    </div>
  );
}
