export function cleanSender(sender = '') {
  const match = sender.match(/^([^<]+)/);
  return match ? match[1].replace(/["']/g, '').trim() : sender;
}

export function extractEmail(sender = '') {
  const match = sender.match(/<([^>]+)>/);
  return match ? match[1].trim() : sender.trim();
}

export function initials(nameOrEmail = '') {
  const clean = nameOrEmail.replace(/<[^>]*>/g, '').replace(/["']/g, '').trim();
  const parts = clean.split(/[ @._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'U';
}

export function avatarColor(text = '') {
  const colors = [
    '#073f9f', '#1e40af', '#0284c7', '#0f766e', '#15803d',
    '#b45309', '#c2410c', '#b91c1c', '#6b21a8', '#86198f'
  ];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatFullDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? dateString
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
