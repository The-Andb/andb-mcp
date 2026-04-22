import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { diffSemanticTool, CoreBridge } from '@the-andb/core';

export function registerDiffSemantic(server: McpServer) {
  server.registerTool(
    diffSemanticTool.name,
    {
      description: diffSemanticTool.description,
      inputSchema: diffSemanticTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      
      try {
        const result = await diffSemanticTool.handler(input, { orchestrator, config });

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
              text: `Error performing semantic diff: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
