export function formatDuration(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getDateString(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toISOString().split('T')[0];
}

export function getDayStart(dateString: string): number {
  return new Date(dateString + 'T00:00:00').getTime();
}

export function getDayEnd(dateString: string): number {
  return new Date(dateString + 'T23:59:59.999').getTime();
}

export function isToday(dateString: string): boolean {
  return dateString === getDateString();
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
