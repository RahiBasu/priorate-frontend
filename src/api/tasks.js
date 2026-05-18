const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`);
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function assignTask(id) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}/assign`, {
    method: 'POST',
  });
  return res.json();
}

export async function completeTask(id) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}/complete`, {
    method: 'POST',
  });
  return res.json();
}