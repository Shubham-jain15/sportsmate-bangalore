import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import './Auth.css';

const DEMOS = [
  { email:'rahul@example.com',  name:'Rahul',  sport:'🏸 Badminton', level:'Advanced' },
  { email:'priya@example.com',  name:'Priya',  sport:'🏸 Badminton', level:'Intermediate' },
  { email:'vikram@example.com', name:'Vikram', sport:'🏏 Cricket',    level:'Intermediate' },
  { email:'rohit@example.com',  name:'Rohit',  sport:'⚽ Football',   level:'Intermediate' },
];

export default function Auth() {
  const [tab, setTab]       = useState('login');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [name, setName]     = useState('');
  const [err, setErr]       = useState('');
  const [loading, setLoad]  = useState(false);
  const { login } = useAuth();

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoad(true);
    await new Promise(r => setTimeout(r, 500));
    const res = login(email, pass);
    if (!res.success) setErr(res.error || 'Invalid credentials');
    setLoad(false);
  };

  const quickLogin = async d => {
    setLoad(true);
    await new Promise(r => setTimeout(r, 300));
    login(d.email, 'password');
    setLoad(false);
  };

  return (
    <div className="auth-root">
      <div className="auth-blob b1" /><div className="auth-blob b2" />

      <div className="auth-inner">
        {/* Brand */}
        <div className="auth-brand anim-up">
          <div className="brand-icon"><Zap size={26} fill="#fff" /></div>
          <div>
            <h1 className="brand-name">SportsMate</h1>
            <p className="brand-sub">Bangalore's All-Sport Community</p>
          </div>
        </div>

        {/* Headline */}
        <div className="auth-headline anim-up d1">
          <h2>Play Any Sport,<br /><span className="hl-orange">Find Your Team.</span></h2>
          <p>Badminton · Cricket · Football · Tennis · More</p>
        </div>

        {/* Card */}
        <div className="auth-card anim-up d2">
          <div className="auth-tabs">
            <button className={`at-tab ${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>Log In</button>
            <button className={`at-tab ${tab==='register'?'active':''}`} onClick={()=>setTab('register')}>Sign Up</button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {tab === 'register' && (
              <div className="input-wrap anim-fade">
                <span className="icon"><Zap size={17} /></span>
                <input className="inp" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
            )}
            <div className="input-wrap">
              <span className="icon"><Mail size={17} /></span>
              <input className="inp" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="input-wrap">
              <span className="icon"><Lock size={17} /></span>
              <input className="inp" type="password" placeholder="Password (min 6 chars)" value={pass} onChange={e=>setPass(e.target.value)} required minLength={6} />
            </div>
            {err && <p className="auth-err">{err}</p>}
            <button type="submit" className="btn btn-orange auth-submit" disabled={loading}>
              {loading ? <span className="spinner"/> : <>{tab==='login'?'Log In':'Create Account'} <ArrowRight size={16}/></>}
            </button>
          </form>

          <div className="auth-divider"><span>or try a demo account</span></div>

          <div className="demo-list">
            {DEMOS.map(d => (
              <button key={d.email} className="demo-item" onClick={()=>quickLogin(d)} disabled={loading}>
                <div>
                  <p className="di-name">{d.name}</p>
                  <p className="di-meta">{d.sport} · {d.level}</p>
                </div>
                <ChevronRight size={16} className="di-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
