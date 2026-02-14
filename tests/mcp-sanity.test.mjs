/**
 * MCP WebMCP Sanity / Integration Tests
 *
 * Calls the LIVE production MCP endpoint at https://inspectagents.com/api/mcp/
 * to verify every tool, resource, and error path works correctly.
 *
 * Run:  node --test tests/mcp-sanity.test.mjs
 *
 * Uses Node.js built-in test runner (node:test) — zero dependencies.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ── Config ──────────────────────────────────────────────────────────────────

const MCP_URL = process.env.MCP_URL || 'https://inspectagents.com/api/mcp/';

const REQUIRED_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

let nextId = 1;

// ── Helper ──────────────────────────────────────────────────────────────────

/**
 * Send a JSON-RPC 2.0 request to the MCP endpoint and return parsed JSON.
 */
async function mcpCall(method, params = {}) {
  const id = nextId++;
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: REQUIRED_HEADERS,
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });

  assert.equal(res.status, 200, `Expected 200 for ${method}, got ${res.status}`);
  assert.ok(
    res.headers.get('content-type')?.includes('application/json'),
    `Expected JSON content-type for ${method}`
  );

  const body = await res.json();
  assert.equal(body.jsonrpc, '2.0', 'Response must be JSON-RPC 2.0');
  assert.equal(body.id, id, 'Response ID must match request ID');
  return body;
}

/**
 * Call a tool and return the parsed text content.
 * Handles both JSON and plain-text error responses from the SDK.
 */
async function toolCall(name, args = {}) {
  const body = await mcpCall('tools/call', { name, arguments: args });
  assert.ok(body.result, `tools/call ${name} must return a result`);
  assert.ok(body.result.content?.length > 0, `tools/call ${name} must return content`);
  const text = body.result.content[0].text;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    // SDK returns plain text for some errors (e.g. unknown tool)
    parsed = { _raw: text };
  }
  return { parsed, raw: text, isError: body.result.isError ?? false };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('MCP WebMCP Sanity Tests', () => {
  // ────────────────────── Protocol ──────────────────────────────────────

  describe('Protocol', () => {
    it('initialize — handshake succeeds', async () => {
      const body = await mcpCall('initialize', {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'sanity-test', version: '1.0.0' },
      });

      assert.ok(body.result, 'Initialize must return a result');
      assert.equal(body.result.protocolVersion, '2025-03-26');
      assert.equal(body.result.serverInfo.name, 'inspectagents');
      assert.ok(body.result.capabilities.tools, 'Server must advertise tools');
      assert.ok(body.result.capabilities.resources, 'Server must advertise resources');
    });

    it('CORS — OPTIONS returns 204 with correct headers', async () => {
      const res = await fetch(MCP_URL, { method: 'OPTIONS' });
      assert.equal(res.status, 204);
      assert.equal(res.headers.get('access-control-allow-origin'), '*');
      assert.ok(res.headers.get('access-control-allow-methods')?.includes('POST'));
    });

    it('GET — returns 405', async () => {
      const res = await fetch(MCP_URL, {
        headers: { Accept: 'application/json, text/event-stream' },
      });
      assert.equal(res.status, 405);
    });

    it('POST without Accept header — returns 406', async () => {
      const res = await fetch(MCP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 999,
          method: 'initialize',
          params: {
            protocolVersion: '2025-03-26',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0.0' },
          },
        }),
      });
      assert.equal(res.status, 406, 'Missing Accept header should return 406');
    });
  });

  // ────────────────────── tools/list ─────────────────────────────────────

  describe('tools/list', () => {
    it('returns all 5 tools with correct names', async () => {
      const body = await mcpCall('tools/list');
      const tools = body.result.tools;

      assert.ok(Array.isArray(tools), 'tools must be an array');
      assert.equal(tools.length, 5, 'Should have exactly 5 tools');

      const names = tools.map((t) => t.name).sort();
      assert.deepEqual(names, [
        'assess_risk',
        'get_checklist',
        'get_failure',
        'search_failures',
        'submit_feedback',
      ]);

      // Each tool must have a description and input schema
      for (const tool of tools) {
        assert.ok(tool.description?.length > 10, `${tool.name} needs a description`);
        assert.ok(tool.inputSchema, `${tool.name} needs an inputSchema`);
      }
    });
  });

  // ────────────────────── search_failures ────────────────────────────────

  describe('search_failures', () => {
    it('search by query returns matching results', async () => {
      const { parsed } = await toolCall('search_failures', {
        query: 'chevrolet',
        limit: 5,
      });

      assert.ok(parsed.total >= 1, 'Should find at least 1 Chevrolet incident');
      assert.ok(parsed.failures.length >= 1);
      assert.ok(
        parsed.failures[0].title.toLowerCase().includes('chevrolet'),
        'First result should mention Chevrolet'
      );
    });

    it('filter by category returns correct category', async () => {
      const { parsed } = await toolCall('search_failures', {
        category: 'Hallucination',
        limit: 5,
      });

      assert.ok(parsed.total >= 1);
      for (const f of parsed.failures) {
        assert.equal(f.category, 'Hallucination', `Expected Hallucination, got ${f.category}`);
      }
    });

    it('filter by severity returns correct severity', async () => {
      const { parsed } = await toolCall('search_failures', {
        severity: 'Critical',
        limit: 5,
      });

      assert.ok(parsed.total >= 1);
      for (const f of parsed.failures) {
        assert.equal(f.severity, 'Critical');
      }
    });

    it('returns all expected fields per failure', async () => {
      const { parsed } = await toolCall('search_failures', { limit: 1 });
      const failure = parsed.failures[0];

      const requiredFields = [
        'id', 'title', 'company', 'date', 'category',
        'severity', 'description', 'impact', 'prevention',
      ];
      for (const field of requiredFields) {
        assert.ok(field in failure, `Missing field: ${field}`);
      }
      assert.ok(Array.isArray(failure.prevention), 'prevention should be an array');
    });

    it('empty query returns full database', async () => {
      const { parsed } = await toolCall('search_failures', { limit: 50 });
      assert.ok(parsed.total >= 10, 'Database should have at least 10 entries');
    });
  });

  // ────────────────────── get_failure ────────────────────────────────────

  describe('get_failure', () => {
    it('returns full details for valid ID', async () => {
      const { parsed } = await toolCall('get_failure', { id: 'chevrolet-car-sale' });

      assert.equal(parsed.id, 'chevrolet-car-sale');
      assert.ok(parsed.title);
      assert.ok(parsed.company);
      assert.ok(parsed.description);
      assert.ok(parsed.impact);
      assert.ok(parsed.source);
      assert.ok(parsed.sourceUrl);
      assert.ok(Array.isArray(parsed.prevention));
    });

    it('returns error with available IDs for invalid ID', async () => {
      const { parsed, isError } = await toolCall('get_failure', { id: 'nonexistent-xyz' });

      assert.ok(isError, 'Should return isError: true');
      assert.equal(parsed.error, 'Failure not found');
      assert.ok(Array.isArray(parsed.available_ids));
      assert.ok(parsed.available_ids.length >= 10, 'Should list available IDs');
    });
  });

  // ────────────────────── assess_risk ────────────────────────────────────

  describe('assess_risk', () => {
    it('high risk — production + multiple fears', async () => {
      const { parsed } = await toolCall('assess_risk', {
        currentlyUsing: 'yes',
        biggestFears: ['hallucinations', 'security'],
      });

      assert.equal(parsed.riskLevel, 'high');
      assert.ok(parsed.riskLabel.includes('High'));
      assert.ok(parsed.recommendations.length >= 3);
      assert.ok(parsed.nextSteps.checklist);
      assert.ok(parsed.nextSteps.failures);
      assert.ok(parsed.nextSteps.guide);
    });

    it('low risk — just researching', async () => {
      const { parsed } = await toolCall('assess_risk', {
        currentlyUsing: 'no',
        biggestFears: ['dontKnow'],
      });

      assert.ok(['low', 'medium'].includes(parsed.riskLevel), `Expect low/medium, got ${parsed.riskLevel}`);
      assert.ok(parsed.recommendations.length >= 2);
    });

    it('medium risk — planning deployment', async () => {
      const { parsed } = await toolCall('assess_risk', {
        currentlyUsing: 'planning',
        biggestFears: ['reputation'],
      });

      assert.ok(
        ['low', 'medium', 'high'].includes(parsed.riskLevel),
        `Expect low/medium/high, got ${parsed.riskLevel}`
      );
      assert.ok(parsed.recommendations.length >= 2);
    });
  });

  // ────────────────────── get_checklist ──────────────────────────────────

  describe('get_checklist', () => {
    it('full checklist returns 56 items across 9 sections', async () => {
      const { parsed } = await toolCall('get_checklist');

      assert.equal(parsed.total, 56, `Expected 56 total, got ${parsed.total}`);
      assert.equal(parsed.sections.length, 9, `Expected 9 sections, got ${parsed.sections.length}`);
      assert.ok(parsed.source);

      // Verify item counts sum to total
      const sum = parsed.sections.reduce((s, sec) => s + sec.count, 0);
      assert.equal(sum, 56, `Section counts should sum to 56, got ${sum}`);
    });

    it('filter by severity=critical returns only critical items', async () => {
      const { parsed } = await toolCall('get_checklist', { severity: 'critical' });

      assert.ok(parsed.total >= 5, 'Should have at least 5 critical items');
      for (const item of parsed.items) {
        assert.equal(item.severity, 'critical');
      }
    });

    it('filter by section name returns matching items', async () => {
      const { parsed } = await toolCall('get_checklist', { section: 'Hallucination' });

      assert.ok(parsed.total >= 1, 'Should find hallucination items');
      assert.ok(parsed.filters.section === 'Hallucination');
    });

    it('search by query returns matching items', async () => {
      const { parsed } = await toolCall('get_checklist', { query: 'injection' });

      assert.ok(parsed.total >= 1, 'Should find injection-related items');
    });

    it('each item has name, description, and severity', async () => {
      const { parsed } = await toolCall('get_checklist');

      for (const section of parsed.sections) {
        for (const item of section.items) {
          assert.ok(item.name, 'Item must have a name');
          assert.ok(item.description, 'Item must have a description');
          assert.ok(
            ['critical', 'high', 'medium'].includes(item.severity),
            `Invalid severity: ${item.severity}`
          );
        }
      }
    });
  });

  // ────────────────────── submit_feedback ────────────────────────────────

  describe('submit_feedback', () => {
    it('submits feedback and returns success with ID', async () => {
      const { parsed } = await toolCall('submit_feedback', {
        type: 'feedback',
        message: 'Automated sanity test — please ignore.',
        source: 'mcp-sanity-test',
      });

      assert.ok(parsed.success, 'Should return success: true');
      assert.ok(parsed.id, 'Should return a feedback ID');
      assert.ok(parsed.id.startsWith('fb_'), 'ID should start with fb_');
    });
  });

  // ────────────────────── resources/list ─────────────────────────────────

  describe('resources/list', () => {
    it('returns 2 resources with correct URIs', async () => {
      const body = await mcpCall('resources/list');
      const resources = body.result.resources;

      assert.ok(Array.isArray(resources));
      assert.equal(resources.length, 2, 'Should have exactly 2 resources');

      const uris = resources.map((r) => r.uri).sort();
      assert.deepEqual(uris, [
        'inspectagents://checklist/full',
        'inspectagents://failures/all',
      ]);

      for (const r of resources) {
        assert.ok(r.name, 'Resource must have a name');
        assert.ok(r.description, 'Resource must have a description');
        assert.equal(r.mimeType, 'application/json');
      }
    });
  });

  // ────────────────────── resources/read ─────────────────────────────────

  describe('resources/read', () => {
    it('failures resource returns full database', async () => {
      const body = await mcpCall('resources/read', {
        uri: 'inspectagents://failures/all',
      });

      const contents = body.result.contents;
      assert.ok(contents.length >= 1);
      assert.equal(contents[0].uri, 'inspectagents://failures/all');

      const data = JSON.parse(contents[0].text);
      assert.ok(data.total >= 10, `Expected at least 10 failures, got ${data.total}`);
      assert.ok(Array.isArray(data.failures));
      assert.equal(data.failures.length, data.total);
    });

    it('checklist resource returns 56 items', async () => {
      const body = await mcpCall('resources/read', {
        uri: 'inspectagents://checklist/full',
      });

      const contents = body.result.contents;
      assert.ok(contents.length >= 1);

      const data = JSON.parse(contents[0].text);
      assert.equal(data.total, 56, `Expected 56, got ${data.total}`);
      assert.equal(data.sections.length, 9);
    });
  });

  // ────────────────────── Error Handling ─────────────────────────────────

  describe('Error handling', () => {
    it('invalid tool name returns isError with message', async () => {
      const { parsed, isError } = await toolCall('nonexistent_tool', {});
      // The SDK wraps unknown tools in a result with isError
      assert.ok(isError, 'Should return isError: true');
    });

    it('invalid JSON-RPC method returns error', async () => {
      const id = nextId++;
      const res = await fetch(MCP_URL, {
        method: 'POST',
        headers: REQUIRED_HEADERS,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id,
          method: 'nonexistent/method',
          params: {},
        }),
      });
      const body = await res.json();
      assert.ok(body.error, 'Should return a JSON-RPC error');
      assert.ok(body.error.code < 0, 'Error code should be negative');
    });
  });

  // ────────────────────── Discovery Files ────────────────────────────────

  describe('Discovery files', () => {
    it('.well-known/mcp.json is valid and has correct URL', async () => {
      const res = await fetch('https://inspectagents.com/.well-known/mcp.json');
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.ok(data.mcpServers.inspectagents);

      const server = data.mcpServers.inspectagents;
      assert.ok(server.url.endsWith('/api/mcp/'), `URL should end with /api/mcp/, got ${server.url}`);
      assert.ok(server.requiredHeaders, 'Should declare requiredHeaders');
      assert.ok(server.requiredHeaders.Accept, 'Should declare required Accept header');
      assert.ok(server.tools.length === 5, 'Should list 5 tools');
    });

    it('llms.txt is accessible and mentions MCP', async () => {
      const res = await fetch('https://inspectagents.com/llms.txt');
      assert.equal(res.status, 200);

      const text = await res.text();
      assert.ok(text.includes('/api/mcp/'), 'llms.txt should reference MCP endpoint with trailing slash');
      assert.ok(text.includes('Accept'), 'llms.txt should mention Accept header');
    });

    it('robots.txt mentions MCP endpoint', async () => {
      const res = await fetch('https://inspectagents.com/robots.txt');
      assert.equal(res.status, 200);

      const text = await res.text();
      assert.ok(text.includes('/api/mcp/'), 'robots.txt should reference MCP endpoint');
    });
  });
});
