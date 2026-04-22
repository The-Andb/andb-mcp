import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { exportSchemaTool, CoreBridge } from '@the-andb/core';

export function registerExportSchema(server: McpServer) {
  server.registerTool(
    exportSchemaTool.name,
    {
      description: exportSchemaTool.description,
      inputSchema: exportSchemaTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      
      try {
        const result = await exportSchemaTool.handler(input, { orchestrator, config });
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
              text: `Error exporting schema: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
