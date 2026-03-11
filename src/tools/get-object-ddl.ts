import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionInputSchema, resolveConnectionPayload } from './schemas';

export function registerGetObjectDDL(server: McpServer) {
  server.registerTool(
    'get_object_ddl',
    {
      title: 'Get Object DDL',
      description:
        'Get the DDL (CREATE statement) of a specific database object. Specify the object type and name to retrieve its SQL definition.',
      inputSchema: z.intersection(
        ConnectionInputSchema,
        z.object({
          objectType: z
            .enum(['table', 'view', 'procedure', 'function', 'trigger', 'event'])
            .describe('Type of database object'),
          objectName: z.string().describe('Name of the database object'),
        }),
      ),
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: any) => {
      try {
        const payload = resolveConnectionPayload(input);
        const { objectType, objectName } = input;

        // Get a driver and use introspection directly
        const orchestrator = CoreBridge.getOrchestrator();
        const config = CoreBridge.getConfig();

        // If inline connection, set it
        if ('connection' in input) {
          config.setConnection(payload.env, input.connection, input.connection.type || 'mysql');
        }

        const connection = config.getConnection(payload.env);
        if (!connection) {
          throw new Error(`No connection configured for environment: ${payload.env}`);
        }

        const driver = await (orchestrator as any).schemaOrchestrator.getDriverFromConnection(connection);
        await driver.connect();

        try {
          const introspection = driver.getIntrospectionService();
          const dbName = config.getDBName(payload.env);

          let ddl: string;
          switch (objectType) {
            case 'table':
              ddl = await introspection.getTableDDL(dbName, objectName);
              break;
            case 'view':
              ddl = await introspection.getViewDDL(dbName, objectName);
              break;
            case 'procedure':
              ddl = await introspection.getProcedureDDL(dbName, objectName);
              break;
            case 'function':
              ddl = await introspection.getFunctionDDL(dbName, objectName);
              break;
            case 'trigger':
              ddl = await introspection.getTriggerDDL(dbName, objectName);
              break;
            case 'event':
              ddl = await introspection.getEventDDL(dbName, objectName);
              break;
            default:
              ddl = await introspection.getObjectDDL(dbName, objectType, objectName);
          }

          return {
            content: [
              {
                type: 'text' as const,
                text: ddl || `No DDL found for ${objectType} '${objectName}'`,
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
              text: `Error getting DDL: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
