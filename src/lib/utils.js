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
