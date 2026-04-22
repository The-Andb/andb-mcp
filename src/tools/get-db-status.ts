import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getDBStatusTool, CoreBridge } from '@the-andb/core';

export function registerGetDbStatus(server: McpServer) {
  server.registerTool(
    getDBStatusTool.name,
    {
      description: getDBStatusTool.description,
      inputSchema: getDBStatusTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await getDBStatusTool.handler(input, { orchestrator, config });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
