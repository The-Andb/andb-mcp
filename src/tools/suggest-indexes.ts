import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { suggestIndexesTool, CoreBridge } from '@the-andb/core';

export function registerSuggestIndexes(server: McpServer) {
  server.registerTool(
    suggestIndexesTool.name,
    {
      description: suggestIndexesTool.description,
      inputSchema: suggestIndexesTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await suggestIndexesTool.handler(input as any, { orchestrator, config });
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
