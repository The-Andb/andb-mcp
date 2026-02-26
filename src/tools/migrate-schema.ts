import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';
import { ConnectionConfigSchema } from './schemas';

export function registerMigrateSchema(server: McpServer) {
  server.registerTool(
    'migrate_schema',
    {
      title: 'Generate Migration SQL',
      description:
        'Compare two environments and generate migration SQL to sync the target with the source. By default, this only PREVIEWS the SQL without executing. Set dryRun to false to execute (use with caution).',
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
          .describe('Target database (the one to be migrated)'),
        dryRun: z
          .boolean()
          .optional()
          .default(true)
          .describe(
            'If true (default), only return the migration SQL without executing. Set to false to execute migration.',
          ),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async (input: any) => {
      try {
        const { source, target, dryRun } = input;
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

        const result = await CoreBridge.execute('migrate', {
          srcEnv,
          destEnv,
          sourceConfig: 'connection' in source ? source.connection : undefined,
          targetConfig: 'connection' in target ? target.connection : undefined,
          dryRun: dryRun !== false, // Default to true
        });

        const isDry = dryRun !== false;
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  mode: isDry ? 'PREVIEW (dry run)' : 'EXECUTED',
                  ...(isDry
                    ? { message: 'Migration SQL generated. Set dryRun: false to execute.' }
                    : {}),
                  result,
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
              text: `Error generating migration: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
