import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = parseISO(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getExpiryStatusColor(days: number): string {
  if (days < 0) return 'text-red-600 bg-red-50';
  if (days <= 3) return 'text-orange-600 bg-orange-50';
  if (days <= 7) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
}

export function getExpiryStatusText(days: number): string {
  if (days < 0) return 'Expired';
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  if (days <= 7) return `Expires in ${days} days`;
  return 'Fresh';
}

