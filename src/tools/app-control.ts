import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { 
  appNavigateTool, 
  appTriggerCompareTool, 
  appFocusObjectTool, 
  appShowToastTool 
} from '@the-andb/core';

export function registerAppControl(server: McpServer) {
  server.registerTool(
    appNavigateTool.name,
    {
      description: appNavigateTool.description,
      inputSchema: appNavigateTool.inputSchema as any,
    },
    async (input) => {
      // Note: When called via MCP (external), the context won't have emitAppEvent 
      // unless we hook it up. But for now, we just call the handler.
      const result = await appNavigateTool.handler(input as any, {});
      return {
        content: [{ type: 'text' as const, text: String(result) }],
      };
    }
  );

  server.registerTool(
    appTriggerCompareTool.name,
    {
      description: appTriggerCompareTool.description,
      inputSchema: appTriggerCompareTool.inputSchema as any,
    },
    async (input) => {
      const result = await appTriggerCompareTool.handler(input as any, {});
      return {
        content: [{ type: 'text' as const, text: String(result) }],
      };
    }
  );

  server.registerTool(
    appFocusObjectTool.name,
    {
      description: appFocusObjectTool.description,
      inputSchema: appFocusObjectTool.inputSchema as any,
    },
    async (input) => {
      const result = await appFocusObjectTool.handler(input as any, {});
      return {
        content: [{ type: 'text' as const, text: String(result) }],
      };
    }
  );

  server.registerTool(
    appShowToastTool.name,
    {
      description: appShowToastTool.description,
      inputSchema: appShowToastTool.inputSchema as any,
    },
    async (input) => {
      const result = await appShowToastTool.handler(input as any, {});
      return {
        content: [{ type: 'text' as const, text: String(result) }],
      };
    }
  );
}
