import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerMigrationPlanPrompt(server: McpServer) {
  server.registerPrompt(
    'migration_plan',
    {
      description: 'Guides the AI to create a safe and comprehensive migration plan between two environments.',
      argsSchema: {
        sourceEnv: z.string().describe('The reference environment (e.g., DEV)'),
        targetEnv: z.string().describe('The environment to update (e.g., PROD)'),
      },
    },
    (args) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `I need to move schema changes from "${args.sourceEnv}" to "${args.targetEnv}".
            1. Use 'compare_schema' to identify the differences.
            2. For each change, use 'analyze_ddl_risk' to check for CRITICAL or WARNING impacts.
            3. Use 'diff_semantic' on major table changes to understand the "why" and "what" beyond just the SQL.
            4. Compile a final plan including the SQL migration, a safety assessment, and a list of semantic changes.`,
          },
        },
      ],
    })
  );
}
