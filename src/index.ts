#!/usr/bin/env node

/**
 * andb-mcp - MCP Server for TheAndb
 *
 * Exposes database schema management tools via the Model Context Protocol,
 * allowing AI clients (Claude, Cursor, etc.) to interact with databases
 * through TheAndb core engine.
 */

// ⚠️ CRITICAL: Intercept process.stdout.write BEFORE any imports.
// MCP stdio transport uses stdout exclusively for JSON-RPC messages.
// Framework Logger and CoreBridge write directly to process.stdout.write,
// bypassing console.log. We must redirect non-JSON output to stderr.
const origStdoutWrite = process.stdout.write.bind(process.stdout);
(process.stdout as any).write = (
  chunk: any,
  encodingOrCb?: BufferEncoding | ((err?: Error) => void),
  cb?: (err?: Error) => void,
): boolean => {
  const str = typeof chunk === 'string' ? chunk : chunk.toString();
  // Only let JSON-RPC messages through to stdout (they start with '{')
  const trimmed = str.trimStart();
  if (trimmed.startsWith('{') || trimmed.startsWith('Content-Length:')) {
    return origStdoutWrite(chunk, encodingOrCb as any, cb);
  }
  // Everything else (Framework logs, CoreBridge emoji logs) goes to stderr
  return process.stderr.write(chunk, encodingOrCb as any, cb);
};

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CoreBridge } from '@the-andb/core';
import { registerTools } from './tools';
import { registerResources } from './resources';
import { registerPrompts } from './prompts';

async function main() {
  // Initialize the core engine (logs go to stderr via redirect above)
  await CoreBridge.init();

  // Create MCP server
  const server = new McpServer({
    name: 'andb',
    version: '0.1.0',
  });

  // Register all tools, resources, and prompts
  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('❌ [andb-mcp] Failed to start:', error.message);
  process.exit(1);
});
