import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { inspectQueryTool, CoreBridge } from '@the-andb/core';

export function registerInspectQuery(server: McpServer) {
  server.registerTool(
    inspectQueryTool.name,
    {
      description: inspectQueryTool.description,
      inputSchema: inspectQueryTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSecurityOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await inspectQueryTool.handler(input, { orchestrator, config });
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
