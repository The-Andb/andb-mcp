import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSchemaNormalizedTool, CoreBridge } from '@the-andb/core';

export function registerGetSchemaNormalized(server: McpServer) {
  server.registerTool(
    getSchemaNormalizedTool.name,
    {
      description: getSchemaNormalizedTool.description,
      inputSchema: getSchemaNormalizedTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getOrchestrator();
      const config = CoreBridge.getConfig();
      
      try {
        const result = await getSchemaNormalizedTool.handler(input, { orchestrator, config });

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
              text: `Error fetching normalized schema: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
