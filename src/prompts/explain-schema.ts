import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerExplainSchemaPrompt(server: McpServer) {
  server.registerPrompt(
    'explain_schema',
    {
      description: 'Asks the AI to provide a high-level summary and analysis of the database schema structure and purpose.',
      argsSchema: {
        env: z.string().describe('The environment name to analyze (e.g., DEV, PROD)'),
      },
    },
    (args) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please fetch the normalized schema for the "${args.env}" environment using the 'get_schema_normalized' tool. 
            Once you have the schema:
            1. Summarize the main purpose of this database.
            2. Identify key entities and their relationships.
            3. Point out any interesting design patterns or potential optimizations.`,
          },
        },
      ],
    })
  );
}
