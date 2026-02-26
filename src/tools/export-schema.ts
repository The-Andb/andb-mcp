import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionInputSchema, resolveConnectionPayload } from './schemas';

export function registerExportSchema(server: McpServer) {
  server.registerTool(
    'export_schema',
    {
      title: 'Export Schema',
      description:
        'Export database schema DDL to local files. Exports all object definitions (tables, views, procedures, functions, triggers, events) from the specified environment.',
      inputSchema: z.intersection(
        ConnectionInputSchema,
        z.object({
          objectType: z
            .enum(['table', 'view', 'procedure', 'function', 'trigger', 'event'])
            .optional()
            .describe('Export only specific object type (default: all types)'),
        }),
      ),
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: any) => {
      try {
        const payload = resolveConnectionPayload(input);

        const result = await CoreBridge.execute('export', {
          env: payload.env,
          type: input.objectType,
          targetConfig: 'connection' in input ? input.connection : undefined,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  success: true,
                  message: 'Schema exported successfully',
                  details: result,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error exporting schema: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
