/**
 * WebMCP - Adds MCP (Model Context Protocol) widget to any website.
 *
 * Renders a small indicator in the bottom-right corner.
 * On click it expands so users can paste a connection token.
 * Auto-disconnects after 5 minutes of inactivity.
 */

class WebMCP {
  // ── Constructor ────────────────────────────────────────────────────
  constructor(options = {}) {
    this.options = {
      color: '#007bff',
      position: 'bottom-right',
      size: '30px',
      padding: '20px',
      inactivityTimeout: 5 * 60 * 1000,
      ...options,
    };

    this.isConnected = false;
    this.isExpanded = false;
    this.socket = null;
    this.inactivityTimer = null;

    this.availableTools = new Map();
    this.availablePrompts = new Map();
    this.availableResources = new Map();

    this.registeredTools = new Set();
    this.registeredPrompts = new Set();
    this.registeredResources = new Set();

    this.currentToken = '';
    this.currentServer = '';
    this.currentChannel = '';

    this.elementId = 'webmcp-widget-' + Math.random().toString(36).slice(2, 11);

    this.STORAGE_KEY = 'webmcp_token';
    this.TOOLS_KEY = 'webmcp_tools';
    this.PROMPTS_KEY = 'webmcp_prompts';
    this.RESOURCES_KEY = 'webmcp_resources';
    this.REGISTER_PATH = '/register';

    this._init();
  }

  // ── Helpers ────────────────────────────────────────────────────────
  _fmt(s) {
    return s.replace(/[.:]/g, '_');
  }

  _el(sel) {
    const root = document.getElementById(this.elementId);
    return root ? root.querySelector(sel) : null;
  }

  // ── Initialisation ─────────────────────────────────────────────────
  _init() {
    if (document.querySelector('[data-webmcp-widget]')) {
      console.warn('WebMCP already initialised');
      return;
    }
    this._buildUI();
    this._bindEvents();
    this._resetInactivity();
    this._restoreSession();
  }

  // ── Session persistence ────────────────────────────────────────────
  _restoreSession() {
    const raw = sessionStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;

    try {
      const info = JSON.parse(raw);
      if (!info.token) return;

      this.currentServer = info.server;
      this.currentChannel = `/${info.channelHost || this._fmt(window.location.host)}`;

      try {
        const decoded = JSON.parse(atob(info.token));
        this.currentToken = decoded.token;
      } catch {
        this.currentToken = info.token;
      }

      this._loadStoredItems();
      this.connect(info.token);
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      this._clearStoredItems();
    }
  }

  _saveItems() {
    const serialize = (map, exclude) => {
      const out = {};
      map.forEach((v, k) => {
        const copy = { ...v };
        exclude.forEach((f) => delete copy[f]);
        out[k] = copy;
      });
      return JSON.stringify(out);
    };

    sessionStorage.setItem(this.TOOLS_KEY, serialize(this.availableTools, ['execute']));
    sessionStorage.setItem(this.PROMPTS_KEY, serialize(this.availablePrompts, ['execute']));
    sessionStorage.setItem(this.RESOURCES_KEY, serialize(this.availableResources, ['provide']));
  }

  _loadStoredItems() {
    const load = (key, map, placeholder) => {
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([name, item]) => {
        map.set(name, { ...item, ...placeholder(name, item) });
      });
    };

    load(this.TOOLS_KEY, this.availableTools, (name) => ({
      execute: () => `Tool ${name} needs re-registration`,
    }));
    load(this.PROMPTS_KEY, this.availablePrompts, (name) => ({
      execute: () => ({
        messages: [{ role: 'user', content: { type: 'text', text: `Prompt ${name} needs re-registration` } }],
      }),
    }));
    load(this.RESOURCES_KEY, this.availableResources, (name, item) => ({
      provide: (uri) => ({
        contents: [{ uri, text: `Resource ${name} needs re-registration`, mimeType: item.mimeType || 'text/plain' }],
      }),
    }));

    this._refreshLists();
  }

  _clearStoredItems() {
    [this.TOOLS_KEY, this.PROMPTS_KEY, this.RESOURCES_KEY].forEach((k) =>
      sessionStorage.removeItem(k),
    );
  }

  // ── UI construction ────────────────────────────────────────────────
  _buildUI() {
    const container = document.createElement('div');
    container.id = this.elementId;
    container.dataset.webmcpWidget = 'true';
    Object.assign(container.style, {
      position: 'fixed',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    });
    this._applyPosition(container);

    // Trigger button
    const trigger = document.createElement('div');
    trigger.className = 'webmcp-trigger';
    Object.assign(trigger.style, {
      width: this.options.size,
      height: this.options.size,
      backgroundColor: this.options.color,
      borderRadius: '4px',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
    });

    // Content panel
    const panel = document.createElement('div');
    panel.className = 'webmcp-content';
    Object.assign(panel.style, {
      backgroundColor: '#fff',
      border: '1px solid #e1e1e1',
      borderRadius: '5px',
      padding: '15px',
      marginBottom: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      width: '250px',
      display: 'none',
      overflow: 'hidden',
      position: 'absolute',
      bottom: '40px',
    });

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
        <div style="font-weight:bold;font-size:16px">WebMCP</div>
        <button class="webmcp-close" style="background:none;border:none;cursor:pointer;font-size:20px;padding:0;line-height:1;color:#999">&times;</button>
      </div>
      <div style="display:flex;margin-bottom:8px">
        <input class="webmcp-token-input" placeholder="Paste connection token" style="flex:1;padding:8px;border:1px solid #ccc;border-radius:4px 0 0 4px;font-size:12px"/>
        <button class="webmcp-connect-btn" style="padding:8px 12px;background:${this.options.color};color:#fff;border:none;border-radius:0 4px 4px 0;cursor:pointer;font-size:12px">Connect</button>
      </div>
      <button class="webmcp-disconnect-btn" style="display:none;padding:8px 12px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;width:100%">Disconnect</button>
      <div class="webmcp-status" style="padding:8px;border-radius:3px;background:#f8d7da;color:#721c24;text-align:center;margin-bottom:10px;font-size:12px">Disconnected</div>
      <div class="webmcp-registered-items" style="display:none;margin-top:15px;font-size:12px;max-height:200px;overflow:auto;border:1px solid #eee;border-radius:4px">
        <div class="webmcp-tools-list" style="padding:10px;border-bottom:1px solid #eee">
          <div style="font-weight:bold;margin-bottom:5px">Registered Tools:</div>
          <ul class="webmcp-tools-container" style="list-style:none;padding:0;margin:0"></ul>
        </div>
        <div class="webmcp-prompts-list" style="padding:10px;border-bottom:1px solid #eee">
          <div style="font-weight:bold;margin-bottom:5px">Registered Prompts:</div>
          <ul class="webmcp-prompts-container" style="list-style:none;padding:0;margin:0"></ul>
        </div>
        <div class="webmcp-resources-list" style="padding:10px">
          <div style="font-weight:bold;margin-bottom:5px">Registered Resources:</div>
          <ul class="webmcp-resources-container" style="list-style:none;padding:0;margin:0"></ul>
        </div>
      </div>
    `;

    container.appendChild(panel);
    container.appendChild(trigger);
    document.body.appendChild(container);
  }

  _applyPosition(el) {
    const { position, padding } = this.options;
    const sides = {
      'bottom-right': { bottom: padding, right: padding, alignItems: 'flex-end' },
      'bottom-left': { bottom: padding, left: padding, alignItems: 'flex-start' },
      'top-right': { top: padding, right: padding, alignItems: 'flex-end' },
      'top-left': { top: padding, left: padding, alignItems: 'flex-start' },
    };
    Object.assign(el.style, sides[position] || sides['bottom-right']);
  }

  // ── Events ─────────────────────────────────────────────────────────
  _bindEvents() {
    this._el('.webmcp-trigger')?.addEventListener('click', () => this._toggle());
    this._el('.webmcp-close')?.addEventListener('click', () => this._toggle(false));
    this._el('.webmcp-connect-btn')?.addEventListener('click', () => {
      const input = this._el('.webmcp-token-input');
      if (input) this.connect(input.value);
    });
    this._el('.webmcp-disconnect-btn')?.addEventListener('click', () => this.disconnect());

    ['mousemove', 'keypress', 'click', 'scroll'].forEach((evt) =>
      document.addEventListener(evt, () => this._resetInactivity()),
    );
  }

  _toggle(force = null) {
    this.isExpanded = force !== null ? force : !this.isExpanded;
    const panel = this._el('.webmcp-content');
    if (panel) panel.style.display = this.isExpanded ? 'block' : 'none';
    this._resetInactivity();
  }

  // ── Status ─────────────────────────────────────────────────────────
  _setStatus(level, message) {
    const el = this._el('.webmcp-status');
    if (!el) return;
    el.textContent = message;
    const styles = {
      connected: { backgroundColor: '#d4edda', color: '#155724' },
      disconnected: { backgroundColor: '#f8d7da', color: '#721c24' },
      connecting: { backgroundColor: '#fff3cd', color: '#856404' },
      'pending-auth': { backgroundColor: '#d1ecf1', color: '#0c5460' },
    };
    Object.assign(el.style, styles[level] || styles.disconnected);
  }

  _setConnectionUI(connected) {
    const show = (sel, val) => {
      const el = this._el(sel);
      if (el) el.style.display = val ? 'block' : 'none';
    };
    show('.webmcp-token-input', !connected);
    show('.webmcp-connect-btn', !connected);
    show('.webmcp-disconnect-btn', connected);
    show('.webmcp-registered-items', connected);

    const trigger = this._el('.webmcp-trigger');
    if (trigger) {
      trigger.innerHTML = connected ? '✓' : '';
      if (connected) {
        trigger.style.color = 'white';
        trigger.style.fontWeight = 'bold';
      }
    }
  }

  // ── Inactivity ─────────────────────────────────────────────────────
  _resetInactivity() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      if (this.isConnected) this.disconnect();
      this._toggle(false);
      sessionStorage.removeItem(this.STORAGE_KEY);
    }, this.options.inactivityTimeout);
  }

  // ── Connection ─────────────────────────────────────────────────────
  async connect(token) {
    if (!token) {
      this._setStatus('disconnected', 'Error: No token provided');
      return;
    }
    this._setStatus('connecting', 'Connecting...');

    if (!this._parseToken(token)) return;

    const info = {
      token,
      server: this.currentServer,
      host: this._fmt(window.location.host),
    };

    // Check if we can skip registration
    let skipReg = false;
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const prev = JSON.parse(stored);
        skipReg = prev.server === this.currentServer && prev.host === info.host;
      } catch { /* ignore */ }
    }

    try {
      if (!skipReg) {
        const res = await this._register(token);
        if (!res.token) {
          this._setStatus('disconnected', 'Registration failed');
          return;
        }
        info.token = res.token;
        this.currentToken = res.token;
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(info));
      }

      const url = `${this.currentServer}${this.currentChannel}?token=${this.currentToken}`;
      this._setStatus('connecting', 'Connecting to channel...');
      this.socket = new WebSocket(url);
      this._wireSocket();
      this._resetInactivity();
    } catch (err) {
      this._setStatus('disconnected', `Error: ${err.message}`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this._setStatus('disconnected', 'Disconnected');
    this._setConnectionUI(false);
    this.currentToken = '';
    this.currentServer = '';
    this.currentChannel = '';
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._clearStoredItems();
  }

  _parseToken(encoded) {
    try {
      const data = JSON.parse(atob(encoded));
      if (!data.server || !data.token) {
        this._setStatus('disconnected', 'Invalid token');
        return false;
      }
      this.currentServer = data.server;
      this.currentToken = data.token;
      this.currentChannel = `/${this._fmt(window.location.host)}`;
      return true;
    } catch {
      this._setStatus('disconnected', 'Unable to parse token');
      return false;
    }
  }

  _register(encoded) {
    this._setStatus('pending-auth', 'Registering...');
    const ws = new WebSocket(`${this.currentServer}${this.REGISTER_PATH}`);

    return new Promise((resolve, reject) => {
      ws.addEventListener('open', () => {
        const data = JSON.parse(atob(encoded));
        data.host = this._fmt(window.location.host);
        ws.send(btoa(JSON.stringify(data)));
      });

      ws.addEventListener('message', (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'registerSuccess' && msg.token) {
            resolve({ token: msg.token });
          } else if (msg.type === 'error') {
            this._setStatus('disconnected', `Registration failed: ${msg.message}`);
            reject(new Error(msg.message));
          }
        } catch (err) {
          this._setStatus('disconnected', 'Error parsing server response');
          reject(err);
        }
      });

      ws.addEventListener('error', () => {
        this._setStatus('disconnected', 'Registration connection error');
        sessionStorage.removeItem(this.STORAGE_KEY);
        reject(new Error('Connection error'));
      });

      ws.addEventListener('close', (e) => {
        if (e.code !== 1000) {
          this._setStatus('disconnected', 'Registration failed');
          sessionStorage.removeItem(this.STORAGE_KEY);
          reject(new Error('Connection closed'));
        }
      });
    });
  }

  // ── WebSocket ──────────────────────────────────────────────────────
  _wireSocket() {
    if (!this.socket) return;

    this.socket.addEventListener('open', () => {
      this.isConnected = true;
      this._setStatus('connected', `Connected to ${this.currentChannel}`);
      this._setConnectionUI(true);
      this._registerAll();
    });

    this.socket.addEventListener('close', (e) => {
      this.isConnected = false;
      this._setStatus('disconnected', 'Disconnected');
      this._setConnectionUI(false);
      if (e.code === 1001 || e.code === 401) {
        this._setStatus('disconnected', 'Authorization failed');
        this.currentToken = '';
        this.currentServer = '';
        this.currentChannel = '';
        sessionStorage.removeItem(this.STORAGE_KEY);
      }
    });

    this.socket.addEventListener('error', () => {
      this._setStatus('disconnected', this.isConnected ? 'Connection error' : 'Connection failed');
      sessionStorage.removeItem(this.STORAGE_KEY);
    });

    this.socket.addEventListener('message', (e) => {
      try {
        this._onMessage(JSON.parse(e.data));
      } catch (err) {
        console.error('[WebMCP] parse error:', err.message);
      }
    });
  }

  _send(msg) {
    if (!this.isConnected || !this.socket) return;
    this.socket.send(JSON.stringify(msg));
  }

  // ── Server messages ────────────────────────────────────────────────
  _onMessage(msg) {
    const handlers = {
      welcome: () => {},
      toolRegistered: () => {},
      promptRegistered: () => {},
      resourceRegistered: () => {},
      callTool: () => this._handleToolCall(msg),
      getPrompt: () => this._handleGetPrompt(msg),
      readResource: () => this._handleReadResource(msg),
      createSamplingMessage: () => this._handleSampling(msg),
      listTools: () => this._sendToolsList(msg.id),
      listPrompts: () => this._sendPromptsList(msg.id),
      listResources: () => this._sendResourcesList(msg.id),
      ping: () => this._send({ type: 'pong', id: msg.id, timestamp: Date.now() }),
      error: () => console.error('[WebMCP] server error:', msg.message),
    };
    const handler = handlers[msg.type];
    if (handler) handler();
    else console.warn('[WebMCP] unknown message type:', msg.type);
  }

  // ── Tool calls ─────────────────────────────────────────────────────
  _handleToolCall(msg) {
    const { id, tool, arguments: args } = msg;

    if (!this.availableTools.has(tool)) {
      this._send({ id, type: 'toolResponse', error: `Tool not found: ${tool}` });
      return;
    }

    try {
      const result = this.availableTools.get(tool).execute(args);

      if (result instanceof Promise) {
        result
          .then((r) => this._send({ id, type: 'toolResponse', result: r }))
          .catch((e) => this._send({ id, type: 'toolResponse', error: e.message || 'Tool execution error' }));
      } else {
        this._send({ id, type: 'toolResponse', result });
      }
    } catch (err) {
      this._send({ id, type: 'toolResponse', error: err.message || 'Tool execution error' });
    }
  }

  _handleGetPrompt(msg) {
    const { id, name, arguments: args } = msg;

    if (!this.availablePrompts.has(name)) {
      this._send({ id, type: 'promptResponse', error: `Prompt not found: ${name}` });
      return;
    }

    try {
      const result = this.availablePrompts.get(name).execute(args);

      if (result instanceof Promise) {
        result
          .then((r) => this._send({ id, type: 'promptResponse', result: r }))
          .catch((e) => this._send({ id, type: 'promptResponse', error: e.message || 'Prompt error' }));
      } else {
        this._send({ id, type: 'promptResponse', result });
      }
    } catch (err) {
      this._send({ id, type: 'promptResponse', error: err.message || 'Prompt error' });
    }
  }

  _handleReadResource(msg) {
    const { id, uri } = msg;

    let resource = null;
    for (const r of this.availableResources.values()) {
      if (!r.isTemplate && r.uri === uri) { resource = r; break; }
    }
    if (!resource) {
      for (const r of this.availableResources.values()) {
        if (r.isTemplate && uri.startsWith(r.uriTemplate.split('{')[0])) { resource = r; break; }
      }
    }
    if (!resource) {
      this._send({ id, type: 'resourceResponse', error: `No handler for URI: ${uri}` });
      return;
    }

    try {
      const result = resource.provide(uri);

      if (result instanceof Promise) {
        result
          .then((r) => this._send({ id, type: 'resourceResponse', result: r }))
          .catch((e) => this._send({ id, type: 'resourceResponse', error: e.message || 'Resource error' }));
      } else {
        this._send({ id, type: 'resourceResponse', result });
      }
    } catch (err) {
      this._send({ id, type: 'resourceResponse', error: err.message || 'Resource error' });
    }
  }

  // ── List responses ─────────────────────────────────────────────────
  _sendToolsList(reqId) {
    const tools = [...this.availableTools.values()].map(({ name, description, inputSchema }) => ({
      name, description, inputSchema,
    }));
    this._send({ id: reqId, type: 'listToolsResponse', tools });
  }

  _sendPromptsList(reqId) {
    const prompts = [...this.availablePrompts.values()].map(({ name, description, arguments: args }) => ({
      name, description, arguments: args,
    }));
    this._send({ id: reqId, type: 'listPromptsResponse', prompts });
  }

  _sendResourcesList(reqId) {
    const resources = [];
    const templates = [];
    this.availableResources.forEach((r) => {
      if (r.isTemplate) {
        templates.push({ name: r.name, description: r.description, uriTemplate: r.uriTemplate, mimeType: r.mimeType });
      } else {
        resources.push({ name: r.name, description: r.description, uri: r.uri, mimeType: r.mimeType });
      }
    });
    this._send({ id: reqId, type: 'listResourcesResponse', resources, resourceTemplates: templates });
  }

  // ── Registration with server ───────────────────────────────────────
  _registerAll() {
    if (!this.isConnected) return;
    this.registeredTools.clear();
    this.registeredPrompts.clear();
    this.registeredResources.clear();

    this.availableTools.forEach((t, name) => {
      this._send({ type: 'registerTool', name, description: t.description, inputSchema: t.inputSchema });
      this.registeredTools.add(name);
    });
    this.availablePrompts.forEach((p, name) => {
      this._send({ type: 'registerPrompt', name, description: p.description, arguments: p.arguments });
      this.registeredPrompts.add(name);
    });
    this.availableResources.forEach((r, name) => {
      this._send({
        type: 'registerResource', name, description: r.description,
        uri: r.uri, uriTemplate: r.uriTemplate, isTemplate: r.isTemplate, mimeType: r.mimeType,
      });
      this.registeredResources.add(name);
    });
  }

  // ── Public registration API ────────────────────────────────────────
  registerTool(name, description, schema, executeFn) {
    if (!name) return;
    this.availableTools.set(name, {
      name,
      description: description || `Tool: ${name}`,
      inputSchema: schema || { type: 'object', properties: {} },
      execute: executeFn || ((args) => `Default ${name}: ${JSON.stringify(args)}`),
    });

    if (this.isConnected) {
      this._send({ type: 'registerTool', name, description, inputSchema: schema });
      this.registeredTools.add(name);
    }
    this._saveItems();
    this._refreshLists();
  }

  registerPrompt(name, description, promptArgs, executeFn) {
    if (!name) return;
    this.availablePrompts.set(name, {
      name,
      description: description || `Prompt: ${name}`,
      arguments: promptArgs || [],
      execute: executeFn || ((args) => ({
        messages: [{ role: 'user', content: { type: 'text', text: `Default ${name}: ${JSON.stringify(args)}` } }],
      })),
    });

    if (this.isConnected) {
      this._send({ type: 'registerPrompt', name, description, arguments: promptArgs });
      this.registeredPrompts.add(name);
    }
    this._saveItems();
    this._refreshLists();
  }

  registerResource(name, description, options, provideFn) {
    if (!name || (!options.uri && !options.uriTemplate)) return;
    const isTemplate = !!options.uriTemplate;

    this.availableResources.set(name, {
      name,
      description: description || `Resource: ${name}`,
      uri: options.uri,
      uriTemplate: options.uriTemplate,
      isTemplate,
      mimeType: options.mimeType,
      provide: provideFn || ((uri) => ({
        contents: [{ uri, text: `Default ${name} for: ${uri}`, mimeType: options.mimeType || 'text/plain' }],
      })),
    });

    if (this.isConnected) {
      this._send({
        type: 'registerResource', name, description,
        uri: options.uri, uriTemplate: options.uriTemplate, isTemplate, mimeType: options.mimeType,
      });
      this.registeredResources.add(name);
    }
    this._saveItems();
    this._refreshLists();
  }

  // ── UI list refresh ────────────────────────────────────────────────
  _refreshLists() {
    this._renderList('.webmcp-tools-container', this.availableTools, 'No tools registered', (t) => t.description);
    this._renderList('.webmcp-prompts-container', this.availablePrompts, 'No prompts registered', (p) => p.description);
    this._renderList('.webmcp-resources-container', this.availableResources, 'No resources registered', (r) =>
      r.description + (r.isTemplate ? ' (Template)' : ''),
    );
  }

  _renderList(selector, map, emptyMsg, descFn) {
    const ul = this._el(selector);
    if (!ul) return;
    ul.innerHTML = '';

    if (map.size === 0) {
      const li = document.createElement('li');
      li.textContent = emptyMsg;
      Object.assign(li.style, { fontStyle: 'italic', color: '#666' });
      ul.appendChild(li);
      return;
    }

    map.forEach((item, name) => {
      const li = document.createElement('li');
      Object.assign(li.style, { padding: '5px 0', borderBottom: '1px solid #eee' });
      const b = document.createElement('strong');
      b.textContent = name;
      const d = document.createElement('div');
      d.textContent = descFn(item);
      Object.assign(d.style, { fontSize: '10px', color: '#666' });
      li.appendChild(b);
      li.appendChild(d);
      ul.appendChild(li);
    });
  }

  // ── Sampling dialog ────────────────────────────────────────────────
  _handleSampling(msg) {
    const { id, messages, systemPrompt } = msg;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: '10000',
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      backgroundColor: '#fff', padding: '20px', borderRadius: '5px',
      maxWidth: '500px', width: '90%', maxHeight: '80%', overflow: 'auto',
    });

    const content = document.createElement('div');
    Object.assign(content.style, {
      marginBottom: '15px', maxHeight: '300px', overflow: 'auto',
      border: '1px solid #ddd', padding: '10px', backgroundColor: '#f9f9f9',
    });

    (messages || []).forEach((m) => {
      const div = document.createElement('div');
      Object.assign(div.style, {
        marginBottom: '10px', padding: '5px', borderRadius: '3px',
        backgroundColor: m.role === 'user' ? '#e1f5fe' : '#f1f8e9',
      });
      div.innerHTML = `<strong>${m.role === 'user' ? 'User' : 'Assistant'}:</strong> ${
        m.content.type === 'text' ? m.content.text : '[Image data]'
      }`;
      content.appendChild(div);
    });

    if (systemPrompt) {
      const sp = document.createElement('div');
      Object.assign(sp.style, { marginBottom: '10px', padding: '5px', backgroundColor: '#fff8e1' });
      sp.innerHTML = `<strong>System Prompt:</strong> ${systemPrompt}`;
      content.appendChild(sp);
    }

    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, { width: '100%', minHeight: '100px', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' });

    const btnStyle = (bg) => `padding:8px 15px;background:${bg};color:#fff;border:none;border-radius:4px;cursor:pointer`;

    box.innerHTML = '<h3 style="margin:0 0 15px;padding:0 0 10px;border-bottom:1px solid #ddd">Sampling Request</h3>';
    box.appendChild(content);

    const label = document.createElement('label');
    label.textContent = 'Assistant Response:';
    Object.assign(label.style, { display: 'block', marginBottom: '5px', fontWeight: 'bold' });
    box.appendChild(label);
    box.appendChild(textarea);

    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;justify-content:space-between';

    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.style.cssText = btnStyle('#f44336');

    const submit = document.createElement('button');
    submit.textContent = 'Submit Response';
    submit.style.cssText = btnStyle('#4CAF50');

    btns.appendChild(cancel);
    btns.appendChild(submit);
    box.appendChild(btns);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    textarea.focus();

    submit.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) return;
      this._send({
        id, type: 'samplingResponse',
        result: { model: 'web-user-input', role: 'assistant', content: { type: 'text', text } },
      });
      document.body.removeChild(overlay);
    });

    cancel.addEventListener('click', () => {
      this._send({ id, type: 'samplingResponse', error: 'User cancelled sampling request' });
      document.body.removeChild(overlay);
    });
  }
}

// Expose globally
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = WebMCP;
}
if (typeof window !== 'undefined') {
  window.WebMCP = WebMCP;
}
