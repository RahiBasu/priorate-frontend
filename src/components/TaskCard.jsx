import { assignTask, completeTask } from '../api/tasks';

const STATUS_CONFIG = {
  open: { label: 'Open', bg: '#eeeffd', color: '#6366f1' },
  in_progress: { label: 'In Progress', bg: '#fef9ee', color: '#f59e0b' },
  done: { label: 'Done', bg: '#eefaf4', color: '#10b981' },
  overdue: { label: 'Overdue', bg: '#feeeed', color: '#ef4444' },
};

function getTimeRemaining(dueAt) {
  const diff = new Date(dueAt).getTime() - Date.now();
  if (diff <= 0) return { text: 'Expired', urgent: true };
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { text: hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`, urgent: hours < 2 };
}

export default function TaskCard({ task, onUpdate, accent }) {
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.open;
  const time = getTimeRemaining(task.dueAt);

  async function handleAssign() {
    const updated = await assignTask(task.id);
    onUpdate(updated);
  }

  async function handleComplete() {
    const updated = await completeTask(task.id);
    onUpdate(updated);
  }

  return (
    <div
      style={{
        background: '#ffffff', border: '1px solid #e8e4de',
        borderRadius: 10, padding: '14px',
        transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent || '#c4bfb8';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e8e4de';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4 }}>
          {task.title}
        </h3>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
          whiteSpace: 'nowrap', flexShrink: 0, background: cfg.bg, color: cfg.color,
          textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>
          {cfg.label}
        </span>
      </div>

      {task.description && (
        <p style={{ margin: '0 0 10px', fontSize: 12, color: '#9090a0', lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      <div style={{
        background: '#faf9f7', borderRadius: 6, padding: '8px 10px',
        marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 4
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#c4bfb8' }}>Assignee</span>
          <span style={{ fontSize: 11, color: task.assignee ? '#1a1a2e' : '#c4bfb8', fontFamily: "'DM Mono', monospace" }}>
            {task.assignee || '—'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#c4bfb8' }}>Created</span>
          <span style={{ fontSize: 11, color: '#9090a0', fontFamily: "'DM Mono', monospace" }}>
            {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#c4bfb8' }}>Due</span>
          <span style={{ fontSize: 11, color: time.urgent ? '#ef4444' : '#9090a0', fontFamily: "'DM Mono', monospace" }}>
            {time.text}
          </span>
        </div>
      </div>

      {task.status === 'open' && (
        <button onClick={handleAssign} style={{
          width: '100%', background: '#eeeffd', color: '#6366f1',
          border: '1px solid #c7c8fa', borderRadius: 6, padding: '7px',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.background = '#6366f1'; e.target.style.color = '#fff'; e.target.style.borderColor = '#6366f1'; }}
          onMouseLeave={e => { e.target.style.background = '#eeeffd'; e.target.style.color = '#6366f1'; e.target.style.borderColor = '#c7c8fa'; }}
        >
          Assign to Backend
        </button>
      )}
      {task.status === 'in_progress' && (
        <button onClick={handleComplete} style={{
          width: '100%', background: '#eefaf4', color: '#10b981',
          border: '1px solid #a7f0d0', borderRadius: 6, padding: '7px',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.background = '#10b981'; e.target.style.color = '#fff'; e.target.style.borderColor = '#10b981'; }}
          onMouseLeave={e => { e.target.style.background = '#eefaf4'; e.target.style.color = '#10b981'; e.target.style.borderColor = '#a7f0d0'; }}
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}