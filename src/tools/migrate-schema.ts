import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { migrateSchemaTool, CoreBridge } from '@the-andb/core';

export function registerMigrateSchema(server: McpServer) {
  server.registerTool(
    migrateSchemaTool.name,
    {
      description: migrateSchemaTool.description,
      inputSchema: migrateSchemaTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      
      try {
        const result = await migrateSchemaTool.handler(input, { orchestrator, config });

        const isDry = input.dryRun !== false;
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
                2
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
    }
  );
}
