import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionInputSchema, resolveConnectionPayload } from './schemas';

export function registerListSchemaObjects(server: McpServer) {
  server.registerTool(
    'list_schema_objects',
    {
      title: 'List Schema Objects',
      description:
        'List all database objects (tables, views, procedures, functions, triggers, events) in a database. Use env name from andb.yaml or provide inline connection details.',
      inputSchema: ConnectionInputSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: any) => {
      try {
        const payload = resolveConnectionPayload(input);

        const result = await CoreBridge.execute('getSchemaObjects', {
          destEnv: payload.env,
          targetConfig: 'connection' in input ? input.connection : undefined,
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
              text: `Error listing schema objects: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
