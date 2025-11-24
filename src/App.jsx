import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('dashboard');
  const [routines, setRoutines] = useState([]);
  const [roles, setRoles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('botToken') || '');
  const [loading, setLoading] = useState(false);

  const API = 'http://localhost:5000';
  const headers = { 'x-bot-token': token, 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!token) return;
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const loadData = async () => {
    try {
      const [r, ro, a, l] = await Promise.all([
        fetch(`${API}/api/routines`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API}/api/roles`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API}/api/announcements`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API}/api/logs`, { headers }).catch(() => ({ ok: false }))
      ]);
      if (r.ok) setRoutines(await r.json());
      if (ro.ok) setRoles(await ro.json());
      if (a.ok) setAnnouncements(await a.json());
      if (l.ok) setLogs(await l.json());
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (token) {
      localStorage.setItem('botToken', token);
      loadData();
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🤖 Discord Bot Panel</h1>
          <form onSubmit={handleTokenSubmit}>
            <input type="password" placeholder="Ingresa el token del bot" value={token} onChange={(e) => setToken(e.target.value)} required />
            <button type="submit">Conectar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header"><h2>🎮 Bot Panel</h2></div>
        <nav className="sidebar-nav">
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>📊 Dashboard</button>
          <button className={page === 'routines' ? 'active' : ''} onClick={() => setPage('routines')}>🏃 Rutinas</button>
          <button className={page === 'roles' ? 'active' : ''} onClick={() => setPage('roles')}>🎭 Roles</button>
          <button className={page === 'announcements' ? 'active' : ''} onClick={() => setPage('announcements')}>📢 Anuncios</button>
          <button className={page === 'logs' ? 'active' : ''} onClick={() => setPage('logs')}>📋 Logs</button>
        </nav>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('botToken');
          setToken('');
        }}>Desconectar</button>
      </div>

      <div className="main-content">
        {page === 'dashboard' && (
          <div className="page">
            <h1>📊 Panel de Control</h1>
            <div className="stats-grid">
              <div className="stat-card"><span className="stat-icon">🏃</span><div className="stat-info"><span className="stat-label">Rutinas</span><span className="stat-value">{routines.length}</span></div></div>
              <div className="stat-card"><span className="stat-icon">🎭</span><div className="stat-info"><span className="stat-label">Roles</span><span className="stat-value">{roles.length}</span></div></div>
              <div className="stat-card"><span className="stat-icon">📢</span><div className="stat-info"><span className="stat-label">Anuncios</span><span className="stat-value">{announcements.length}</span></div></div>
              <div className="stat-card"><span className="stat-icon">📋</span><div className="stat-info"><span className="stat-label">Eventos</span><span className="stat-value">{logs.length}</span></div></div>
            </div>
          </div>
        )}

        {page === 'routines' && (
          <div className="page">
            <h1>🏃 Rutinas</h1>
            <div className="items-grid">
              {routines.map(r => (
                <div key={r.id} className="item-card">
                  <h3>{r.name}</h3>
                  <p>{r.description}</p>
                  <p className="content">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'roles' && (
          <div className="page">
            <h1>🎭 Roles</h1>
            <div className="items-grid">
              {roles.map(r => (
                <div key={r.id} className="item-card">
                  <h3 style={{ color: r.color }}>{r.name}</h3>
                  <p>{r.permissions}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'announcements' && (
          <div className="page">
            <h1>📢 Anuncios</h1>
            <div className="items-grid">
              {announcements.map(a => (
                <div key={a.id} className="item-card">
                  <h3>{a.name}</h3>
                  <p>{a.message}</p>
                  <span className="badge">{a.sent ? '✅ Enviado' : '⏳ Pendiente'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'logs' && (
          <div className="page">
            <h1>📋 Registro de Eventos</h1>
            <div className="logs-container">
              {logs.slice(0, 50).map((log, i) => (
                <div key={i} className={`log-item log-${log.type}`}>
                  <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
