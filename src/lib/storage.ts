// Progresso da usuária persistido no localStorage.

const KEY = "youga.completedSessions";

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function getCompleted(): Set<string> {
  return load();
}

export function toggleCompleted(sessionKey: string): Set<string> {
  const set = load();
  if (set.has(sessionKey)) {
    set.delete(sessionKey);
  } else {
    set.add(sessionKey);
  }
  localStorage.setItem(KEY, JSON.stringify([...set]));
  return set;
}
