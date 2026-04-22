import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { compareSchemaTool, CoreBridge } from '@the-andb/core';

export function registerCompareSchema(server: McpServer) {
  server.registerTool(
    compareSchemaTool.name,
    {
      description: compareSchemaTool.description,
      inputSchema: compareSchemaTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await compareSchemaTool.handler(input, { orchestrator, config });
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
