import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getWorkspaceSummaryTool, CoreBridge } from '@the-andb/core';

export function registerGetWorkspaceSummary(server: McpServer) {
  server.registerTool(
    getWorkspaceSummaryTool.name,
    {
      description: getWorkspaceSummaryTool.description,
      inputSchema: getWorkspaceSummaryTool.inputSchema as any,
    },
    async (input) => {
      const config = CoreBridge.getConfig();
      const result = await getWorkspaceSummaryTool.handler(input, { config });
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
