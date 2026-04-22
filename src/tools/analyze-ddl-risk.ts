import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyzeDDLRiskTool, CoreBridge } from '@the-andb/core';

export function registerAnalyzeDDLRisk(server: McpServer) {
  server.registerTool(
    analyzeDDLRiskTool.name,
    {
      description: analyzeDDLRiskTool.description,
      inputSchema: analyzeDDLRiskTool.inputSchema as any,
    },
    async (input) => {
      const orchestrator = CoreBridge.getSchemaOrchestrator();
      const config = CoreBridge.getConfig();
      const result = await analyzeDDLRiskTool.handler(input as any, { orchestrator, config });
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
