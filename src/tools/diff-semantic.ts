import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CoreBridge } from '@the-andb/core';

export function registerDiffSemantic(server: McpServer) {
  server.registerTool(
    'diff_semantic',
    {
      title: 'Semantic Schema Diff',
      description: 'Perform a deep, semantic comparison between two tables using AST analysis. Identifies specifically what changed (datatype, nullability, defaults) in a human-readable way.',
      inputSchema: z.object({
        source: z.object({
          env: z.string().describe('Source environment name from andb.yaml'),
        }),
        target: z.object({
          env: z.string().describe('Target environment name from andb.yaml'),
        }),
        tableName: z.string().describe('The name of the table to compare'),
      }),
    },
    async (input: { source: { env: string }; target: { env: string }; tableName: string }) => {
      try {
        const { source, target, tableName } = input;

        const result = await CoreBridge.execute('semanticCompare', {
          srcEnv: source.env,
          destEnv: target.env,
          name: tableName,
          type: 'TABLE'
        });

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
