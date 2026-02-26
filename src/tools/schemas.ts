import { z } from 'zod';

/**
 * Shared Zod schemas for connection configuration.
 * Used across multiple tools.
 */

/**
 * Inline connection config — for direct connections without andb.yaml
 */
export const ConnectionConfigSchema = z.object({
  host: z.string().describe('Database host or path to SQL dump file'),
  port: z.number().optional().default(3306).describe('Database port'),
  user: z.string().optional().describe('Database username'),
  password: z.string().optional().describe('Database password'),
  database: z.string().describe('Database name'),
  type: z.enum(['mysql', 'dump']).optional().default('mysql').describe('Database type'),
  socketPath: z.string().optional().describe('Unix socket path (alternative to host/port)'),
});

/**
 * Flexible connection input — either env name from andb.yaml, or inline config
 */
export const ConnectionInputSchema = z.union([
  z.object({
    env: z.string().describe('Environment name from andb.yaml (e.g. DEV, PROD)'),
  }),
  z.object({
    connection: ConnectionConfigSchema.describe('Inline database connection configuration'),
  }),
]);

export type ConnectionInput = z.infer<typeof ConnectionInputSchema>;

/**
 * Resolve connection input to the format expected by CoreBridge.
 * If `env` is provided, pass it through (CoreBridge reads from config).
 * If `connection` is provided, set it on the config service first.
 */
export function resolveConnectionPayload(input: ConnectionInput): {
  env: string;
  connectionConfig?: any;
} {
  if ('env' in input) {
    return { env: (input as any).env };
  }

  // For inline connections, use a temp env name and pass config
  return {
    env: '__MCP_INLINE__',
    connectionConfig: (input as any).connection,
  };
}
