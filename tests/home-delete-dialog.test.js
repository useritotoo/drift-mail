import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Home view replaces browser confirm with an in-app delete dialog', async () => {
  const source = await readFile(new URL('../src-frontend/views/Home.vue', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /\bconfirm\(/);
  assert.match(source, /const showDeleteConfirm = ref\(false\)/);
  assert.match(source, /const deletingAccount = ref\(false\)/);
  assert.match(source, /function requestDeleteAccount\(\)/);
  assert.match(source, /async function confirmDeleteAccount\(\)/);
  assert.match(source, /@click="requestDeleteAccount"/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /删除当前邮箱/);
});

test('Home view formats mail timestamps through UTC-aware helpers', async () => {
  const source = await readFile(new URL('../src-frontend/views/Home.vue', import.meta.url), 'utf8');

  assert.match(source, /from '@\/utils\/datetime'/);
  assert.match(source, /formatRelativeTime\(mail\.createdAt\)/);
  assert.match(source, /formatLocalDateTime\(showMail\.createdAt\)/);
  assert.doesNotMatch(source, /new Date\(dateStr\)/);
  assert.doesNotMatch(source, /new Date\(mailStore\.expiresAt\)/);
});

test('Home view can switch to an admin inbox of all mailboxes', async () => {
  const source = await readFile(new URL('../src-frontend/views/Home.vue', import.meta.url), 'utf8');

  assert.match(source, /const inboxMode = ref\('current'\)/);
  assert.match(source, /setInboxMode\('all'\)/);
  assert.match(source, /api\.getAdminAccounts\(\)/);
  assert.match(source, /api\.getAdminMessages\(/);
  assert.match(source, /api\.getAdminMessage\(/);
  assert.match(source, /全部邮件/);
  assert.match(source, /收件 \{\{ mailRecipient\(mail\) \}\}/);
});
