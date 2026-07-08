import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, MessageCircle } from 'lucide-react';
import { SPORTS } from '../data/users';
import './Matches.css';

const PREVIEWS = ['Want to play this weekend? 🏸','Free Saturday morning!','Let\'s book a court!','Great game last time! 💪','I booked Smash Zone for 7 PM'];

export default function Matches() {
  const { matchedUsers } = useAuth();
  return (
    <div className="mat-root">
      <div className="mat-topbar">
        <h2 className="mat-title">Your Matches</h2>
        <p className="mat-sub">{matchedUsers.length} partners waiting</p>
      </div>

      {matchedUsers.length === 0 ? (
        <div className="mat-empty">
          <div style={{fontSize:'3.5rem'}}>🏸</div>
          <h3>No matches yet</h3>
          <p>Start swiping in the Match tab to connect with players!</p>
        </div>
      ) : (
        <>
          {/* Avatar row */}
          <div className="mat-section">
            <p className="sec-title" style={{marginBottom:12}}>New Matches</p>
            <div className="avatar-row">
              {matchedUsers.map((u,i) => {
                const sp = SPORTS.find(s => s.id === u.primarySport);
                return (
                  <div key={u.id} className="av-item anim-up" style={{animationDelay:`${i*0.06}s`}}>
                    <div className="av-ring">
                      <img src={u.photo} alt={u.name} className="av-img" />
                    </div>
                    <p className="av-name">{u.name.split(' ')[0]}</p>
                    <p className="av-sport">{sp?.emoji}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="divider" />

          {/* Chat list */}
          <div className="mat-section">
            <p className="sec-title" style={{marginBottom:12}}>Messages</p>
            <div className="chat-list">
              {matchedUsers.map((u,i) => {
                const sp = SPORTS.find(s => s.id === u.primarySport);
                return (
                  <div key={u.id} className="chat-item anim-up" style={{animationDelay:`${i*0.05}s`}}>
                    <div className="ci-avatar-wrap">
                      <img src={u.photo} alt={u.name} className="ci-avatar" />
                      {u.online && <span className="dot-online ci-dot" />}
                    </div>
                    <div className="ci-info">
                      <div className="ci-top">
                        <span className="ci-name">{u.name}</span>
                        <span className="ci-time">Just now</span>
                      </div>
                      <p className="ci-preview">{PREVIEWS[i % PREVIEWS.length]}</p>
                      <div className="ci-meta">
                        <span className="pill pill-orange" style={{fontSize:'0.65rem'}}>{sp?.emoji} {sp?.name}</span>
                        <span className="ci-loc"><MapPin size={10}/> {u.area}</span>
                      </div>
                    </div>
                    <MessageCircle size={18} className="ci-msg-icon"/>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <div style={{height:90}}/>
    </div>
  );
}
