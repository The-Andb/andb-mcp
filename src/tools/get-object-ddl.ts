import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getObjectDDLTool, CoreBridge } from '@the-andb/core';

export function registerGetObjectDDL(server: McpServer) {
  server.registerTool(
    getObjectDDLTool.name,
    {
      description: getObjectDDLTool.description,
      inputSchema: getObjectDDLTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await getObjectDDLTool.handler(input, { orchestrator, config });
      return {
        content: [
          {
            type: 'text' as const,
            text: result as string,
          },
        ],
      };
    }
  );
}
