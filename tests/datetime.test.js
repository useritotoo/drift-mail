import test from 'node:test';
import assert from 'node:assert/strict';

import { parseUtcDate, toIsoUtc, toSqliteUtc } from '../src/datetime.js';
import { formatRelativeTime, formatLocalDateTime } from '../src-frontend/utils/datetime.js';

test('SQLite UTC datetime is treated as UTC, not local time', () => {
  const date = parseUtcDate('2024-06-01 08:30:00');
  assert.ok(date);
  assert.equal(date.toISOString(), '2024-06-01T08:30:00.000Z');
});

test('ISO 8601 timestamps round-trip without shifting', () => {
  assert.equal(toIsoUtc('2024-06-01T08:30:00.000Z'), '2024-06-01T08:30:00.000Z');
  assert.equal(toIsoUtc('2024-06-01T08:30:00Z'), '2024-06-01T08:30:00.000Z');
  assert.equal(toSqliteUtc('2024-06-01T08:30:00.000Z'), '2024-06-01 08:30:00');
});

test('timezone-less datetime with T is treated as UTC', () => {
  assert.equal(toIsoUtc('2024-06-01T08:30:00'), '2024-06-01T08:30:00.000Z');
});

test('API helper converts stored SQLite datetime to ISO 8601 UTC', () => {
  assert.equal(toIsoUtc('2024-06-01 08:30:00'), '2024-06-01T08:30:00.000Z');
});

test('relative mail time uses UTC so it does not appear 8 hours early', () => {
  const now = new Date('2024-06-01T08:35:00.000Z');
  assert.equal(formatRelativeTime('2024-06-01 08:30:00', now), '5分钟前');
  assert.equal(formatRelativeTime('2024-06-01T08:30:00.000Z', now), '5分钟前');
});

test('absolute mail time formats in the local timezone', () => {
  const formatted = formatLocalDateTime('2024-06-01T08:30:00.000Z');
  const expected = new Date('2024-06-01T08:30:00.000Z').toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  assert.equal(formatted, expected);
  assert.notEqual(formatted, '');
});
