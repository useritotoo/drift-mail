/**
 * Canonical timestamp format:
 * - API / frontend: ISO 8601 UTC, e.g. 2024-01-01T08:00:00.000Z
 * - SQLite storage: UTC without timezone, e.g. 2024-01-01 08:00:00
 *
 * datetime('now') is UTC. A timezone-less "YYYY-MM-DD HH:MM:SS" string is
 * parsed as local time by JS Date, which shifts UTC+8 displays by 8 hours.
 */

const SQLITE_UTC_RE = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2}(?:\.\d+)?)$/;
const HAS_TIMEZONE_RE = /(?:[zZ]|[+-]\d{2}:\d{2})$/;

export function parseUtcDate(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (HAS_TIMEZONE_RE.test(trimmed)) {
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const sqliteUtc = trimmed.match(SQLITE_UTC_RE);
  if (sqliteUtc) {
    const date = new Date(`${sqliteUtc[1]}T${sqliteUtc[2]}Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toIsoUtc(value) {
  if (value == null || value === '') return value ?? null;
  const date = parseUtcDate(value);
  return date ? date.toISOString() : (typeof value === 'string' ? value.trim() : null);
}

export function toSqliteUtc(value) {
  const iso = toIsoUtc(value);
  if (!iso || typeof iso !== 'string') return iso;
  return iso.replace('T', ' ').replace(/\.\d{3}Z$/i, '').replace(/Z$/i, '');
}
