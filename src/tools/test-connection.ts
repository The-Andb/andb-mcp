import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionInputSchema, resolveConnectionPayload } from './schemas';

export function registerTestConnection(server: McpServer) {
  server.registerTool(
    'test_connection',
    {
      title: 'Test Database Connection',
      description:
        'Test connectivity to a database. Use env name from andb.yaml or provide inline connection details.',
      inputSchema: ConnectionInputSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: any) => {
      try {
        const payload = resolveConnectionPayload(input);

        if ('connection' in input) {
          const config = CoreBridge.getConfig();
          config.setConnection(payload.env, input.connection, input.connection.type || 'mysql');
        }

        const result = await CoreBridge.execute('test-connection', {
          destEnv: payload.env,
          targetConfig: 'connection' in input ? input.connection : undefined,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  success: true,
                  message: 'Connection successful',
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
              text: JSON.stringify(
                {
                  success: false,
                  error: error.message,
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }
    },
  );
}
