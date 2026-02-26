import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionInputSchema, resolveConnectionPayload } from './schemas';

export function registerGetDbStatus(server: McpServer) {
  server.registerTool(
    'get_db_status',
    {
      title: 'Get Database Status',
      description:
        'Get database server status including version, active connections, process list, and server variables. Useful for monitoring and diagnostics.',
      inputSchema: ConnectionInputSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: any) => {
      try {
        const payload = resolveConnectionPayload(input);
        const config = CoreBridge.getConfig();
        const orchestrator = CoreBridge.getOrchestrator();

        // If inline connection, set it
        if ('connection' in input) {
          config.setConnection(payload.env, input.connection, input.connection.type || 'mysql');
        }

        const connection = config.getConnection(payload.env);
        if (!connection) {
          throw new Error(`No connection configured for environment: ${payload.env}`);
        }

        const driver = await orchestrator.getDriverFromConnection(connection);
        await driver.connect();

        try {
          const monitoring = driver.getMonitoringService();
          const [version, status, processList, connections] = await Promise.all([
            monitoring.getVersion(),
            monitoring.getStatus(),
            monitoring.getProcessList(),
            monitoring.getConnections(),
          ]);

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    version,
                    status,
                    activeProcesses: processList,
                    connections,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        } finally {
          await driver.disconnect();
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting database status: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
