import { useState } from 'react';
import { createTask } from '../api/tasks';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueInHours, setDueInHours] = useState(24);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const task = await createTask({ title, description, dueInHours: Number(dueInHours) });
    setTitle('');
    setDescription('');
    setDueInHours(24);
    setLoading(false);
    onTaskCreated(task);
  }

  const inputStyle = {
    width: '100%', background: '#faf9f7', border: '1px solid #e8e4de',
    borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1a1a2e',
    outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#9090a0',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#ffffff', border: '1px solid #e8e4de',
      borderRadius: 12, padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.25rem', marginTop: 0, color: '#1a1a2e' }}>
        Create Task
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="What needs to be done?"
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e8e4de'}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: 'none', height: 72 }}
            placeholder="Optional details..."
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e8e4de'}
          />
        </div>
        <div>
          <label style={labelStyle}>Due In (hours)</label>
          <input
            type="number"
            value={dueInHours}
            onChange={e => setDueInHours(e.target.value)}
            style={inputStyle}
            min={1}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e8e4de'}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            style={{
              width: '100%',
              background: loading || !title.trim() ? '#f0ede8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: loading || !title.trim() ? '#c4bfb8' : '#fff',
              border: 'none', borderRadius: 8, padding: '10px 20px',
              fontSize: 13, fontWeight: 500,
              cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
          >
            {loading ? 'Creating...' : 'Create Task →'}
          </button>
        </div>
      </div>
    </form>
  );
}