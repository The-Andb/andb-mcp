import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { dataHealthCheckTool, CoreBridge } from '@the-andb/core';

export function registerDataHealthCheck(server: McpServer) {
  server.registerTool(
    dataHealthCheckTool.name,
    {
      description: dataHealthCheckTool.description,
      inputSchema: dataHealthCheckTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const result = await dataHealthCheckTool.handler(input, { orchestrator });
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
