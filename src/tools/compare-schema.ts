import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionConfigSchema } from './schemas';

export function registerCompareSchema(server: McpServer) {
  server.registerTool(
    'compare_schema',
    {
      title: 'Compare Database Schemas',
      description:
        'Compare schemas between two database environments. Returns differences (added, removed, modified objects) and generates migration SQL. Specify source and target environments from andb.yaml, or provide inline connection configs.',
      inputSchema: z.object({
        source: z
          .union([
            z.object({ env: z.string().describe('Source environment name from andb.yaml') }),
            z.object({
              connection: ConnectionConfigSchema.describe('Source inline connection config'),
            }),
          ])
          .describe('Source database (the reference/truth)'),
        target: z
          .union([
            z.object({ env: z.string().describe('Target environment name from andb.yaml') }),
            z.object({
              connection: ConnectionConfigSchema.describe('Target inline connection config'),
            }),
          ])
          .describe('Target database (the one to be updated)'),
        objectTypes: z
          .array(z.enum(['table', 'view', 'procedure', 'function', 'trigger', 'event']))
          .optional()
          .describe('Filter to specific object types (default: all)'),
      }),
      annotations: {
        readOnlyHint: true,
      },
    },
    async (input: any) => {
      try {
        const { source, target, objectTypes } = input;
        const config = CoreBridge.getConfig();

        // Resolve source
        let srcEnv: string;
        if ('env' in source) {
          srcEnv = source.env;
        } else {
          srcEnv = '__MCP_SRC__';
          config.setConnection(srcEnv, source.connection, source.connection.type || 'mysql');
        }

        // Resolve target
        let destEnv: string;
        if ('env' in target) {
          destEnv = target.env;
        } else {
          destEnv = '__MCP_DEST__';
          config.setConnection(destEnv, target.connection, target.connection.type || 'mysql');
        }

        const payload: any = {
          srcEnv,
          destEnv,
          sourceConfig: 'connection' in source ? source.connection : undefined,
          targetConfig: 'connection' in target ? target.connection : undefined,
        };

        // If specific object types requested, we pass type info
        if (objectTypes && objectTypes.length > 0) {
          payload.objectTypes = objectTypes;
        }

        const result = await CoreBridge.execute('compare', payload);

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
              text: `Error comparing schemas: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
