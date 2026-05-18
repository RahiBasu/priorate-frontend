import { useState, useEffect } from 'react';
import { fetchTasks } from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';

const COLUMNS = [
  { key: 'open', label: 'Open', accent: '#6366f1' },
  { key: 'in_progress', label: 'In Progress', accent: '#f59e0b' },
  { key: 'done', label: 'Done', accent: '#10b981' },
  { key: 'overdue', label: 'Overdue', accent: '#ef4444' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadTasks() {
    const data = await fetchTasks();
    setTasks(data);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  function handleTaskCreated(task) {
    setTasks(prev => [task, ...prev]);
    setShowForm(false);
  }

  function handleTaskUpdate(updated) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter(t => t.status === col.key);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#f7f6f3', color: '#1a1a2e' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <header style={{
        borderBottom: '1px solid #e8e4de', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: '#fff'
          }}>P</div>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>Priorate</span>
          <span style={{ color: '#c4bfb8', fontSize: 13 }}>/</span>
          <span style={{ color: '#9090a0', fontSize: 13 }}>Tasks</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: '#b0aba3', fontFamily: "'DM Mono', monospace" }}>
              synced {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={() => setShowForm(!showForm)} style={{
            background: showForm ? '#f0ede8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: showForm ? '#6b6b8a' : '#fff', border: 'none', borderRadius: 8,
            padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {COLUMNS.map(col => (
            <div key={col.key} style={{
              background: '#ffffff', border: '1px solid #e8e4de', borderRadius: 10,
              padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 120,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.accent }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: '#1a1a2e' }}>{grouped[col.key]?.length || 0}</div>
                <div style={{ fontSize: 11, color: '#9090a0', marginTop: 2 }}>{col.label}</div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div style={{ marginBottom: '2rem' }}>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {COLUMNS.map(col => (
            <div key={col.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', padding: '0 4px' }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: col.accent }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9090a0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {col.label}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 11, background: '#ede9e3', color: '#9090a0', borderRadius: 20, padding: '2px 8px' }}>
                  {grouped[col.key]?.length || 0}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {grouped[col.key]?.length === 0 && (
                  <div style={{ border: '1px dashed #e8e4de', borderRadius: 10, padding: '2rem', textAlign: 'center', color: '#c4bfb8', fontSize: 12 }}>
                    No tasks
                  </div>
                )}
                {grouped[col.key]?.map(t => (
                  <TaskCard key={t.id} task={t} onUpdate={handleTaskUpdate} accent={col.accent} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}