import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { testConnectionTool, CoreBridge } from '@the-andb/core';

export function registerTestConnection(server: McpServer) {
  server.registerTool(
    testConnectionTool.name,
    {
      description: testConnectionTool.description,
      inputSchema: testConnectionTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await testConnectionTool.handler(input, { orchestrator, config });
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
