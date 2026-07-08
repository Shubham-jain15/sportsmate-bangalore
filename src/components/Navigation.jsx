import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const NAV = [
  { to:'/',          icon:Home,     label:'Home'    },
  { to:'/discover',  icon:Users,    label:'Match'   },
  { to:'/sessions',  icon:Calendar, label:'Play'    },
  { to:'/courts',    icon:MapPin,   label:'Courts'  },
  { to:'/profile',   icon:User,     label:'Profile' },
];

export default function Navigation() {
  const { matchedUsers } = useAuth();
  return (
    <nav className="bottom-nav">
      {NAV.map(({ to, icon:Icon, label }) => (
        <NavLink key={to} to={to} end={to==='/'} className={({ isActive }) => `nav-item ${isActive?'active':''}`}>
          <div className="nav-ic-wrap">
            <Icon size={22} />
            {label === 'Match' && matchedUsers.length > 0 && (
              <span className="nav-badge">{matchedUsers.length}</span>
            )}
          </div>
          <span className="nav-lbl">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
