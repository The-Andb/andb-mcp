import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';

export function registerGetSchemaNormalized(server: McpServer) {
  server.registerTool(
    'get_schema_normalized',
    {
      title: 'Get Normalized Schema',
      description: 'Fetch the entire database schema in a normalized SQL format. This is optimized for AI agents to reason about the database structure efficiently.',
      inputSchema: z.object({
        env: z.string().describe('Environment name from andb.yaml'),
        database: z.string().optional().describe('Database name (default: default)'),
      }),
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: { env: string; database?: string }) => {
      try {
        const { env, database } = input;

        const result = await CoreBridge.execute('getSchemaNormalized', {
          env,
          db: database || 'default',
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching normalized schema: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
