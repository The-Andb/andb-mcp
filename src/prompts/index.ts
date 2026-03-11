import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerExplainSchemaPrompt } from './explain-schema';
import { registerMigrationPlanPrompt } from './migration-plan';

export function registerPrompts(server: McpServer) {
  registerExplainSchemaPrompt(server);
  registerMigrationPlanPrompt(server);
}
