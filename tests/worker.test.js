import test from 'node:test';
import assert from 'node:assert/strict';

import worker from '../src/index.js';

function createDbMock(options = {}) {
  const existingObjects = new Set();
  const statements = [];
  const insertedMessages = [];
  const insertedAttachments = [];
  const accounts = options.accounts || [];
  const domains = options.domains || [];
  const messages = options.messages || [];
  const attachments = options.attachments || [];

  function createStatement(sql) {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    let boundArgs = [];

    return {
      bind(...args) {
        boundArgs = args;
        return this;
      },
      async all() {
        if (/FROM sqlite_(schema|master)/i.test(normalized)) {
          return {
            results: [...existingObjects].map((name) => ({ name })),
          };
        }

        if (/SELECT id, domain, is_verified, created_at FROM domains/i.test(normalized)) {
          if (!existingObjects.has('domains')) {
            throw new Error('no such table: domains');
          }
          return { results: domains };
        }

        if (/SELECT domain FROM domains/i.test(normalized)) {
          if (!existingObjects.has('domains')) {
            throw new Error('no such table: domains');
          }
          return { results: [] };
        }

        if (/SELECT id FROM accounts WHERE expires_at/i.test(normalized)) {
          if (!existingObjects.has('accounts')) {
            throw new Error('no such table: accounts');
          }
          return { results: [] };
        }

        if (/SELECT \* FROM accounts WHERE address = \? AND .*expires_at/i.test(normalized)) {
          if (!existingObjects.has('accounts')) {
            throw new Error('no such table: accounts');
          }
          return {
            results: accounts.filter((account) => account.address === boundArgs[0]),
          };
        }

        if (/FROM accounts a/i.test(normalized) && /LEFT JOIN messages m/i.test(normalized)) {
          if (!existingObjects.has('accounts')) {
            throw new Error('no such table: accounts');
          }
          return {
            results: accounts.map((account) => ({
              ...account,
              message_count: messages.filter((message) => message.account_id === account.id).length,
              unread_count: messages.filter((message) => message.account_id === account.id && !message.seen).length,
            })),
          };
        }

        if (/SELECT COUNT\(\*\) as total FROM messages WHERE account_id = \?/i.test(normalized)) {
          return {
            results: [{
              total: messages.filter((message) => message.account_id === boundArgs[0]).length,
            }],
          };
        }

        if (/SELECT COUNT\(\*\) as total FROM messages$/i.test(normalized)) {
          return { results: [{ total: messages.length }] };
        }

        if (/FROM messages WHERE account_id = \? ORDER BY created_at DESC/i.test(normalized)) {
          const limit = boundArgs[1] ?? messages.length;
          const offset = boundArgs[2] ?? 0;
          return {
            results: messages
              .filter((message) => message.account_id === boundArgs[0])
              .slice(offset, offset + limit),
          };
        }

        if (/FROM messages ORDER BY created_at DESC/i.test(normalized)) {
          const limit = boundArgs[0] ?? messages.length;
          const offset = boundArgs[1] ?? 0;
          return { results: messages.slice(offset, offset + limit) };
        }

        if (/SELECT \* FROM messages WHERE id = \? AND account_id = \?/i.test(normalized)) {
          return {
            results: messages.filter((message) => (
              message.id === boundArgs[0] && message.account_id === boundArgs[1]
            )),
          };
        }

        if (/SELECT \* FROM messages WHERE id = \?/i.test(normalized)) {
          return { results: messages.filter((message) => message.id === boundArgs[0]) };
        }

        if (/SELECT id FROM messages WHERE id = \?/i.test(normalized)) {
          return { results: messages.filter((message) => message.id === boundArgs[0]).map((message) => ({ id: message.id })) };
        }

        if (/SELECT id, filename, content_type, size FROM attachments WHERE message_id = \?/i.test(normalized)) {
          return {
            results: attachments.filter((attachment) => attachment.message_id === boundArgs[0]),
          };
        }

        return { results: [] };
      },
      async run() {
        const tableMatch = normalized.match(/^CREATE TABLE IF NOT EXISTS (\w+)/i);
        if (tableMatch) {
          existingObjects.add(tableMatch[1]);
        }

        const indexMatch = normalized.match(/^CREATE INDEX IF NOT EXISTS (\w+)/i);
        if (indexMatch) {
          existingObjects.add(indexMatch[1]);
        }

        if (/^INSERT INTO messages /i.test(normalized)) {
          insertedMessages.push({
            id: boundArgs[0],
            accountId: boundArgs[1],
            fromName: boundArgs[2],
            fromAddress: boundArgs[3],
            toAddress: boundArgs[4],
            subject: boundArgs[5],
            text: boundArgs[6],
            html: boundArgs[7],
            hasAttachments: boundArgs[8],
            size: boundArgs[9],
            rawSource: boundArgs[10],
          });
        }

        if (/^INSERT INTO attachments /i.test(normalized)) {
          insertedAttachments.push({
            id: boundArgs[0],
            messageId: boundArgs[1],
            filename: boundArgs[2],
            contentType: boundArgs[3],
            size: boundArgs[4],
            content: boundArgs[5],
          });
        }

        return { success: true };
      },
    };
  }

  return {
    statements,
    insertedMessages,
    insertedAttachments,
    prepare(sql) {
      statements.push(sql);
      return createStatement(sql);
    },
  };
}

test('fetch ensures schema even when KV initialization marker is stale', async () => {
  const db = createDbMock();
  const env = {
    ACCESS_KEY: 'secret',
    DB: db,
    MAIL_KV: {
      async get(key) {
        return key === 'db_initialized' ? 'true' : null;
      },
      async put() {},
    },
  };

  const response = await worker.fetch(
    new Request('https://example.com/api/domains', {
      headers: { 'X-Access-Key': 'secret' },
    }),
    env,
    {},
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body['hydra:member'], []);
  assert.ok(
    db.statements.some((sql) => /CREATE TABLE IF NOT EXISTS domains/i.test(sql)),
    'expected schema creation before querying domains',
  );
});

test('scheduled ensures schema before cleanup queries run', async () => {
  const db = createDbMock();
  const env = {
    DB: db,
    MAIL_KV: {
      async get() {
        return 'true';
      },
      async put() {},
    },
  };

  await worker.scheduled({}, env, {});

  assert.ok(
    db.statements.some((sql) => /CREATE TABLE IF NOT EXISTS accounts/i.test(sql)),
    'expected schema creation before scheduled cleanup',
  );
});

test('email decodes simplified Chinese headers before storing message metadata', async () => {
  const db = createDbMock({
    accounts: [{ id: 'acc-1', address: 'user@example.com' }],
  });
  const env = {
    DB: db,
    MAIL_KV: {
      async get() {
        return 'true';
      },
      async put() {},
    },
  };
  const rawEmail = [
    'From: =?GB18030?B?1cXI/Q==?= <sender@example.com>',
    'Subject: =?GB18030?B?vPLM5dbQzsTW98zi?=',
    'Content-Type: multipart/mixed; boundary="mail-boundary"',
    '',
    '--mail-boundary',
    'Content-Type: text/plain; charset=GB18030',
    'Content-Transfer-Encoding: base64',
    '',
    '1f3OxMTayN0=',
    '--mail-boundary',
    'Content-Type: application/octet-stream; name="=?GB18030?B?uL28/i50eHQ=?="',
    'Content-Disposition: attachment; filename="=?GB18030?B?uL28/i50eHQ=?="',
    'Content-Transfer-Encoding: base64',
    '',
    'YQ==',
    '--mail-boundary--',
  ].join('\r\n');
  const rejected = [];
  const message = {
    to: 'user@example.com',
    from: 'bounce@example.com',
    raw: rawEmail,
    headers: new Headers({
      subject: '=?GB18030?B?vPLM5dbQzsTW98zi?=',
    }),
    setReject(reason) {
      rejected.push(reason);
    },
  };

  await worker.email(message, env, {});

  assert.deepEqual(rejected, []);
  assert.equal(db.insertedMessages.length, 1);
  assert.equal(db.insertedAttachments.length, 1);
  assert.equal(db.insertedMessages[0].fromName, '张三');
  assert.equal(db.insertedMessages[0].fromAddress, 'sender@example.com');
  assert.equal(db.insertedMessages[0].subject, '简体中文主题');
  assert.equal(db.insertedMessages[0].text, '正文内容');
  assert.equal(db.insertedAttachments[0].filename, '附件.txt');
});

test('email preserves simplified Chinese 8bit body bytes before charset decoding', async () => {
  const db = createDbMock({
    accounts: [{ id: 'acc-1', address: 'user@example.com' }],
  });
  const env = {
    DB: db,
    MAIL_KV: {
      async get() {
        return 'true';
      },
      async put() {},
    },
  };
  const headerBytes = new TextEncoder().encode([
    'From: sender@example.com',
    'Subject: =?GB18030?B?vPLM5dbQzsTW98zi?=',
    'Content-Type: text/plain; charset=GB18030',
    'Content-Transfer-Encoding: 8bit',
    '',
    '',
  ].join('\r\n'));
  const bodyBytes = Uint8Array.from([0xD5, 0xFD, 0xCE, 0xC4, 0xC4, 0xDA, 0xC8, 0xDD]);
  const rawBytes = new Uint8Array(headerBytes.length + bodyBytes.length);
  rawBytes.set(headerBytes, 0);
  rawBytes.set(bodyBytes, headerBytes.length);
  const message = {
    to: 'user@example.com',
    from: 'sender@example.com',
    raw: rawBytes,
    headers: new Headers({
      subject: '=?GB18030?B?vPLM5dbQzsTW98zi?=',
    }),
    setReject() {},
  };

  await worker.email(message, env, {});

  assert.equal(db.insertedMessages.length, 1);
  assert.equal(db.insertedMessages[0].text, '正文内容');
});

test('API timestamps are normalized from SQLite UTC to ISO 8601 UTC', async () => {
  const db = createDbMock({
    domains: [{
      id: 'd1',
      domain: 'example.com',
      is_verified: 1,
      created_at: '2024-06-01 08:30:00',
    }],
  });
  const env = {
    ACCESS_KEY: 'secret',
    DB: db,
    MAIL_KV: {
      async get(key) {
        return key === 'db_initialized' ? 'true' : null;
      },
      async put() {},
    },
  };

  const response = await worker.fetch(
    new Request('https://example.com/api/domains', {
      headers: { 'X-Access-Key': 'secret' },
    }),
    env,
    {},
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body['hydra:member'][0].createdAt, '2024-06-01T08:30:00.000Z');
});

function adminTestMessage(overrides = {}) {
  return {
    id: 'msg-1',
    msgid: '<msg-1@example.com>',
    account_id: 'acc-1',
    subject: 'Hello',
    from_name: 'Sender',
    from_address: 'sender@example.com',
    to_address: 'one@example.com',
    seen: 0,
    has_attachments: 0,
    size: 12,
    text: 'body',
    html: null,
    created_at: '2024-06-01 08:30:00',
    ...overrides,
  };
}

test('admin message routes require ACCESS_KEY', async () => {
  const env = {
    ACCESS_KEY: 'secret',
    DB: createDbMock(),
    MAIL_KV: {
      async get(key) {
        return key === 'db_initialized' ? 'true' : null;
      },
      async put() {},
    },
  };

  const response = await worker.fetch(
    new Request('https://example.com/api/admin/messages'),
    env,
    {},
  );

  assert.equal(response.status, 401);
});

test('admin can list messages from every mailbox', async () => {
  const db = createDbMock({
    accounts: [
      { id: 'acc-1', address: 'one@example.com', expires_at: '2024-06-01 10:00:00', created_at: '2024-06-01 08:00:00' },
      { id: 'acc-2', address: 'two@example.com', expires_at: '2024-06-01 10:00:00', created_at: '2024-06-01 08:10:00' },
    ],
    messages: [
      adminTestMessage(),
      adminTestMessage({
        id: 'msg-2',
        account_id: 'acc-2',
        subject: 'Second',
        to_address: 'two@example.com',
        seen: 1,
      }),
    ],
  });
  const env = {
    ACCESS_KEY: 'secret',
    DB: db,
    MAIL_KV: {
      async get(key) {
        return key === 'db_initialized' ? 'true' : null;
      },
      async put() {},
    },
  };

  const listResponse = await worker.fetch(
    new Request('https://example.com/api/admin/messages', {
      headers: { 'X-Access-Key': 'secret' },
    }),
    env,
    {},
  );
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json();
  assert.equal(listBody['hydra:totalItems'], 2);
  assert.equal(listBody['hydra:member'].length, 2);
  assert.equal(listBody['hydra:member'][0].to[0].address, 'one@example.com');
  assert.equal(listBody['hydra:member'][0].createdAt, '2024-06-01T08:30:00.000Z');

  const filteredResponse = await worker.fetch(
    new Request('https://example.com/api/admin/messages?accountId=acc-2', {
      headers: { 'X-Access-Key': 'secret' },
    }),
    env,
    {},
  );
  const filteredBody = await filteredResponse.json();
  assert.equal(filteredBody['hydra:totalItems'], 1);
  assert.equal(filteredBody['hydra:member'][0].id, 'msg-2');

  const accountsResponse = await worker.fetch(
    new Request('https://example.com/api/admin/accounts', {
      headers: { 'X-Access-Key': 'secret' },
    }),
    env,
    {},
  );
  const accountsBody = await accountsResponse.json();
  assert.equal(accountsBody['hydra:totalItems'], 2);
  assert.equal(accountsBody['hydra:member'].find((account) => account.id === 'acc-1').messageCount, 1);
  assert.equal(accountsBody['hydra:member'].find((account) => account.id === 'acc-2').address, 'two@example.com');

  const detailResponse = await worker.fetch(
    new Request('https://example.com/api/admin/messages/msg-2', {
      headers: { 'X-Access-Key': 'secret' },
    }),
    env,
    {},
  );
  assert.equal(detailResponse.status, 200);
  const detailBody = await detailResponse.json();
  assert.equal(detailBody.subject, 'Second');
  assert.equal(detailBody.to[0].address, 'two@example.com');
});
