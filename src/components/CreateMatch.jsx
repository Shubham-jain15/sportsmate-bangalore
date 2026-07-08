import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { SPORTS, COURTS } from '../data/users';
import './CreateMatch.css';

const FORMATS = {
  badminton:    ['Singles 1v1', 'Doubles 2v2', 'Mixed Doubles'],
  tennis:       ['Singles 1v1', 'Doubles 2v2', 'Mixed Doubles'],
  cricket:      ['Gully 4v4', 'Box Cricket 6v6', 'Full 11v11'],
  football:     ['3-a-side', '5-a-side', '7-a-side', '11-a-side'],
  basketball:   ['3v3 Streetball', '5v5 Full Court'],
  'table-tennis':['Singles', 'Doubles'],
  squash:       ['Singles'],
  volleyball:   ['3v3 Beach', '6v6 Indoor'],
};

const LEVELS = ['Any Level', 'Beginner', 'Intermediate', 'Advanced', 'Pro'];

export default function CreateMatch() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    sport: '', format: '', level: 'Any Level', court: '', date: '', time: '', spots: 2, fee: '',
  });
  const [created, setCreated] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    setCreated(true);
    setTimeout(() => navigate('/sessions'), 2000);
  };

  if (created) return (
    <div className="cm-success">
      <CheckCircle size={60} color="var(--green)" />
      <h2>Session Created!</h2>
      <p>Players near you will be notified. Redirecting…</p>
    </div>
  );

  return (
    <div className="cm-root">
      {/* Header */}
      <div className="cm-header">
        <button className="back-btn" onClick={() => step > 1 ? setStep(s => s-1) : navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="cm-title">Create Session</h2>
          <p className="cm-sub">Step {step} of 3</p>
        </div>
        <div className="cm-progress">
          {[1,2,3].map(n => <div key={n} className={`cp-dot ${step >= n ? 'done' : ''}`} />)}
        </div>
      </div>

      <div className="cm-body">
        {/* Step 1: Pick sport */}
        {step === 1 && (
          <div className="cm-step anim-up">
            <h3 className="step-q">Which sport? 🏅</h3>
            <div className="sport-select-grid">
              {SPORTS.map(s => (
                <button key={s.id} className={`sport-select-card ${form.sport === s.id ? 'selected' : ''}`}
                        style={{ '--sc': s.color }} onClick={() => set('sport', s.id)}>
                  <span className="ssc-emoji">{s.emoji}</span>
                  <span className="ssc-name">{s.name}</span>
                  <span className="ssc-format">{s.players}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-orange step-next" disabled={!form.sport} onClick={() => setStep(2)}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Format, level, spots, fee */}
        {step === 2 && (
          <div className="cm-step anim-up">
            <h3 className="step-q">Session details</h3>
            <div className="cm-fields">
              <div className="cm-field">
                <label className="cm-label">Format</label>
                <div className="cm-chips">
                  {(FORMATS[form.sport] || []).map(f => (
                    <button key={f} className={`cm-chip ${form.format === f ? 'active' : ''}`} onClick={() => set('format', f)}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="cm-field">
                <label className="cm-label">Skill Level</label>
                <div className="cm-chips">
                  {LEVELS.map(l => (
                    <button key={l} className={`cm-chip ${form.level === l ? 'active' : ''}`} onClick={() => set('level', l)}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="cm-field">
                <label className="cm-label">Total Spots</label>
                <div className="spots-control">
                  <button className="sp-btn" onClick={() => set('spots', Math.max(2, form.spots - 1))}>−</button>
                  <span className="sp-val">{form.spots}</span>
                  <button className="sp-btn" onClick={() => set('spots', Math.min(22, form.spots + 1))}>+</button>
                </div>
              </div>

              <div className="cm-field">
                <label className="cm-label">Fee per player (₹)</label>
                <input className="cm-input" type="number" placeholder="0 for free" value={form.fee}
                       onChange={e => set('fee', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-orange step-next" disabled={!form.format} onClick={() => setStep(3)}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: Date, time, court */}
        {step === 3 && (
          <div className="cm-step anim-up">
            <h3 className="step-q">When & Where?</h3>
            <div className="cm-fields">
              <div className="cm-field">
                <label className="cm-label">Date</label>
                <input className="cm-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="cm-field">
                <label className="cm-label">Time</label>
                <input className="cm-input" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
              </div>
              <div className="cm-field">
                <label className="cm-label">Venue</label>
                <div className="court-select-list">
                  {COURTS.filter(c => c.sports.includes(form.sport)).map(c => (
                    <button key={c.id} className={`court-select-item ${form.court === c.id ? 'selected' : ''}`}
                            onClick={() => set('court', c.id)}>
                      <div>
                        <p className="csi-name">{c.name}</p>
                        <p className="csi-meta">{c.area} · {c.distance} · {c.price}</p>
                      </div>
                      {form.court === c.id && <CheckCircle size={18} color="var(--orange)" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="btn btn-orange step-next" disabled={!form.date || !form.time || !form.court}
                    onClick={handleCreate}>
              🚀 Create Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
