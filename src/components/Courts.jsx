import React, { useState } from 'react';
import { MapPin, Star, Clock, CheckCircle, WifiOff } from 'lucide-react';
import { COURTS, SPORTS } from '../data/users';
import './Courts.css';

export default function Courts() {
  const [sportFilter, setSportFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const list = sportFilter === 'all' ? COURTS : COURTS.filter(c => c.sports.includes(sportFilter));
  const sportsCovered = [...new Set(COURTS.flatMap(c => c.sports))];

  return (
    <div className="cts-root">
      <div className="cts-topbar">
        <div>
          <h2 className="cts-title">Nearby Courts</h2>
          <p className="cts-sub"><MapPin size={12}/> Bangalore · {list.length} venues</p>
        </div>
      </div>

      {/* Sport filter */}
      <div className="cts-filters">
        <button className={`sport-pill ${sportFilter==='all'?'active':''}`} onClick={()=>setSportFilter('all')}>🏟️ All</button>
        {sportsCovered.map(sid => {
          const sp = SPORTS.find(s => s.id === sid);
          return sp ? (
            <button key={sid} className={`sport-pill ${sportFilter===sid?'active':''}`}
                    style={{'--pc':sp.color}} onClick={()=>setSportFilter(sid)}>
              {sp.emoji} {sp.name}
            </button>
          ) : null;
        })}
      </div>

      <div className="cts-list">
        {list.map((c,i) => (
          <div key={c.id} className={`cts-card anim-up ${expanded===c.id?'cts-expanded':''}`} style={{animationDelay:`${i*0.06}s`}}>
            <div className="cts-img-wrap">
              <img src={c.image} alt={c.name} className="cts-img"/>
              <div className="cts-overlay-top">
                <span className={`pill ${c.available?'pill-green':'pill-red'}`}>
                  {c.available ? <><CheckCircle size={11}/> Open Now</> : <><WifiOff size={11}/> Full</>}
                </span>
                <span className="cts-price">{c.price}</span>
              </div>
            </div>

            <div className="cts-info" onClick={()=>setExpanded(expanded===c.id?null:c.id)}>
              <div className="cts-name-row">
                <h3 className="cts-name">{c.name}</h3>
                <div className="stars"><Star size={12} fill="currentColor"/>{c.rating}<span>({c.reviewCount})</span></div>
              </div>
              <p className="cts-area"><MapPin size={12}/> {c.area} · {c.distance}</p>
              <div className="cts-meta-row">
                <span className="cts-chip">🏸 {c.courts} courts</span>
                <span className="cts-chip"><Clock size={11}/> {c.open}</span>
              </div>
              {/* Sports tags */}
              <div className="cts-sports">
                {c.sports.map(sid => {
                  const sp = SPORTS.find(s => s.id === sid);
                  return sp ? <span key={sid} className="cts-sport-tag">{sp.emoji} {sp.name}</span> : null;
                })}
              </div>

              {expanded === c.id && (
                <div className="cts-amenities anim-fade">
                  <p className="cts-am-title">Amenities</p>
                  <div className="am-tags">{c.amenities.map(a=><span key={a} className="am-tag">{a}</span>)}</div>
                  <button className="btn btn-orange" style={{width:'100%',padding:'12px',marginTop:10}}>Book Court</button>
                </div>
              )}
              <button className="expand-toggle" style={{marginTop:6}}>
                {expanded===c.id?'▲ Less':'▼ Amenities & Book'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:90}}/>
    </div>
  );
}
